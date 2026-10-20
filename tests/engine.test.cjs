const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const enginePath = path.join(__dirname, '../engine.js');
const E = require(enginePath);

test('UMD loads in a browser without a module loader', () => {
  const sandbox = {};
  vm.runInNewContext(fs.readFileSync(enginePath, 'utf8'), sandbox);
  assert.equal(sandbox.LogicEngine.convert('0.625', 10, 2).result, '0.101');
});

test('exact conversions use integer rationals with no floating point drift', () => {
  const cases = [
    ['0.625', 10, 2, '0.101', '5/8'],
    ['101.101', 2, 10, '5.625', '45/8'],
    ['AF.8', 16, 10, '175.5', '351/2'],
    ['17.4', 8, 2, '1111.1', '31/2'],
    ['-3.25', 10, 2, '-11.01', '-13/4'],
    ['.5', 10, 16, '0.8', '1/2'],
    ['+001.000', 2, 16, '1', '1'],
    ['-0.000', 10, 2, '0', '0'],
    ['FFFFFFFFFFFFFFFF', 16, 10, '18446744073709551615', '18446744073709551615'],
    ['0.0000000000000001', 16, 2, '0.' + '0'.repeat(63) + '1', '1/18446744073709551616']
  ];
  for (const [input, from, to, expected, fraction] of cases) {
    const result = E.convert(input, from, to, 64);
    assert.equal(result.result, expected, input);
    assert.equal(result.fraction, fraction, input);
    assert.equal(result.exact, true, input);
    assert.ok(result.steps.length >= 3);
  }
});

test('repeating expansions are explicitly truncated, never advertised as rounded or exact', () => {
  const result = E.convert('0.1', 10, 2, 8);
  assert.equal(result.result, '0.00011001');
  assert.equal(result.exact, false);
  assert.equal(result.fraction, '1/10');
  assert.match(result.steps.at(-1), /truncated, not rounded/);
  assert.equal(E.convert('0.999', 10, 2, 1).result, '0.1');
  assert.equal(E.convert('0.125', 10, 2, 2).exact, false);
  assert.equal(E.convert('0.125', 10, 2, 3).exact, true);
});

test('all integers from 0 through 1023 round-trip independently across all four bases', () => {
  for (let number = 0; number <= 1023; number++) {
    for (const base of [2, 8, 10, 16]) {
      const expected = number.toString(base).toUpperCase();
      assert.equal(E.convert(String(number), 10, base).result, expected);
      assert.equal(E.convert(expected, base, 10).result, String(number));
    }
  }
});

test('dyadic fractions round-trip independently across bases without floating arithmetic', () => {
  for (let numerator = 0; numerator <= 255; numerator++) {
    const whole = numerator >> 4;
    const fractional = numerator & 15;
    const source = whole.toString(16) + '.' + fractional.toString(16);
    const expectedBinary = whole.toString(2) + (fractional ? '.' + fractional.toString(2).padStart(4, '0').replace(/0+$/, '') : '');
    assert.equal(E.convert(source, 16, 2).result, expectedBinary);
    const decimal = E.convert(source, 16, 10);
    assert.equal(decimal.exact, true);
    assert.equal(E.convert(decimal.result, 10, 2).result, expectedBinary);
  }
});

test('conversion rejects malformed values, invalid digits, unsafe numeric input, and invalid limits', () => {
  for (const [value, base] of [['102', 2], ['89', 8], ['A', 10], ['G', 16], ['', 10], ['.', 10], ['1.2.3', 10], ['1e2', 10], ['1 0', 2], ['0x10', 16], ['1/2', 10], ['--1', 10], ['1'.repeat(101), 2]]) {
    assert.throws(() => E.convert(value, base, 2), Error, value);
  }
  for (const base of [0, 3, 32, null, undefined, 'binary']) assert.throws(() => E.convert('1', base, 2));
  for (const precision of [0, -1, 65, 1.5, '8', NaN]) assert.throws(() => E.convert('1', 10, 2, precision));
  assert.throws(() => E.convert(0.1, 10, 2), /as text/);
  assert.throws(() => E.convert(Number.MAX_SAFE_INTEGER + 1, 10, 2), /as text/);
  assert.throws(() => E.convert({}, 10, 2));
});

test('every gate matches its complete truth table', () => {
  const tables = {AND: [0, 0, 0, 1], OR: [0, 1, 1, 1], NAND: [1, 1, 1, 0], NOR: [1, 0, 0, 0], XOR: [0, 1, 1, 0], XNOR: [1, 0, 0, 1]};
  for (const [gate, expected] of Object.entries(tables)) {
    for (let row = 0; row < 4; row++) assert.equal(E.gate(gate, row >> 1, row & 1), expected[row], gate + ' row ' + row);
  }
  assert.deepEqual([E.gate('NOT', 0), E.gate('NOT', 1)], [1, 0]);
  assert.deepEqual([E.gate('BUFFER', 0), E.gate('BUFFER', 1)], [0, 1]);
  assert.equal(E.gate(' and ', true, '1'), 1);
  assert.throws(() => E.gate('AND', 2, 1));
  assert.throws(() => E.gate('OR', 0));
  assert.throws(() => E.gate('NAND', null, 1));
  assert.throws(() => E.gate('INVALID', 0, 0));
});

test('parser enumerates sorted variables and uses NOT, AND, XOR, OR precedence', () => {
  const table = E.truthTable('!A + B ^ C * D');
  assert.deepEqual(table.variables, ['A', 'B', 'C', 'D']);
  assert.equal(table.rows.length, 16);
  for (const {inputs: {A, B, C, D}, output} of table.rows) assert.equal(output, (1 - A) | (B ^ (C & D)));
  assert.deepEqual(table.rows[0].inputs, {A: 0, B: 0, C: 0, D: 0});
  assert.deepEqual(table.rows.at(-1).inputs, {A: 1, B: 1, C: 1, D: 1});
  assert.deepEqual(E.truthTable('B + A').variables, ['A', 'B']);
  assert.deepEqual(E.truthTable('1').rows, [{inputs: {}, output: 1}]);
  assert.equal(E.truthTable('0').rows[0].output, 0);
});

test('parser supports equivalent notation, postfix complement, implicit AND, and grouping', () => {
  const equivalents = ['!(A+B)', '(A+B)\'', '(A | B)′', '~(a∨b)', 'A\'B\'', '¬A · ¬B', "A’ * B’"];
  for (const expression of equivalents) assert.deepEqual(E.truthTable(expression).rows.map(row => row.output), [1, 0, 0, 0], expression);
  assert.deepEqual(E.truthTable('A(B+C)').rows, E.truthTable('A & (B | C)').rows);
  assert.deepEqual(E.truthTable('A ⊕ B').rows, E.truthTable('A ^ B').rows);
  assert.deepEqual(E.truthTable('A\'\'').rows.map(row => row.output), [0, 1]);
  assert.deepEqual(E.truthTable('!A\'').rows.map(row => row.output), [0, 1]);
  assert.deepEqual(E.truthTable('A ^ B + C').rows, E.truthTable('(A ^ B) + C').rows);
});

test('Boolean identities hold on every input, including De Morgan and distributivity', () => {
  for (const [left, right] of [
    ['!(A&B)', '!A+!B'], ['!(A+B)', '!A & !B'], ['A(B+C)', 'AB+AC'],
    ['A+AB', 'A'], ['A+A\'', '1'], ['A A\'', '0'], ['A^(B^C)', '(A^B)^C']
  ]) {
    const l = E.truthTable(left);
    const r = E.truthTable(right);
    for (const row of l.rows) {
      const expected = r.rows.find(candidate => r.variables.every(variable => candidate.inputs[variable] === row.inputs[variable]));
      assert.equal(row.output, expected.output, left + ' = ' + right);
    }
  }
});

test('parser rejects incomplete, unsafe, unsupported, and unbalanced expressions', () => {
  for (const expression of ['', ' ', 'A +', '&A', '()', '(A+B', 'A+B)', 'A && B', 'A || B', "'A", 'E+A', 'A=1', 'A;globalThis.x=1', 'A?B:C', '10', '2', 'A'.repeat(301), null]) {
    assert.throws(() => E.truthTable(expression), Error, String(expression));
  }
});

test('Gray encode/decode round-trip all 256 8-bit words and neighboring words change one bit', () => {
  let previous;
  for (let value = 0; value < 256; value++) {
    const binary = value.toString(2).padStart(8, '0');
    const gray = E.binaryToGray(binary);
    assert.equal(gray.result, (value ^ (value >> 1)).toString(2).padStart(8, '0'));
    assert.equal(E.grayToBinary(gray.result).result, binary);
    assert.equal(gray.steps.length, 8);
    if (previous) assert.equal([...gray.result].filter((bit, i) => bit !== previous[i]).length, 1);
    previous = gray.result;
  }
  assert.equal(E.binaryToGray('0001').result, '0001');
  assert.equal(E.grayToBinary('0').result, '0');
  assert.equal(E.binaryToGray('1').result, '1');
  for (const invalid of ['', '2', '-1', '1.0', '01 01', '0'.repeat(129)]) {
    assert.throws(() => E.binaryToGray(invalid));
    assert.throws(() => E.grayToBinary(invalid));
  }
});

test('BCD and Excess-3 encode each decimal digit separately and preserve leading zeros', () => {
  assert.equal(E.encodeDecimal('259', 'BCD').result, '0010 0101 1001');
  assert.equal(E.encodeDecimal('259', 'Excess-3').result, '0101 1000 1100');
  assert.equal(E.encodeDecimal('007', '8421 BCD').result, '0000 0000 0111');
  assert.equal(E.encodeDecimal('007', 'XS3').result, '0011 0011 1010');
  assert.equal(E.encodeDecimal('09', 'ASCII').result, '00110000 00111001');
  const bcd = E.encodeDecimal('0123456789', 'BCD').result.split(' ');
  const excess = E.encodeDecimal('0123456789', 'EXCESS3').result.split(' ');
  for (let digit = 0; digit < 10; digit++) {
    assert.equal(parseInt(bcd[digit], 2), digit);
    assert.equal(parseInt(excess[digit], 2), digit + 3);
  }
  for (const invalid of ['', '-1', '1.5', 'A', '1 2', '1'.repeat(101)]) assert.throws(() => E.encodeDecimal(invalid, 'BCD'));
  assert.throws(() => E.encodeDecimal('123', 'unknown'));
  assert.throws(() => E.encodeDecimal('123'));
});
