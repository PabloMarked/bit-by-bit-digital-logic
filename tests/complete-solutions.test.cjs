const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dist = path.join(__dirname, '..');
const E = require(path.join(dist, 'engine.js'));
const context = {LogicEngine:E}; context.window=context;
for (const name of ['questions.js','solutions-fractions.js','solutions-logic.js','quiz2-data.js','conversion-worked.js','solutions.js']) vm.runInNewContext(fs.readFileSync(path.join(dist,name),'utf8'),context,{filename:name});
const bank = context.window.QUESTION_BANK, quiz = context.window.QUIZ2_DATA.questions;
function rational(input,base) {
  let s=String(input),sign=1n;if(s.startsWith('-')){sign=-1n;s=s.slice(1);}if(s.startsWith('+'))s=s.slice(1);
  const [whole,frac='']=s.split('.');let n=0n;for(const c of (whole||'0')+frac)n=n*BigInt(base)+BigInt(parseInt(c,36));
  return {n:n*sign,d:BigInt(base)**BigInt(frac.length)};
}
const equal = (a,b,message)=>assert.equal(a.n*b.d,b.n*a.d,message);
test('all 72 questions provide complete explanations, arithmetic tables and independent checks',()=>{
  assert.equal(bank.length,72);
  for(const q of bank){
    assert.ok(q.worked,q.id);const w=q.worked;
    assert.ok(w.method&&w.given&&w.pitfall,q.id);
    assert.ok(w.steps.length>=4,q.id);
    for(const s of w.steps)assert.ok(s.title&&s.explanation,q.id);
    assert.ok(w.check.length>0,q.id);
    for(const t of w.tables||[]){assert.ok(t.caption&&t.headers.length>0&&t.rows.length>0,q.id);for(const r of t.rows)assert.equal(r.length,t.headers.length,q.id+' '+t.caption);}
    const html=context.window.StudySolutions.html(q);
    assert.ok(html.includes('Check the answer')&&html.includes('Follow every step'),q.id);
    assert.equal((html.match(/class="solution-step-number"/g)||[]).length,w.steps.length,q.id);
  }
});
test('all 15 Quiz #2 exact answers preserve the source rational value',()=>{
  const expected=['0.669921875','0.1101','0.E8','0.56','0.520','58.78125','0.0111','0.BC','0.7109375','0.46','0.4765625','0.1011','0.703125','0.84375','0.74'];
  assert.equal(quiz.length,15);
  for(const [i,q] of quiz.entries()){
    assert.equal(q.id,i+1);assert.equal(q.answer,expected[i]);equal(rational(q.input,q.sourceBase),rational(q.answer,q.targetBase),'Quiz2 '+q.id);
    assert.ok(q.steps.length>=9&&q.check.length>0&&q.setup.length>0,q.id);
    if(q.requestedPlaces)assert.equal(q.answer.split('.')[1].length,q.requestedPlaces,q.id);
  }
});
test('every Quiz #2 multiplication row carries the correct remainder to the next row',()=>{
  for(const q of quiz.filter(q=>q.method==='repeated-multiply')){
    let previous=rational(q.input,10);let digits='';
    for(const r of q.rows){
      const current=rational(r.current,10),product=rational(r.product,10),remainder=rational(r.remainder,10);
      equal(current,previous,'Current remainder '+q.id);equal(product,{n:current.n*BigInt(r.base),d:current.d},'Product '+q.id);
      assert.equal(product.n/product.d,BigInt(r.digitValue),'Digit '+q.id);
      equal(remainder,{n:product.n-BigInt(r.digitValue)*product.d,d:product.d},'Remainder '+q.id);
      previous=remainder;digits+=r.digit;
    }
    assert.equal(digits,q.answer.split('.')[1],q.id);assert.equal(previous.n,0n,q.id);
  }
});
test('every Quiz #2 place-value contribution and final sum is exact',()=>{
  for(const q of quiz.filter(q=>q.method==='place-value')){
    let total={n:0n,d:1n};
    for(const r of q.rows){
      const weight = r.power>=0 ? {n:BigInt(q.sourceBase)**BigInt(r.power),d:1n} : {n:1n,d:BigInt(q.sourceBase)**BigInt(-r.power)};
      const term={n:weight.n*BigInt(r.digitValue),d:weight.d};equal(term,rational(r.decimal,10),'Contribution '+q.id);
      total={n:total.n*term.d+term.n*total.d,d:total.d*term.d};
    }
    equal(total,rational(q.answer,10),'Total '+q.id);
  }
});
test('precision and radix ambiguities are explained without claiming a professor key',()=>{
  assert.ok(quiz[8].precisionNote.includes('0.71094'));
  assert.ok(quiz[12].precisionNote.includes('0.70313')&&quiz[12].precisionNote.includes('even'));
  for(const i of [2,7,9,11,14])assert.ok(quiz[i].formatNote.includes('0.'));
  assert.equal(quiz[4].rows[2].current,'0');assert.equal(quiz[4].rows[2].digit,'0');
});
test('guided help reveals only the requested steps before the complete walkthrough',()=>{
  const S=context.window.StudySolutions,q=bank[0];
  assert.equal((S.coach(q,0).match(/class="solution-step-number"/g)||[]).length,0);
  assert.equal((S.coach(q,1).match(/class="solution-step-number"/g)||[]).length,1);
  assert.ok(S.coach(q,q.worked.steps.length).includes('Complete answer:'));
});
test('adjustable converter produces complete worked data for all supported base pairs',()=>{
  for(const from of [2,8,10,16])for(const to of [2,8,10,16])for(const value of ['0','1','10.1','-1.01']){
    const w=context.window.ConversionWorked.build(value,from,to,12);
    assert.ok(w.method&&w.given&&w.steps.length&&w.check.length,`${value} ${from} ${to}`);
    for(const t of w.tables||[])for(const row of t.rows)assert.equal(row.length,t.headers.length);
  }
  for(const [value,from,to,precision] of [['0.1',10,2,8],['3A.C8',16,10,16],['0.65625',10,8,3],['FFFFFFFFFFFF.0123456789ABCDEF',16,2,64]]){
    const w=context.window.ConversionWorked.build(value,from,to,precision);assert.ok(w.steps.length>2);assert.ok(w.tables.length>0);
  }
});
