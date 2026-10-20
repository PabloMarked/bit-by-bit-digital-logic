/* Independent answer-key audit. This checks course claims, not UI rendering. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dist = path.join(__dirname, '..');
const E = require(path.join(dist, 'engine.js'));
const context = {window: {}};
for (const filename of ['content.js', 'questions.js']) vm.runInNewContext(fs.readFileSync(path.join(dist, filename), 'utf8'), context);
const bank = JSON.parse(JSON.stringify(context.window.QUESTION_BANK));
const course = JSON.parse(JSON.stringify(context.window.COURSE_DATA));
const q = id => bank.find(question => question.id === id);
const answer = id => q(id).answer;
const lesson = (module, id) => course.modules.find(item => item.id === module).lessons.find(item => item.id === id).body;
const plainNumber = value => value.replace(/[₀₁₂₃₄₅₆₇₈₉]+$/, '');

// Small independent rational arithmetic for checking the arithmetic questions.
function rat(value, base = 10) {
  value = plainNumber(String(value));
  let sign = 1n;
  if (/^[+-]/.test(value)) {
    if (value[0] === '-') sign = -1n;
    value = value.slice(1);
  }
  const [whole, fraction = ''] = value.split('.');
  return {n: sign * BigInt(parseInt((whole || '0') + fraction, base)), d: BigInt(base) ** BigInt(fraction.length)};
}
const sum = (a, b) => ({n: a.n * b.d + b.n * a.d, d: a.d * b.d});
const difference = (a, b) => ({n: a.n * b.d - b.n * a.d, d: a.d * b.d});
const product = (a, b) => ({n: a.n * b.n, d: a.d * b.d});
function equalRat(a, b, message) { assert.equal(a.n * b.d, b.n * a.d, message); }
function conversion(id, value, from, to, precision) {
  const computed = E.convert(value, from, to, precision);
  assert.equal(plainNumber(answer(id)), computed.result, id);
}
function output(expression, inputs) {
  const table = E.truthTable(expression);
  return table.rows.find(row => table.variables.every(variable => row.inputs[variable] === inputs[variable])).output;
}
function equivalent(left, right, message) {
  const variables = [...new Set([...E.truthTable(left).variables, ...E.truthTable(right).variables])].sort();
  for (let count = 0; count < 2 ** variables.length; count++) {
    const inputs = Object.fromEntries(variables.map((variable, index) => [variable, (count >> index) & 1]));
    assert.equal(output(left, inputs), output(right, inputs), message + ' at ' + JSON.stringify(inputs));
  }
}
const vector = expression => E.truthTable(expression).rows.map(row => row.output).join('');
const parity = bits => [...bits].reduce((result, bit) => result ^ Number(bit), 0);
const distance = (a, b) => [...a].filter((bit, index) => bit !== b[index]).length;
function tableRows(html, index = 0) {
  const tables = [...html.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)];
  return [...tables[index][1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row => [...row[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(cell => cell[1].replace(/<[^>]+>/g, '').trim()));
}

test('all 72 questions have unique ids, one usable key, worked solutions, and balanced coverage', () => {
  assert.equal(bank.length, 72);
  assert.equal(new Set(bank.map(question => question.id)).size, 72);
  assert.equal(course.modules.length, 6);
  assert.equal(course.modules.reduce((count, module) => count + module.lessons.length, 0), 30);
  for (const module of course.modules) {
    assert.equal(bank.filter(question => question.module === module.id).length, 12, module.id);
    for (const level of ['foundation', 'practice', 'exam']) assert.equal(bank.filter(question => question.module === module.id && question.level === level).length, 4, module.id + ' ' + level);
  }
  for (const question of bank) {
    assert.ok(question.prompt && question.concept && question.answer, question.id);
    assert.ok(question.steps.length >= 4, question.id);
    if (question.type === 'mcq') {
      assert.equal(question.options.length, 4, question.id);
      assert.equal(new Set(question.options).size, 4, question.id);
      assert.equal(question.options.filter(option => option === question.answer).length, 1, question.id);
    } else assert.ok(question.accept.includes(question.answer), question.id);
  }
});

test('all Module 4 Part I numerical keys and recurring expansions are correct', () => {
  conversion('f1-01', '0.101', 2, 10);
  equalRat(rat(answer('f1-02').split('/')[0]), {n: 1n, d: 1n});
  assert.equal(answer('f1-02'), '1/4');
  conversion('f1-03', '0.375', 10, 2);
  assert.equal(answer('f1-04'), 'When its denominator is a power of 2');
  conversion('f1-05', '0.8125', 10, 2);
  conversion('f1-06', '10.011', 2, 10);
  conversion('f1-07', '0.1', 10, 2, 8);
  conversion('f1-08', '3.625', 10, 2);
  conversion('f1-09', '0.6875', 10, 2);
  const [roundedText, errorText] = answer('f1-10').split('; error ');
  const roundedNumerator = (1n * 16n * 2n + 10n) / (10n * 2n);
  equalRat(rat(roundedText, 2), {n: roundedNumerator, d: 16n}, 'f1-10 rounded value');
  equalRat(rat(errorText), difference(rat(roundedText, 2), rat('0.1')), 'f1-10 signed error');
  const values = q('f1-11').options.map(option => ({option, value: rat(option, 2)}));
  values.sort((a, b) => Number(a.value.n * b.value.d - b.value.n * a.value.d));
  assert.equal(answer('f1-11'), values[0].option);
  const recurringBlock = answer('f1-12').match(/^0\.\(([01]+)\)₂$/)[1];
  equalRat({n: BigInt(parseInt(recurringBlock, 2)), d: 2n ** BigInt(recurringBlock.length) - 1n}, rat('0.2'), 'f1-12 recurrence');
});

test('all Module 4 Part II conversion and arithmetic keys are correct', () => {
  for (const [id, value, from, to] of [
    ['f2-01', '0.4', 8, 10], ['f2-02', '0.A', 16, 10], ['f2-03', '0.101011', 2, 8],
    ['f2-04', '0.1101', 2, 16], ['f2-05', '12.34', 8, 10], ['f2-06', '2F.8', 16, 10],
    ['f2-07', '26.6875', 10, 16], ['f2-08', '0.3', 8, 2]
  ]) conversion(id, value, from, to);
  equalRat(rat(answer('f2-09'), 2), rat('A.BC', 16), 'f2-09');
  assert.equal(answer('f2-09').split('.')[1].length, 8);
  equalRat(rat(answer('f2-10'), 2), sum(rat('0.1011', 2), rat('0.011', 2)), 'f2-10');
  equalRat(rat(answer('f2-11'), 2), difference(rat('1.01', 2), rat('0.111', 2)), 'f2-11');
  equalRat(rat(answer('f2-12'), 2), product(rat('0.1', 2), rat('0.11', 2)), 'f2-12');
});

test('all 12 logic-gate quiz answers match exhaustive gate or expression evaluation', () => {
  assert.deepEqual([0, 1, 2, 3].filter(row => E.gate('AND', row >> 1, row & 1)), [3]);
  assert.equal(answer('lg-01'), 'Only when both inputs are 1');
  assert.equal(answer('lg-02'), E.gate('OR', 1, 1) + ' and ' + E.gate('XOR', 1, 1));
  assert.equal(answer('lg-03'), String(E.gate('NAND', 1, 0)));
  assert.equal(answer('lg-04'), String(E.gate('NOT', 0)));
  assert.equal(answer('lg-05'), vector('A ^ B'));
  assert.equal(answer('lg-06'), String(output('AB + !C', {A: 1, B: 0, C: 0})));
  for (let row = 0; row < 4; row++) assert.equal(E.gate('NOT', E.gate('NAND', row >> 1, row & 1)), E.gate(answer('lg-07'), row >> 1, row & 1));
  assert.equal(answer('lg-08'), [...'1010'].map((bit, index) => E.gate('XNOR', Number(bit), Number('1100'[index]))).join(''));
  assert.equal(answer('lg-09'), vector('(A+B)A′'));
  assert.equal(answer('lg-10'), '(' + E.gate('XOR', 1, 1) + ', ' + E.gate('AND', 1, 1) + ')');
  assert.equal(answer('lg-11'), 'Connect both inputs to A');
  for (const a of [0, 1]) assert.equal(E.gate('NAND', a, a), E.gate('NOT', a));
  assert.equal(answer('lg-12'), vector('AB + A′C'));
});

test('all 12 binary-code quiz answers match code mappings, parity, and ASCII', () => {
  assert.equal(answer('bc-01'), E.encodeDecimal('59', 'BCD').result);
  assert.deepEqual(q('bc-02').options.filter(option => parseInt(option, 2) > 9), [answer('bc-02')]);
  assert.equal(answer('bc-03'), (12).toString(2) + '; ' + E.encodeDecimal('12', 'BCD').result);
  assert.equal(answer('bc-04'), [3, 2, 1, 0].map(power => 2 ** power).join(', '));
  assert.equal(answer('bc-05'), E.encodeDecimal('7', 'Excess-3').result);
  assert.equal(answer('bc-06'), String(parseInt('0110', 2) - 3));
  assert.equal(answer('bc-07'), String(1 ^ parity('1011001')));
  assert.equal(answer('bc-08'), String(parity('1011011')));
  assert.equal(answer('bc-09'), E.encodeDecimal(String(8 + 7), 'BCD').result);
  assert.equal(answer('bc-10'), 'A'.charCodeAt(0).toString(2).padStart(8, '0'));
  assert.equal(answer('bc-11'), 'Every odd number of bit flips is detected, but an even number can go undetected');
  // Enumerate every nonempty 8-bit error mask against a valid even-parity word.
  for (let mask = 1; mask < 256; mask++) {
    const received = (parseInt('10110010', 2) ^ mask).toString(2).padStart(8, '0');
    assert.equal(parity(received), parity(mask.toString(2)));
  }
  assert.equal(answer('bc-12'), String((15 ^ parseInt('0111', 2)) - 3));
});

test('all 12 Boolean-algebra keys hold for every input combination', () => {
  for (const [id, expression] of [
    ['ba-01', 'A+0'], ['ba-02', 'AA'], ['ba-03', 'A+A′'], ['ba-05', 'A+AB'],
    ['ba-06', 'A(A+B)'], ['ba-07', '(A+B)′'], ['ba-08', 'AB+AB′'],
    ['ba-09', '(A+B)(A+B′)'], ['ba-12', 'AB+A′C+BC']
  ]) equivalent(expression, answer(id), id);
  assert.equal(answer('ba-04'), 'NOT, then AND, then OR');
  equivalent('!A+BC', '(!A)+(BC)', 'ba-04');
  for (const row of E.truthTable('A′B+AB′').rows) assert.equal(row.output, E.gate(answer('ba-10'), row.inputs.A, row.inputs.B));
  const minterms = [1, 3, 5, 7];
  for (let row = 0; row < 8; row++) assert.equal(output(answer('ba-11'), {A: row >> 2, B: (row >> 1) & 1, C: row & 1}), Number(minterms.includes(row)));
});

test('all 12 Gray-code keys match the actual standard reflected ordering', () => {
  assert.equal(answer('gc-01'), 'Adjacent codewords differ in exactly one bit');
  const sequence = Array.from({length: 16}, (_, i) => E.binaryToGray(i.toString(2).padStart(4, '0')).result);
  sequence.forEach((word, index) => assert.equal(distance(word, sequence[(index + 1) % 16]), 1));
  for (const [id, binary] of [['gc-02', '1011'], ['gc-05', '0110'], ['gc-09', '10101']]) assert.equal(answer(id), E.binaryToGray(binary).result);
  for (const [id, gray] of [['gc-03', '1101'], ['gc-06', '1010'], ['gc-10', '10010']]) assert.equal(answer(id), E.grayToBinary(gray).result);
  assert.equal(answer('gc-04'), 'Its bits do not have fixed positional weights that can simply be summed to obtain the represented value');
  assert.equal(parseInt(E.grayToBinary('110').result, 2), 4);
  assert.equal(answer('gc-07'), E.binaryToGray('100').result);
  assert.equal(answer('gc-08'), String(distance('0111', '0101')));
  const nonAdjacent = q('gc-11').options.filter(option => {
    const [from, to] = option.split(' → ');
    const gap = Math.abs(sequence.indexOf(from) - sequence.indexOf(to));
    return gap !== 1 && gap !== 15;
  });
  assert.deepEqual(nonAdjacent, [answer('gc-11')]);
  assert.equal(answer('gc-12'), E.binaryToGray((23).toString(2).padStart(5, '0')).result);
});

test('published gate, intermediate-signal, and half-adder lesson tables match calculation', () => {
  for (const row of tableRows(lesson('logic-gates', 'gate-truth-tables'))) {
    const [a, b, ...values] = row.map(Number);
    assert.deepEqual(values, ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'].map(name => E.gate(name, a, b)));
  }
  for (const row of tableRows(lesson('logic-gates', 'trace-circuits'))) {
    const [a, b, c, n, p, y] = row.map(Number);
    assert.equal(n, 1 - b);
    assert.equal(p, a | n);
    assert.equal(y, p & c);
  }
  for (const row of tableRows(lesson('logic-gates', 'useful-circuits'))) {
    const [a, b, s, c, total] = row.map(Number);
    assert.equal(s, a ^ b);
    assert.equal(c, a & b);
    assert.equal(total, 2 * c + s);
    assert.equal(total, a + b);
  }
});

test('published BCD, canonical Aiken, Excess-3 and ASCII lesson tables are correct', () => {
  const rows = tableRows(lesson('binary-codes', 'aiken-excess'));
  for (const [digitText, bcd, aiken, excess] of rows) {
    const digit = Number(digitText);
    assert.equal(bcd, E.encodeDecimal(digitText, 'BCD').result);
    assert.equal(excess, E.encodeDecimal(digitText, 'Excess-3').result);
    assert.equal([...aiken].reduce((value, bit, i) => value + Number(bit) * [2, 4, 2, 1][i], 0), digit);
    assert.equal(parseInt(aiken, 2) ^ 15, parseInt(rows[9 - digit][2], 2));
  }
  for (const [character, decimal, hex, binary] of tableRows(lesson('binary-codes', 'ascii'))) {
    const code = (character === 'Space' ? ' ' : character).charCodeAt(0);
    assert.equal(Number(decimal), code);
    assert.equal(hex, code.toString(16).toUpperCase());
    assert.equal(binary, code.toString(2).padStart(7, '0'));
  }
});

test('published minterm and maxterm rows, canonical simplification, and K-map examples are correct', () => {
  for (const [bits, indexText, minterm, maxterm] of tableRows(lesson('boolean-algebra', 'canonical-forms'))) {
    const index = Number(indexText);
    assert.equal(parseInt(bits, 2), index);
    assert.equal(vector(minterm), Array.from({length: 8}, (_, row) => Number(row === index)).join(''));
    assert.equal(vector(maxterm), Array.from({length: 8}, (_, row) => Number(row !== index)).join(''));
  }
  equivalent('A′B′C+A′BC′+A′BC+AB′C+ABC', 'C+A′B', 'canonical SOP simplification');
  equivalent('(A+B+C)(A′+B+C)(A′+B′+C)', '(C+A′)(C+B)', 'canonical POS simplification');
  for (let row = 0; row < 8; row++) assert.equal(output('A′C′+AC', {A: row >> 2, B: (row >> 1) & 1, C: row & 1}), Number([0, 2, 5, 7].includes(row)));
  for (let row = 0; row < 16; row++) assert.equal(output('B′D′', {A: row >> 3, B: (row >> 2) & 1, C: (row >> 1) & 1, D: row & 1}), Number([0, 2, 8, 10].includes(row)));
});

test('published Gray-code sequence and converter tables are correct', () => {
  const rows = tableRows(lesson('gray-code', 'gray-purpose'));
  for (const [count, binary, gray] of rows) {
    assert.equal(parseInt(binary, 2), Number(count));
    assert.equal(gray, E.binaryToGray(binary).result);
    assert.equal(E.grayToBinary(gray).result, binary);
  }
  assert.equal(tableRows(lesson('gray-code', 'binary-to-gray')).map(row => row[2]).join(''), E.binaryToGray('10110').result);
  assert.equal(tableRows(lesson('gray-code', 'gray-to-binary')).map(row => row[2]).join(''), E.grayToBinary('11101').result);
});

test('worked fractional and signed-arithmetic lesson examples match independent calculations', () => {
  for (const [source, from, to, expected] of [
    ['101.101', 2, 10, '5.625'], ['2A.C', 16, 10, '42.75'], ['13.625', 10, 2, '1101.101'],
    ['0.6875', 10, 16, '0.B'], ['101101.01101', 2, 8, '55.32'], ['101101.01101', 2, 16, '2D.68'],
    ['7.4', 8, 16, '7.8'], ['10.375', 10, 2, '1010.011'], ['3.A', 16, 10, '3.625']
  ]) assert.equal(E.convert(source, from, to).result, expected);
  equalRat(sum(rat('101.101', 2), rat('10.011', 2)), rat('1000.000', 2));
  equalRat(difference(rat('101.010', 2), rat('10.101', 2)), rat('010.101', 2));
  equalRat(product(rat('10.11', 2), rat('1.01', 2)), rat('11.0111', 2));
  assert.equal((parseInt('11010100', 2) - 256) / 16, -2.75);
  assert.equal((2.375 * 16).toString(2).padStart(8, '0'), '00100110');
  assert.equal(((256 - 13) & 255).toString(2).padStart(8, '0'), '11110011');
  assert.equal((parseInt('11101011', 2) - 256) / 8, -2.625);
  assert.equal((23 + (256 - 9)) & 255, 14);
  assert.equal((9 + (256 - 23)) & 255, parseInt('11110010', 2));
  assert.equal((100 + 60).toString(2), '10100000');
  assert.equal(100 + 60 - 256, -96);
});
