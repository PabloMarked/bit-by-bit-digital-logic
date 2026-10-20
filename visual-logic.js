(function () {
  'use strict';
  var register = window.VisualWalkthroughs.register;
  var E = window.LogicEngine;
  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function bit(values, key) { if (!/^[01]$/.test(String(values[key]))) throw new Error('Choose 0 or 1 for ' + key.toUpperCase() + '.'); return Number(values[key]); }
  function binary(key, label, value) { return {key:key,label:label,type:'select',value:String(value),options:[{value:'0',label:'0 · LOW'},{value:'1',label:'1 · HIGH'}]}; }
  function sig(value) { return value === null ? '?' : String(value); }
  function svg(label, body, width, height) { return '<div class="vl-diagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(width || 660)+' '+(height || 250)+'" role="img" aria-label="'+esc(label)+'">'+body+'</svg></div>'; }
  function text(x, y, label, cls, anchor) { return '<text x="'+x+'" y="'+y+'" class="'+(cls || 'vl-label')+'" text-anchor="'+(anchor || 'middle')+'">'+esc(label)+'</text>'; }
  function wire(path, value, focus) { return '<path d="'+path+'" class="vl-wire '+(value === 1 ? 'vl-one' : value === 0 ? 'vl-zero' : 'vl-unknown')+(focus ? ' vl-focused' : '')+'"/>'; }
  function terminal(x,y,label,value,focus) { return '<g class="vl-terminal '+(value === 1 ? 'vl-high' : value === 0 ? 'vl-low' : 'vl-pending')+(focus?' vl-focused':'')+'"><circle cx="'+x+'" cy="'+y+'" r="23"/>'+text(x,y+7,sig(value),'vl-digit')+text(x,y-36,label,'vl-label')+'</g>'; }
  function gate(type,x,y,w,h,active) {
    var invert = ['NAND','NOR','XNOR'].indexOf(type) >= 0;
    var base = type === 'NAND' ? 'AND' : type === 'NOR' ? 'OR' : type === 'XNOR' ? 'XOR' : type;
    var shape = '';
    if (base === 'NOT') shape = '<path d="M '+x+' '+y+' L '+(x+w-12)+' '+(y+h/2)+' L '+x+' '+(y+h)+' Z"/><circle cx="'+(x+w-6)+'" cy="'+(y+h/2)+'" r="6"/>';
    else if (base === 'AND') shape = '<path d="M '+x+' '+y+' H '+(x+w*.45)+' C '+(x+w*1.18)+' '+y+' '+(x+w*1.18)+' '+(y+h)+' '+(x+w*.45)+' '+(y+h)+' H '+x+' Z"/>';
    else shape = '<path d="M '+x+' '+y+' Q '+(x+w*.64)+' '+(y-3)+' '+(x+w)+' '+(y+h/2)+' Q '+(x+w*.64)+' '+(y+h+3)+' '+x+' '+(y+h)+' Q '+(x+w*.3)+' '+(y+h/2)+' '+x+' '+y+' Z"/>'+(base === 'XOR' ? '<path d="M '+(x-10)+' '+y+' Q '+(x+w*.21)+' '+(y+h/2)+' '+(x-10)+' '+(y+h)+'" class="vl-gate-extra"/>' : '');
    if (invert) shape += '<circle cx="'+(x+w+6)+'" cy="'+(y+h/2)+'" r="6"/>';
    return '<g class="vl-gate'+(active ? ' vl-gate-active':'')+'">'+shape+'</g>'+text(x+w*.48,y+h+26,type,'vl-gate-name');
  }
  function note(html) { return '<div class="vl-observation">'+html+'</div>'; }
  function equation(html) { return '<div class="vl-equation">'+html+'</div>'; }
  function legend() { return '<div class="vl-legend"><span><i class="vl-legend-one"></i><b>1</b> HIGH · solid wire</span><span><i class="vl-legend-zero"></i><b>0</b> LOW · dashed wire</span></div>'; }
  function frame(title,explain,html) { return {title:title,explain:explain,html:html}; }

  var gateDescriptions = {
    AND:['Both inputs must be 1.','A · B'], OR:['At least one input must be 1.','A + B'], XOR:['Exactly one input must be 1.','A ⊕ B'],
    NAND:['Compute AND, then invert its answer.','(A · B)′'], NOR:['Compute OR, then invert its answer.','(A + B)′'], XNOR:['The output is 1 when the two inputs match.','(A ⊕ B)′'], NOT:['Invert the one input: 0 becomes 1; 1 becomes 0.','A′']
  };
  register({
    id:'gate-signal',title:'Follow a signal through a gate',lead:'Choose a gate and flip the inputs. Watch the signal travel from the switches to the output lamp.',
    inputs:[{key:'gate',label:'Gate',type:'select',value:'AND',options:Object.keys(gateDescriptions).map(function(k){return {value:k,label:k};})},binary('a','Input A',1),binary('b','Input B (unused for NOT)',0)],
    presets:[{label:'AND: both on',values:{gate:'AND',a:'1',b:'1'}},{label:'XOR: same inputs',values:{gate:'XOR',a:'1',b:'1'}},{label:'NAND: invert AND',values:{gate:'NAND',a:'1',b:'1'}}],
    build:function(v){
      if(!Object.prototype.hasOwnProperty.call(gateDescriptions,v.gate)) throw new Error('Choose a supported gate.');
      var a=bit(v,'a'), b=bit(v,'b'), type=v.gate, not=type==='NOT', out=E.gate(type,a,b), description=gateDescriptions[type];
      function diagram(step){
        var d=wire(not?'M 100 118 H 265':'M 100 80 H 205 V 100 H 265',a,step===1);
        if(!not)d+=wire('M 100 180 H 205 V 140 H 265',b,step===1);
        var end=type==='NOT'?385:['NAND','NOR','XNOR'].indexOf(type)>=0?397:385;
        d+=wire('M '+end+' 120 H 550',step>=3?out:null,step===3);
        d+=gate(type,265,not?82:80,120,not?76:80,step===2);
        d+=terminal(76,not?118:80,'A',a,step===0);
        if(!not)d+=terminal(76,180,'B',b,step===0);
        d+=terminal(574,120,'OUTPUT',step>=3?out:null,step===3);
        return svg(type+' gate, '+(not?'A '+a:'A '+a+', B '+b)+'. '+(step>=3?'Output '+out+'.':'Output is revealed at the final step.'),d,660,250)+legend();
      }
      var substitution=not?String(a)+'′':type==='AND'?a+' · '+b:type==='OR'?a+' + '+b:type==='XOR'?a+' ⊕ '+b:type==='NAND'?'('+a+' · '+b+')′':type==='NOR'?'('+a+' + '+b+')′':'('+a+' ⊕ '+b+')′';
      return {frames:[
        frame('1 · Set the switches',not?'Only A connects to NOT. B is ignored for this gate.':'The input switches send a definite 0 or 1 into each wire.',diagram(0)+note('A = <strong>'+a+'</strong>'+(not?'':' &nbsp; B = <strong>'+b+'</strong>'))),
        frame('2 · Follow the input wires','A solid blue wire carries 1; a dashed gray wire carries 0. Neither wire has reached the output yet.',diagram(1)),
        frame('3 · Apply the gate rule',description[0],diagram(2)+equation(description[1]+' → '+substitution+' = <strong>'+out+'</strong>')),
        frame('4 · Read the output',out===1?'The output is HIGH: the lamp is on.':'The output is LOW: the lamp is off.',diagram(3)+equation('F = <strong>'+out+'</strong>'))
      ],takeaway:type+' takes '+(not?'A = '+a:'A = '+a+' and B = '+b)+' and produces '+out+'. '+description[0]};
    }
  });

  function traceDiagram(a,b,c,step){
    var nb=1-b, either=a|nb, out=either&c;
    var d=wire('M 80 55 H 285 V 110 H 340',a,step===2)+wire('M 80 155 H 145',b,step===1)+gate('NOT',145,127,88,56,step===1);
    d+=wire('M 233 155 H 340',step>=1?nb:null,step===1)+gate('OR',340,80,105,100,step===2);
    d+=wire('M 445 130 H 500 V 140 H 530',step>=2?either:null,step===2)+wire('M 80 260 H 485 V 180 H 530',c,step===3)+gate('AND',530,110,105,100,step===3);
    d+=wire('M 635 160 H 695',step>=3?out:null,step===3)+terminal(57,55,'A',a,step===0)+terminal(57,155,'B',b,step===0)+terminal(57,260,'C',c,step===0)+terminal(719,160,'F',step>=3?out:null,step===3);
    d+=text(280,179,'B′ = '+(step>=1?nb:'?'),'vl-small')+text(480,106,'A + B′ = '+(step>=2?either:'?'),'vl-small');
    return svg('Circuit F equals (A OR NOT B) AND C. A '+a+', B '+b+', C '+c+'. '+(step>=3?'F '+out+'.':'Follow the highlighted operation.'),d,780,315)+legend();
  }
  register({
    id:'circuit-trace',title:'Trace a circuit one gate at a time',lead:'Break F = (A + B′)C into three visible decisions: invert, OR, then AND.',
    inputs:[binary('a','A',0),binary('b','B',0),binary('c','C',1)],
    presets:[{label:'B′ opens the path',values:{a:'0',b:'0',c:'1'}},{label:'C blocks the output',values:{a:'1',b:'0',c:'0'}},{label:'Both OR inputs off',values:{a:'0',b:'1',c:'1'}}],
    build:function(v){var a=bit(v,'a'),b=bit(v,'b'),c=bit(v,'c'),nb=1-b,or=E.gate('OR',a,nb),out=E.gate('AND',or,c);
      return {frames:[
        frame('1 · Start at the inputs','Do not evaluate the whole expression at once. The wires tell you which gate can be evaluated first.',traceDiagram(a,b,c,0)+equation('F = (A + B′)C')),
        frame('2 · Invert B','The small bubble means inversion. Resolve B′ before the OR gate.',traceDiagram(a,b,c,1)+equation('B′ = '+b+'′ = <strong>'+nb+'</strong>')),
        frame('3 · Resolve the OR gate','The OR gate combines A with the inverted value of B.',traceDiagram(a,b,c,2)+equation('A + B′ = '+a+' + '+nb+' = <strong>'+or+'</strong>')),
        frame('4 · Let C decide the final output',c===0?'An AND gate with a 0 input must output 0. C blocks the signal here.':'C is 1, so the final AND gate passes the OR gate’s result.',traceDiagram(a,b,c,3)+equation('F = '+or+' · '+c+' = <strong>'+out+'</strong>'))
      ],takeaway:'Evaluate from inputs toward the output: B′ = '+nb+', A + B′ = '+or+', then F = '+out+'.'};
    }
  });

  function adderDiagram(a,b,step){
    var sum=a^b,carry=a&b;
    var d=wire('M 100 60 H 190 V 100 H 330',a,step===0)+wire('M 190 100 V 230 H 330',a,step===0)+wire('M 100 175 H 255 V 140 H 330',b,step===0)+wire('M 255 175 V 270 H 330',b,step===0);
    d+='<circle cx="190" cy="100" r="5" class="vl-junction"/><circle cx="255" cy="175" r="5" class="vl-junction"/>';
    d+=gate('XOR',330,80,115,80,step===1)+gate('AND',330,210,115,80,step===2);
    d+=wire('M 445 120 H 560',step>=1?sum:null,step===1)+wire('M 445 250 H 560',step>=2?carry:null,step===2);
    d+=terminal(77,60,'A',a,step===0)+terminal(77,175,'B',b,step===0)+terminal(584,120,'SUM S',step>=1?sum:null,step===1)+terminal(584,250,'CARRY C',step>=2?carry:null,step===2);
    return svg('Half adder: A '+a+' and B '+b+' feed XOR for sum '+(step>=1?sum:'unknown')+' and AND for carry '+(step>=2?carry:'unknown')+'.',d,670,340)+legend();
  }
  register({
    id:'half-adder',title:'See a half adder make a carry',lead:'Two input bits can produce a two-bit answer. XOR supplies the sum bit; AND supplies the carry bit.',
    inputs:[binary('a','Input A',1),binary('b','Input B',1)],
    presets:[{label:'1 + 1 → 10',values:{a:'1',b:'1'}},{label:'1 + 0 → 01',values:{a:'1',b:'0'}},{label:'0 + 0 → 00',values:{a:'0',b:'0'}}],
    build:function(v){var a=bit(v,'a'),b=bit(v,'b'),s=E.gate('XOR',a,b),c=E.gate('AND',a,b);
      return {frames:[
        frame('1 · Split each input into two paths','Each input feeds both gates. The dots mark real wire connections.',adderDiagram(a,b,0)),
        frame('2 · XOR makes the sum bit','The sum bit is 1 only when exactly one of the two input bits is 1.',adderDiagram(a,b,1)+equation('S = A ⊕ B = '+a+' ⊕ '+b+' = <strong>'+s+'</strong>')),
        frame('3 · AND makes the carry bit',c?'Both inputs are 1, so their total overflows the ones column.':'The inputs do not contain two ones, so there is no carry.',adderDiagram(a,b,2)+equation('C = A · B = '+a+' · '+b+' = <strong>'+c+'</strong>')),
        frame('4 · Read carry before sum','The carry has weight 2. The sum has weight 1. Read the result as CS.',
          '<div class="vl-place-pair"><div><small>Carry · weight 2</small><strong>'+c+'</strong></div><div><small>Sum · weight 1</small><strong>'+s+'</strong></div></div>'+equation(a+' + '+b+' = <strong>'+c+s+'</strong>₂ = '+(2*c+s)+'₁₀')+note('This is a <strong>half adder</strong>: it adds two bits and has no carry-in input.'))
      ],takeaway:'The two outputs belong together: CS = '+c+s+'₂. Check the place values: 2 × '+c+' + '+s+' = '+(a+b)+'.'};
    }
  });

  function absorptionDiagram(a,b,step){
    var ab=a&b,out=a|ab;
    var d=wire('M 92 55 H 215 V 145 H 475',a,step===2)+wire('M 215 55 V 230 H 285',a,step===1)+wire('M 92 285 H 215 V 270 H 285',b,step===1);
    d+='<circle cx="215" cy="55" r="5" class="vl-junction"/>';
    d+=gate('AND',285,210,110,80,step===1)+wire('M 395 250 H 440 V 185 H 475',step>=1?ab:null,step===1)+gate('OR',475,125,110,80,step===2);
    d+=wire('M 585 165 H 644',step>=2?out:null,step===2)+terminal(68,55,'A',a,step===0)+terminal(68,285,'B',b,step===0)+terminal(668,165,'A + AB',step>=2?out:null,step===2);
    return svg('Original circuit: A '+a+', B '+b+', AND branch AB '+ab+', final A OR AB '+out+'.',d,740,335)+legend();
  }
  register({
    id:'boolean-absorption',title:'Watch a redundant branch disappear',lead:'The absorption law A + AB = A becomes easier to see when you follow both paths.',
    inputs:[binary('a','A',1),binary('b','B',0)],presets:[{label:'A on, B off',values:{a:'1',b:'0'}},{label:'Both on',values:{a:'1',b:'1'}},{label:'A off, B on',values:{a:'0',b:'1'}}],
    build:function(v){var a=bit(v,'a'),b=bit(v,'b'),ab=E.gate('AND',a,b),out=E.gate('OR',a,ab);
      var cases='<div class="vl-case-grid"><div><b>If A = 0</b><div class="vl-case-bits"><span>AB = 0</span><span>0 + 0 = 0</span></div><p>B cannot make the AND branch turn on.</p></div><div><b>If A = 1</b><div class="vl-case-bits"><span>AB = B</span><span>1 + B = 1</span></div><p>The direct A path already makes OR turn on.</p></div></div>';
      return {frames:[
        frame('1 · One input takes two paths','A goes directly to OR and also joins B at AND. Compare what the longer branch can add.',absorptionDiagram(a,b,0)),
        frame('2 · Evaluate the longer branch','The AND branch can only be 1 when A is already 1.',absorptionDiagram(a,b,1)+equation('AB = '+a+' · '+b+' = <strong>'+ab+'</strong>')),
        frame('3 · Compare the two paths','OR receives A directly. The AB branch cannot create any extra 1s.',absorptionDiagram(a,b,2)+equation('A + AB = '+a+' + '+ab+' = <strong>'+out+'</strong>')),
        frame('4 · Cover every possible input','These two cases cover both values of A, regardless of B. That makes this a proof for all four input pairs.',cases),
        frame('5 · Keep only the useful path','The smaller circuit produces the same output for every input pair.',svg('Simplified circuit: input A '+a+' goes directly to output F '+a+'.',wire('M 120 100 H 500',a,true)+terminal(96,100,'A',a,true)+terminal(524,100,'F = A',a,true),640,190)+equation('A + AB = <strong>A</strong>')+note('For your inputs, the original output is <strong>'+out+'</strong> and the simplified output is <strong>'+a+'</strong>.'))
      ],takeaway:'AB never adds a case that A does not already cover. Therefore A + AB = A for all values of A and B.'};
    }
  });

  function deMorganDiagram(a,b,step){
    var or=a|b,left=1-or,na=1-a,nb=1-b,right=na&nb;
    var d=text(190,27,'Invert an OR result','vl-heading')+wire('M 80 90 H 180 V 110 H 215',a,step===0)+wire('M 80 190 H 180 V 150 H 215',b,step===0)+gate('OR',215,90,100,80,step===1);
    d+=wire('M 315 130 H 365',step>=1?or:null,step===1)+gate('NOT',365,101,75,58,step===2)+wire('M 440 130 H 500',step>=2?left:null,step===2);
    d+=terminal(56,90,'A',a,step===0)+terminal(56,190,'B',b,step===0)+terminal(524,130,'LEFT',step>=2?left:null,step===2);
    d+=text(190,280,'Invert inputs, then AND','vl-heading')+wire('M 80 345 H 150',a,step===0)+wire('M 80 445 H 150',b,step===0)+gate('NOT',150,318,75,54,step===3)+gate('NOT',150,418,75,54,step===3);
    d+=wire('M 225 345 H 305 V 375 H 350',step>=3?na:null,step===3)+wire('M 225 445 H 305 V 415 H 350',step>=3?nb:null,step===3)+gate('AND',350,355,100,80,step===4)+wire('M 450 395 H 500',step>=4?right:null,step===4);
    d+=terminal(56,345,'A',a,step===0)+terminal(56,445,'B',b,step===0)+terminal(524,395,'RIGHT',step>=4?right:null,step===4);
    if(step>=3)d+=text(262,330,'A′ = '+na,'vl-small')+text(262,466,'B′ = '+nb,'vl-small');
    return svg('De Morgan comparison: NOT of A OR B equals NOT A AND NOT B. A '+a+', B '+b+'. '+(step>=4?'Both circuits output '+left+'.':''),d,600,500)+legend();
  }
  register({
    id:'demorgan',title:'See De Morgan’s law in two circuits',lead:'Moving an inversion across a gate changes OR to AND and inverts each input.',
    inputs:[binary('a','A',0),binary('b','B',0)],presets:[{label:'Neither input on',values:{a:'0',b:'0'}},{label:'Only A on',values:{a:'1',b:'0'}},{label:'Both inputs on',values:{a:'1',b:'1'}}],
    build:function(v){var a=bit(v,'a'),b=bit(v,'b'),or=E.gate('OR',a,b),left=E.gate('NOT',or),na=E.gate('NOT',a),nb=E.gate('NOT',b),right=E.gate('AND',na,nb);
      return {frames:[
        frame('1 · Give both circuits the same inputs','The top circuit inverts the final OR result. The bottom circuit inverts each input before AND.',deMorganDiagram(a,b,0)),
        frame('2 · Evaluate the top OR','First combine the original inputs.',deMorganDiagram(a,b,1)+equation('A + B = '+a+' + '+b+' = <strong>'+or+'</strong>')),
        frame('3 · Invert the top result','The output bubble reverses the OR answer.',deMorganDiagram(a,b,2)+equation('(A + B)′ = '+or+'′ = <strong>'+left+'</strong>')),
        frame('4 · Invert each bottom input','Now evaluate the alternative circuit, using the very same A and B.',deMorganDiagram(a,b,3)+equation('A′ = <strong>'+na+'</strong> &nbsp; B′ = <strong>'+nb+'</strong>')),
        frame('5 · Compare the final outputs','The bottom AND output matches the top result. Try the other input presets to test all cases.',deMorganDiagram(a,b,4)+equation('(A + B)′ = '+left+' &nbsp; = &nbsp; '+right+' = A′B′')+note('<strong>Remember both changes:</strong> OR becomes AND, and each input gains an inversion.'))
      ],takeaway:'For A = '+a+' and B = '+b+', both circuits output '+left+'. De Morgan’s identity is (A + B)′ = A′B′.'};
    }
  });

  function kmap(step){
    var columns=['00','01','11','10'],indices=[[0,1,3,2],[4,5,7,6]],ones=[0,2,5,7],d=text(370,31,'Columns use Gray order: only one bit changes','vl-heading');
    d+=text(74,105,'A \\ BC','vl-small');
    columns.forEach(function(c,i){d+=text(193+120*i,105,c,'vl-label');});
    [0,1].forEach(function(a){d+=text(84,178+104*a,String(a),'vl-label');indices[a].forEach(function(m,i){var on=ones.indexOf(m)>=0,x=135+i*120,y=125+a*104,chosen=step>=1&&a===0&&(i===0||i===3)||step>=2&&a===1&&(i===1||i===2);d+='<rect x="'+x+'" y="'+y+'" width="112" height="96" rx="10" class="vl-kcell'+(on?' vl-kone':'')+(chosen?' vl-kselected':'')+'"/>'+text(x+56,y+58,on?'1':'0','vl-kdigit')+text(x+95,y+21,'m'+m,'vl-minterm');});});
    if(step>=1){d+='<path d="M 139 140 H 218 Q 232 140 232 154 V 193 Q 232 207 218 207 H 139 M 599 140 H 520 Q 506 140 506 154 V 193 Q 506 207 520 207 H 599" class="vl-group vl-group-blue"/>';d+=text(368,172,'← edges touch →','vl-wrap-label');}
    if(step>=2)d+='<rect x="267" y="244" width="204" height="67" rx="18" class="vl-group vl-group-gold"/>';
    if(step>=1)d+=text(368,365,'Top pair: A = 0, C = 0, B changes','vl-small');
    if(step>=2)d+=text(368,397,'Bottom pair: A = 1, C = 1, B changes','vl-small');
    return svg('Three-variable Karnaugh map. Rows A zero and one. Columns BC 00, 01, 11, 10. Ones at minterms 0, 2, 5, 7. '+(step>=1?'Top edge pair groups 0 and 2. ':'')+(step>=2?'Bottom middle pair groups 5 and 7.':''),d,735,step>=2?430:step>=1?395:350);
  }
  function mintermBits(values){return '<div class="vl-literal-row">'+values.map(function(v){return '<span>'+v[0]+'</span><span class="vl-changing"><s>'+v[1]+'</s></span><span>'+v[2]+'</span>';}).join('<b class="vl-pair-divider">↔</b>')+'</div>';}
  register({
    id:'kmap-group',title:'Find the groups in a Karnaugh map',lead:'Turn four minterms into two product terms. The edge cells are neighbors because the map wraps around.',inputs:[],
    build:function(){return {frames:[
      frame('1 · Put each 1 in its correct cell','F = Σm(0, 2, 5, 7). Gray order 00, 01, 11, 10 keeps neighboring columns one bit apart.',kmap(0)+equation('F = A′B′C′ + A′BC′ + AB′C + ABC')),
      frame('2 · Join the top edge cells','The far-left and far-right columns touch across the edge. Minterms 0 (000) and 2 (010) differ only in B.',kmap(1)+mintermBits([['A′','B′','C′'],['A′','B','C′']])+equation('A′B′C′ + A′BC′ = A′C′(B′ + B) = <strong>A′C′</strong>')),
      frame('3 · Join the two middle bottom cells','Minterms 5 (101) and 7 (111) also differ only in B. Keep A and C; remove B.',kmap(2)+mintermBits([['A','B′','C'],['A','B','C']])+equation('AB′C + ABC = AC(B′ + B) = <strong>AC</strong>')),
      frame('4 · OR the two group terms','Every 1 is covered. Each pair removes the one variable that changes inside that pair.',kmap(3)+equation('F = <strong>A′C′ + AC</strong>')+note('This also equals <strong>A XNOR C</strong>: output 1 when A and C match. B does not affect the result.'))
    ],takeaway:'Groups must contain 1, 2, 4, … adjacent cells. Here, two pairs yield F = A′C′ + AC; the changing variable B disappears.'};}
  });
})();
