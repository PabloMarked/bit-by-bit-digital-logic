const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const E = require('../engine.js');
const specs = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../visual-logic.js'), 'utf8'), {
  window: {LogicEngine:E, VisualWalkthroughs:{register(spec) { assert.ok(!specs[spec.id]); specs[spec.id] = spec; }}}
});

function result(id, values) {
  const built = specs[id].build(values);
  assert.ok(built.frames.length >= 3 && built.frames.length <= 10);
  assert.equal(typeof built.takeaway, 'string');
  for (const frame of built.frames) {
    assert.equal(typeof frame.title, 'string');
    assert.equal(typeof frame.explain, 'string');
    assert.equal(typeof frame.html, 'string');
    assert.doesNotMatch(frame.html, /undefined|NaN|<script|onclick=/);
    if (frame.html.includes('<svg')) assert.match(frame.html, /role="img" aria-label="[^"]+"/);
  }
  return built;
}

test('six visual logic lessons register with valid defaults and presets', () => {
  assert.equal(Object.keys(specs).length, 6);
  for (const [id, spec] of Object.entries(specs)) {
    const defaults = Object.fromEntries(spec.inputs.map(input => [input.key,input.value]));
    result(id, defaults);
    for (const preset of spec.presets || []) result(id, {...defaults,...preset.values});
  }
});

test('gate walkthrough output agrees with independently stated gate rules for every input', () => {
  const rules = {
    AND:(a,b)=>a&&b, OR:(a,b)=>a||b, XOR:(a,b)=>a!==b,
    NAND:(a,b)=>!(a&&b), NOR:(a,b)=>!(a||b), XNOR:(a,b)=>a===b, NOT:a=>!a
  };
  for (const [gate, rule] of Object.entries(rules)) for (const a of [0,1]) for (const b of [0,1]) {
    const expected = Number(rule(a,b));
    const built = result('gate-signal', {gate,a:String(a),b:String(b)});
    assert.ok(built.frames.at(-1).html.includes('F = <strong>'+expected+'</strong>'));
    assert.match(built.takeaway,new RegExp('produces '+expected+'\\.'));
  }
});

test('three-gate circuit traces all eight input combinations correctly', () => {
  for (const a of [0,1]) for (const b of [0,1]) for (const c of [0,1]) {
    const expected = Number((a || !b) && c);
    const built = result('circuit-trace', {a:String(a),b:String(b),c:String(c)});
    assert.ok(built.frames.at(-1).html.includes('F = '+Number(a || !b)+' · '+c+' = <strong>'+expected+'</strong>'));
    assert.match(built.takeaway,new RegExp('then F = '+expected+'\\.'));
  }
});

test('half adder keeps correct carry and sum order for all four bit pairs', () => {
  for (const a of [0,1]) for (const b of [0,1]) {
    const expected = (a+b).toString(2).padStart(2,'0');
    const built = result('half-adder', {a:String(a),b:String(b)});
    assert.ok(built.frames.at(-1).html.includes('<strong>'+expected+'</strong>₂ = '+(a+b)+'₁₀'));
    assert.ok(built.takeaway.includes('CS = '+expected+'₂'));
  }
});

test('absorption compares the original and reduced circuit in every case', () => {
  for (const a of [0,1]) for (const b of [0,1]) {
    const built = result('boolean-absorption', {a:String(a),b:String(b)});
    const expected = Number(a || (a && b));
    assert.equal(expected,a);
    assert.ok(built.frames.at(-1).html.includes('original output is <strong>'+expected+'</strong> and the simplified output is <strong>'+a+'</strong>'));
  }
});

test('De Morgan diagrams preserve equivalent outputs for all four bit pairs', () => {
  for (const a of [0,1]) for (const b of [0,1]) {
    const left = Number(!(a || b)), right = Number(!a && !b);
    assert.equal(left,right);
    const built = result('demorgan',{a:String(a),b:String(b)});
    assert.ok(built.frames.at(-1).html.includes('(A + B)′ = '+left+' &nbsp; = &nbsp; '+right+' = A′B′'));
  }
});

test('K-map values, Gray column order, minterm reduction and XNOR agree', () => {
  const built = result('kmap-group',{});
  assert.ok(built.frames[0].html.includes('00, 01, 11, 10'));
  const expectedMinterms = [0,2,5,7];
  const table = E.truthTable("A'B'C' + A'BC' + AB'C + ABC");
  const reduced = E.truthTable("A'C' + AC");
  for (const row of table.rows) {
    const {A:a,B:b,C:c} = row.inputs;
    const minterm = 4*a + 2*b + c;
    const expected = Number(expectedMinterms.includes(minterm));
    assert.equal(row.output,expected);
    assert.equal(Number(a===c),expected);
    const reducedRow = reduced.rows.find(r=>r.inputs.A===a && r.inputs.C===c);
    assert.equal(reducedRow.output,expected);
  }
  assert.ok(built.frames[1].html.includes('vl-group-blue'));
  assert.ok(built.frames[2].html.includes('vl-group-gold'));
  assert.ok(built.frames.at(-1).html.includes('A′C′ + AC'));
});

test('invalid bits and unsupported gate names fail before diagram rendering', () => {
  for (const id of ['gate-signal','circuit-trace','half-adder','boolean-absorption','demorgan']) {
    const defaults = Object.fromEntries(specs[id].inputs.map(input=>[input.key,input.value]));
    for (const bad of ['2','01','<img src=x onerror=alert(1)>',null,undefined]) {
      assert.throws(()=>specs[id].build({...defaults,a:bad}),/Choose 0 or 1/);
    }
  }
  for (const gate of ['BUFFER','__proto__','<svg>',null]) {
    assert.throws(()=>specs['gate-signal'].build({gate,a:'1',b:'0'}),/Choose a supported gate/);
  }
});
