const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const E = require('../engine.js');
const registered = new Map();
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../visual-codes.js'), 'utf8'), {
  window: { LogicEngine: E, VisualWalkthroughs: { register(entry) { registered.set(entry.id, entry); } } }
});
const entry = id => registered.get(id);
const binary = (value, width) => value.toString(2).padStart(width, '0');
const ones = value => [...value].filter(b => b === '1').length;
const finalResult = walkthrough => walkthrough.frames.at(-1).html.match(/data-result="([01]+)"/)[1];

test('all five code visualizations register and presets produce bounded valid frames', () => {
  assert.deepEqual([...registered.keys()], ['digit-encoding', 'parity-check', 'binary-gray', 'gray-reflection', 'gray-encoder']);
  for (const item of registered.values()) {
    const values = Object.fromEntries(item.inputs.map(input => [input.key, input.value]));
    for (const preset of [{ values }, ...(item.presets || [])]) {
      const result = item.build({ ...values, ...preset.values });
      assert.ok(result.frames.length >= 1 && result.frames.length <= 12, item.id);
      assert.ok(result.takeaway.length > 20, item.id);
      for (const frame of result.frames) {
        assert.ok(frame.title && frame.explain && frame.html, item.id);
        assert.ok(!/undefined|NaN|<script|onclick=/.test(frame.html), item.id);
        for (const svg of frame.html.matchAll(/<svg\b([^>]*)>/g)) {
          assert.match(svg[1], /role="img"/, item.id);
          assert.match(svg[1], /aria-label="[^"]+"/, item.id);
        }
      }
    }
  }
});

test('all decimal digits use exact BCD, Excess-3, standard Aiken, and ASCII codewords', () => {
  const aiken = ['0000', '0001', '0010', '0011', '0100', '1011', '1100', '1101', '1110', '1111'];
  for (let d = 0; d <= 9; d++) {
    const result = entry('digit-encoding').build({ digits: String(d) });
    const html = result.frames.map(frame => frame.html).join('');
    const expected = { bcd: binary(d, 4), excess: binary(d + 3, 4), aiken: aiken[d], ascii: binary(48 + d, 8) };
    for (const [scheme, codeword] of Object.entries(expected)) {
      assert.match(html, new RegExp('data-code="' + scheme + '" data-digit="' + d + '" data-bits="' + codeword + '"'));
      assert.match(result.frames.at(-1).html, new RegExp('data-result="' + scheme + '">' + codeword));
    }
    assert.equal([...aiken[d]].reduce((sum, bit, index) => sum + Number(bit) * [2, 4, 2, 1][index], 0), d);
    assert.equal(aiken[9 - d], [...aiken[d]].map(bit => bit === '0' ? '1' : '0').join(''));
  }
  const zero = entry('digit-encoding').build({ digits: '007' }).frames.at(-1).html;
  assert.match(zero, /data-result="bcd">0000 0000 0111/);
  assert.match(zero, /data-result="ascii">00110000 00110000 00110111/);
  for (const digits of ['', '12.5', '-4', '12345', '<img>', '1e2', '١']) assert.throws(() => entry('digit-encoding').build({ digits }));
});

test('every bit string of width 1–8 converts correctly in both Gray directions', () => {
  for (let width = 1; width <= 8; width++) {
    for (let n = 0; n < 2 ** width; n++) {
      const input = binary(n, width);
      const toGray = entry('binary-gray').build({ bits: input, direction: 'binary-gray' });
      const toBinary = entry('binary-gray').build({ bits: input, direction: 'gray-binary' });
      assert.equal(finalResult(toGray), E.binaryToGray(input).result, input);
      assert.equal(finalResult(toBinary), E.grayToBinary(input).result, input);
      assert.equal(finalResult(toGray).length, width);
      assert.equal(finalResult(toBinary).length, width);
      assert.equal(toGray.frames.length, width + 2);
    }
  }
  for (const bits of ['', '010101010', '2', '1.0', '<svg>']) assert.throws(() => entry('binary-gray').build({ bits, direction: 'binary-gray' }));
  assert.throws(() => entry('binary-gray').build({ bits: '01', direction: 'backwards' }));
});

test('parity generation and receiver decisions are exhaustive through eight data bits', () => {
  for (let width = 1; width <= 8; width++) {
    for (let n = 0; n < 2 ** width; n++) {
      const data = binary(n, width);
      for (const mode of ['even', 'odd']) {
        const target = mode === 'odd' ? 1 : 0;
        const expectedParity = target ^ (ones(data) % 2);
        const sent = data + expectedParity;
        for (const error of ['none', 'single', 'parity', 'double']) {
          const result = entry('parity-check').build({ data, mode, error });
          assert.match(result.frames[1].html, new RegExp('data-parity="' + expectedParity + '"'));
          const mask = [...sent].map((_, i) => ((error === 'single' || error === 'double') && i === 0) || ((error === 'parity' || error === 'double') && i === sent.length - 1) ? 1 : 0);
          const received = [...sent].map((bit, i) => Number(bit) ^ mask[i]).join('');
          assert.match(result.frames[2].html, new RegExp('data-received="' + received + '"'));
          const expectedPass = ones(received) % 2 === target;
          assert.match(result.frames[4].html, new RegExp('data-status="' + (expectedPass ? 'pass' : 'fail') + '"'));
          assert.equal(expectedPass, error === 'none' || error === 'double');
        }
      }
    }
  }
  for (const values of [{ data: '', mode: 'even', error: 'none' }, { data: '10', mode: 'any', error: 'none' }, { data: '1', mode: 'odd', error: 'three' }]) assert.throws(() => entry('parity-check').build(values));
});

test('the reflected construction has the exact cyclic three-bit Gray sequence', () => {
  const result = entry('gray-reflection').build({});
  const codes = [...result.frames.at(-1).html.matchAll(/data-gray="([01]+)"/g)].map(match => match[1]);
  assert.deepEqual(codes, ['000', '001', '011', '010', '110', '111', '101', '100']);
  assert.equal(new Set(codes).size, 8);
  for (let index = 0; index < codes.length; index++) assert.equal([...codes[index]].filter((bit, i) => bit !== codes[(index + 1) % 8][i]).length, 1);
});

test('every 3/4-track encoder transition preserves bit width and changes exactly one Gray track', () => {
  for (const width of [3, 4]) {
    for (let n = 0; n < 2 ** width; n++) {
      const result = entry('gray-encoder').build({ width: String(width), position: String(n) });
      const old = binary(n, width), next = binary((n + 1) % 2 ** width, width);
      const match = result.frames[3].html.match(/data-transition="gray" data-old="([01]+)" data-new="([01]+)" data-changes="(\d+)"/);
      assert.equal(match[1], E.binaryToGray(old).result);
      assert.equal(match[2], E.binaryToGray(next).result);
      assert.equal(match[3], '1');
      const bMatch = result.frames[1].html.match(/data-changes="(\d+)"/);
      assert.equal(Number(bMatch[1]), [...old].filter((bit, i) => bit !== next[i]).length);
    }
  }
  for (const [width, position] of [['3', '8'], ['4', '16'], ['3', '-1'], ['4', '1.5'], ['4', ''], ['4', '1e1'], ['5', '0']]) assert.throws(() => entry('gray-encoder').build({ width, position }));
});
