const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const entries = new Map();
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../visual-fractions.js'), 'utf8'), {
  window: { VisualWalkthroughs: { register: spec => entries.set(spec.id, spec) } }
});
const build = (id, values) => entries.get(id).build(values);
const binary = (scaled, fraction) => {
  const bits = scaled.toString(2).padStart(fraction + 1, '0');
  return bits.slice(0, -fraction) + '.' + bits.slice(-fraction);
};
const answer = (result, base='₂') => {
  const match = result.takeaway.match(new RegExp(' = ([01]+\\.[01]+)' + base));
  assert.ok(match, result.takeaway);
  return match[1];
};
const decimal = bits => {
  const [a, b] = bits.split('.');
  return parseInt(a, 2) + parseInt(b, 2) / (2 ** b.length);
};
test('all six original fraction examples have titled, accessible SVG frames', () => {
  assert.equal(entries.size, 6);
  for (const spec of entries.values()) {
    const values = Object.fromEntries(spec.inputs.map(input => [input.key, input.value]));
    const result = spec.build(values);
    assert.ok(result.frames.length > 1 && result.frames.length <= 12, spec.id);
    for (const frame of result.frames) {
      assert.ok(frame.title && frame.explain && frame.html, spec.id);
      assert.match(frame.html, /role="img" aria-label="[^"]+"/);
      assert.doesNotMatch(frame.html, /(?:NaN|undefined|Infinity)/);
    }
  }
});
test('every preset builds and respects the 12-frame limit', () => {
  for (const spec of entries.values()) for (const preset of spec.presets || []) {
    const result = spec.build(preset.values);
    assert.ok(result.frames.length <= 12, spec.id + ': ' + preset.label);
  }
});
test('place values preserve exact binary fractions, including every displayed bit', () => {
  const result = build('place-value', { bits: '1111.111111' });
  assert.match(result.takeaway, /15\.984375/);
  assert.equal(result.frames.length, 12);
  assert.match(build('place-value', { bits: '0.001011' }).takeaway, /0\.171875/);
  assert.match(build('place-value', { bits: '0.000000' }).takeaway, /= 0₁₀/);
});
test('multiply fractions uses exact remainders and marks nontermination approximate', () => {
  assert.match(build('multiply-fraction', { decimal: '0.625', base: '2' }).takeaway, /= 0\.101/);
  assert.match(build('multiply-fraction', { decimal: '0.6875', base: '16' }).takeaway, /= 0\.B/);
  assert.match(build('multiply-fraction', { decimal: '0.625', base: '8' }).takeaway, /= 0\.5/);
  const repeating = build('multiply-fraction', { decimal: '0.1', base: '2' });
  assert.match(repeating.takeaway, /≈ 0\.00011001/);
  assert.match(repeating.frames.at(-1).explain, /remainder has repeated/);
  assert.match(build('multiply-fraction', { decimal: '0', base: '2' }).takeaway, /= 0\.0/);
  assert.match(build('multiply-fraction', { decimal: '1', base: '2' }).takeaway, /= 1\.0/);
});
test('grouping pads only the exterior and preserves original value', () => {
  assert.match(build('grouping', { bits: '101101.01101', base: '16' }).takeaway, /= 2D\.68₁₆/);
  assert.match(build('grouping', { bits: '101101.01101', base: '8' }).takeaway, /= 55\.32₈/);
  for (let whole=0; whole<256; whole+=7) for (let part=0; part<256; part+=13) for(const base of [8,16]) {
    const b=whole.toString(2)+'.'+part.toString(2).padStart(8,'0');
    const result=build('grouping',{bits:b,base:String(base)});
    const match=result.takeaway.match(/ = ([0-9A-F]+)\.([0-9A-F]+)/);
    assert.ok(match,result.takeaway);
    assert.equal(parseInt(match[1],base)+parseInt(match[2],base)/(base**match[2].length),whole+part/256);
  }
});
test('carry and borrow results match independently scaled integer arithmetic', () => {
  for(let f=1;f<=4;f++) for(let a=0;a<16*(2**f);a+=7) for(let b=0;b<16*(2**f);b+=11) {
    const av=binary(a,f),bv=binary(b,f);
    const added=build('binary-arithmetic',{a:av,b:bv,op:'+'});
    assert.equal(decimal(answer(added)),(a+b)/(2**f));
    assert.ok(added.frames.length<=12);
    if(a>=b) {
      const sub=build('binary-arithmetic',{a:av,b:bv,op:'-'});
      assert.equal(decimal(answer(sub)),(a-b)/(2**f));
      assert.ok(sub.frames.length<=12);
    }
  }
});
test('borrowing explicitly splits a whole through the point', () => {
  const result=build('binary-arithmetic',{a:'1.00',b:'0.01',op:'-'});
  assert.match(result.takeaway, /= 0\.11₂ = 0\.75₁₀/);
  assert.match(result.frames[1].explain,/donor loses 1, each crossed zero keeps 1, and the active column receives 2/);
  assert.match(result.frames[1].html,/2 − 1 = 1/);
  assert.match(build('binary-arithmetic',{a:'0.11',b:'0.01',op:'+'}).takeaway,/= 1\.00₂ = 1₁₀/);
});
test('all 256 signed fixed-point words decode correctly at each scale', () => {
  for(const fraction of [2,3,4])for(let raw=0;raw<256;raw++) {
    const result=build('fixed-point',{bits:raw.toString(2).padStart(8,'0'),fraction:String(fraction)});
    const signed=raw>=128?raw-256:raw;
    assert.ok(result.takeaway.includes('represents '+String(signed/(2**fraction))+'.'),result.takeaway);
    assert.equal(result.frames.length,10);
  }
});
test('multiplication restores all fractional places after integer partial products', () => {
  assert.match(build('binary-multiplication',{a:'10.1',b:'1.1'}).takeaway,/= 11\.11₂ = 3\.75₁₀/);
  for(let fa=1;fa<=2;fa++)for(let fb=1;fb<=2;fb++)for(let a=0;a<8*(2**fa);a+=3)for(let b=0;b<8*(2**fb);b+=5) {
    const result=build('binary-multiplication',{a:binary(a,fa),b:binary(b,fb)});
    assert.equal(decimal(answer(result)),a*b/(2**(fa+fb)));
    assert.ok(result.frames.length<=12);
  }
});
test('malformed inputs fail clearly instead of emitting broken diagrams', () => {
  for(const value of ['<script>','10.2','1','1.1010101','11111.0']) assert.throws(()=>build('place-value',{bits:value}));
  for(const value of ['-0.2','1.1','0.1234567','x'])assert.throws(()=>build('multiply-fraction',{decimal:value,base:'2'}));
  assert.throws(()=>build('binary-arithmetic',{a:'0.0',b:'1.0',op:'-'}),/first value at least as large/);
  assert.throws(()=>build('fixed-point',{bits:'101',fraction:'3'}),/exactly eight/);
});
