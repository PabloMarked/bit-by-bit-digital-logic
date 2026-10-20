/* Original, independently authored visual teaching examples. No slide-audit claims. */
(function () {
  'use strict';
  const V = window.VisualWalkthroughs;
  const C = { ink: '#142743', muted: '#64748b', blue: '#164ad1', blueLight: '#e7efff', green: '#126143', mint: '#d9f4e7', gold: '#ffdc80', orange: '#925500', pale: '#f5f8fd', line: '#d8e1ef', white: '#ffffff', violet: '#6d39bb' };
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const digit = n => '0123456789ABCDEF'[n];
  const nfmt = n => Number.isInteger(n) ? String(n) : String(Number(n.toFixed(10)));
  const weightLabel = p => p >= 0 ? String(2 ** p) : '1/' + (2 ** -p);
  const text = (x, y, value, size = 16, fill = C.ink, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;
  const rect = (x,y,w,h,fill=C.white,stroke=C.line,r=10,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
  const line = (x1,y1,x2,y2,color=C.line,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${extra}/>`;
  const svg = (label, h, inside) => `<svg class="vw-frac-svg" viewBox="0 0 700 ${h}" width="700" height="${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;font-family:Segoe UI,Arial,sans-serif"><title>${esc(label)}</title>${inside}</svg>`;
  const banner = (left, right) => `<div class="vw-frac-equation"><span>${esc(left)}</span><strong>${esc(right)}</strong></div>`;
  const binary = (value, maxWhole = 4, maxFraction = 6) => {
    const source = String(value).trim();
    if (!/^(?:[01]+)?\.[01]+$/.test(source)) throw Error('Enter a binary fraction such as 101.101 or 0.011. Use only 0, 1 and one point.');
    const [rawWhole, fraction] = source.split('.');
    const whole = rawWhole || '0';
    if (whole.length > maxWhole || fraction.length > maxFraction) throw Error(`Use at most ${maxWhole} whole-number bits and ${maxFraction} fractional bits so every place stays visible.`);
    return {whole, fraction, source: whole+'.'+fraction, value: parseInt(whole,2)+parseInt(fraction,2)/(2**fraction.length)};
  };
  const binaryResult = (bits, f) => {
    const whole = bits.slice(0,bits.length-f).replace(/^0+(?=.)/,'');
    return whole+(f ? '.'+bits.slice(-f) : '');
  };
  function placeDiagram(data, index, signed = false, fractionBits) {
    const bits = signed ? data.bits : data.whole+data.fraction;
    const f = signed ? fractionBits : data.fraction.length;
    const point = bits.length-f;
    const count = bits.length;
    const cell = Math.min(61, 610/count), left = (700-(count*cell+18))/2;
    let s = text(38,25,signed ? `8-bit signed value · ${f} fractional places` : 'Each bit opens or closes one place-value tile',15,C.muted);
    let sum = 0;
    for (let i=0;i<count;i++) {
      const power = point-1-i;
      const weight = signed && i===0 ? -(2**power) : 2**power;
      if (i<=index) sum += Number(bits[i])*weight;
      const x=left+i*cell+(i>=point?18:0), active=i===index, read=i<=index;
      s += rect(x,51,cell-5,67,active?C.gold:read&&bits[i]==='1'?C.blue:C.white,active?C.orange:C.line,10,active?'stroke-width="3"':'');
      s += text(x+(cell-5)/2,94,bits[i],31,read&&bits[i]==='1'&&!active?C.white:C.ink,'text-anchor="middle" font-weight="700"');
      s += text(x+(cell-5)/2,143,signed&&i===0?'−'+weightLabel(power):weightLabel(power),14,active?C.orange:C.muted,'text-anchor="middle"');
      if (i===point) s += text(x-12,94,'·',31,C.blue,'text-anchor="middle" font-weight="700"');
    }
    s += text(38,184,'RUNNING TOTAL',11,C.muted,'font-weight="700" letter-spacing="1.4"');
    s += text(662,188,nfmt(sum),30,C.blue,'text-anchor="end" font-weight="700"');
    if (!signed) {
      s += text(38,225,'A proportional picture of the fractional part',14,C.muted);
      const stripX=38,stripY=244,stripW=624,stripH=33;
      let cursor=stripX;
      for (let j=0;j<f;j++) {
        const width=stripW/(2**(j+1)), read=point+j<=index, on=data.fraction[j]==='1';
        s += rect(cursor,stripY,width,stripH,read&&on?C.blue:C.white,C.line,0);
        if (width>=60) s += text(cursor+width/2,stripY+22,on&&read?'filled':'empty',11,on&&read?C.white:C.muted,'text-anchor="middle"');
        cursor+=width;
      }
      s+=rect(cursor,stripY,stripX+stripW-cursor,stripH,C.pale,C.line,0);
      s+=text(38,301,'0',13,C.muted)+text(662,301,'1 whole unit',13,C.muted,'text-anchor="end"');
      const fracSum = data.fraction.split('').reduce((acc,b,j)=>acc+(point+j<=index?Number(b)/(2**(j+1)):0),0);
      s+=text(350,327,`${nfmt(fracSum)} of one unit is shaded`,15,C.blue,'text-anchor="middle" font-weight="700"');
      return {html:svg(`Binary ${data.source}. Current place ${index+1}; running decimal total ${nfmt(sum)}. Fraction strip is proportional to place weights.`,345,s),sum};
    }
    const min=-(2**(7-f)),max=(2**(7-f))-2**(-f), x=n=>38+(n-min)/(max-min)*624;
    s+=text(38,228,'Watch the signed total move along the number line',14,C.muted);
    s+=line(38,260,662,260,C.muted)+line(x(0),250,x(0),270,C.muted);
    s+=text(38,289,nfmt(min),13,C.muted)+text(x(0),289,'0',13,C.muted,'text-anchor="middle"')+text(662,289,nfmt(max),13,C.muted,'text-anchor="end"');
    s+=`<circle cx="${x(sum)}" cy="260" r="9" fill="${C.blue}" stroke="white" stroke-width="3"/>`;
    return {html:svg(`Signed binary running total ${nfmt(sum)} on a number line from ${min} to ${max}.`,310,s),sum};
  }

  V.register({
    id:'place-value', title:'Watch binary places become a number',
    lead:'Follow the highlighted bit. The shaded strip makes halves, quarters and eighths visible.',
    inputs:[{key:'bits',label:'Binary fraction',type:'text',value:'101.101',maxLength:11,hint:'Up to 4 whole bits and 6 fraction bits.'}],
    presets:[{label:'Halves and eighths',values:{bits:'0.101'}},{label:'Whole + fraction',values:{bits:'101.101'}},{label:'Tiny places',values:{bits:'0.001011'}}],
    build(values) {
      const data=binary(values.bits),bits=data.whole+data.fraction, point=data.whole.length;
      const frames=[{title:'The point is the anchor',explain:'Moving right divides the place weight by 2. A 1 includes its weight; a 0 leaves that piece empty.',html:placeDiagram(data,-1).html}];
      let before=0;
      bits.split('').forEach((b,i)=>{
        const p=point-1-i,w=2**p,result=placeDiagram(data,i);
        frames.push({title:`Bit ${i+1}: ${b} × ${weightLabel(p)}`,explain:`${b==='1'?'Include':'Skip'} this ${p<0?'fractional':'whole-number'} place: ${nfmt(before)} + ${nfmt(Number(b)*w)} = ${nfmt(result.sum)}.`,html:result.html});
        before=result.sum;
      });
      frames.push({title:'Put the pieces together',explain:'The whole-number places and shaded fractional pieces add to the same decimal value.',html:placeDiagram(data,bits.length).html+banner(data.source+'₂', '= '+nfmt(data.value)+'₁₀')});
      return {frames,takeaway:`${data.source}₂ = ${nfmt(data.value)}₁₀. The first place after the point is 1/2, never 1.`};
    }
  });

  function decimalRatio(value) {
    const s=String(value).trim();
    if (!/^(?:0?(?:\.\d{1,6})|0|1(?:\.0{1,6})?)$/.test(s)) throw Error('Enter a decimal from 0 to 1, with at most 6 digits after the point, such as 0.625.');
    const parts=s.split('.'), fraction=parts[1]||'';
    const d=10n**BigInt(fraction.length),n=BigInt(parts[0]||'0')*d+BigInt(fraction||'0');
    return {n,d};
  }
  function exact(n,d) {
    const whole=n/d; let remainder=n%d;
    if (!remainder) return String(whole);
    let fraction='';
    while(remainder && fraction.length<12) {remainder*=10n;fraction+=String(remainder/d);remainder%=d;}
    return whole+'.'+fraction+(remainder?'…':'');
  }
  function multiplicationDiagram(before, after, d, base, extracted, result, completed, setup) {
    let s=text(38,27,setup?'A fraction is an amount smaller than one whole':'Multiply the amount; keep its whole part as the next digit',15,C.muted);
    s+=text(38,66,'CURRENT FRACTION',11,C.muted,'font-weight="700" letter-spacing="1"')+text(38,104,exact(before,d),31,C.blue,'font-weight="700"');
    s+=text(245,99,'× '+base+' →',29,C.muted)+text(409,66,'NEXT DIGIT',11,C.muted,'font-weight="700" letter-spacing="1"');
    s+=rect(409,77,67,58,setup?C.pale:C.gold,setup?C.line:C.orange,10)+text(442,117,setup?'?':digit(extracted),32,C.ink,'text-anchor="middle" font-weight="700"');
    s+=text(508,66,'KEEP REMAINDER',11,C.muted,'font-weight="700" letter-spacing="1"')+text(508,106,setup?exact(before,d):exact(after,d),27,C.green,'font-weight="700"');
    s+=text(38,163,setup?'Starting amount in one unit':`${exact(before,d)} × ${base} = ${exact(before*BigInt(base),d)}`,15,C.ink,'font-weight="600"');
    const count=setup?1:base,w=624/count;
    for(let i=0;i<count;i++) {
      const amount=setup?Number(before)/Number(d):Math.max(0,Math.min(1,Number(before*BigInt(base))/Number(d)-i));
      s+=rect(38+i*w,181,w-3,42,C.pale,C.line,3);
      if(amount>0)s+=rect(38+i*w,181,(w-3)*amount,42,!setup&&i<extracted?C.blue:C.green,'none',3);
      if(w>60)s+=text(38+i*w+(w-3)/2,247,setup?'1 unit':'unit '+(i+1),12,C.muted,'text-anchor="middle"');
    }
    s+=text(38,285,setup?'The whole part starts at 0.':`${extracted} whole ${extracted===1?'unit':'units'} → digit ${digit(extracted)} · the green piece is reused`,14,C.muted);
    s+=rect(38,305,624,64,C.blueLight,'none',12)+text(57,330,'DIGITS PRODUCED IN ORDER',10,C.muted,'font-weight="700" letter-spacing="1"')+text(57,357,result||'0.',26,C.blue,'font-weight="700"');
    s+=text(641,350,completed?'Exact: remainder 0':'Continue with the remainder',12,completed?C.green:C.muted,'text-anchor="end"');
    return svg(`Repeated multiplication in base ${base}. Current fraction ${exact(before,d)}, next digit ${setup?'not extracted':digit(extracted)}, remainder ${exact(after,d)}.`,387,s);
  }
  V.register({
    id:'multiply-fraction', title:'See the fraction-to-binary machine',
    lead:'Each multiplication separates a whole digit from a fractional remainder. Read the digits in the order they appear.',
    inputs:[{key:'decimal',label:'Decimal fraction',type:'text',value:'0.625',maxLength:8,hint:'0 to 1, up to 6 decimal places.'},{key:'base',label:'Target base',type:'select',value:'2',options:[{value:'2',label:'Binary (2)'},{value:'8',label:'Octal (8)'},{value:'16',label:'Hexadecimal (16)'}]}],
    presets:[{label:'Terminates: 0.625',values:{decimal:'0.625',base:'2'}},{label:'Repeats: 0.1',values:{decimal:'0.1',base:'2'}},{label:'One hex digit',values:{decimal:'0.6875',base:'16'}}],
    build(values) {
      const {n,d}=decimalRatio(values.decimal),base=Number(values.base);
      if(![2,8,16].includes(base))throw Error('Choose binary, octal or hexadecimal.');
      if(n===d) return {frames:[{title:'One is already a whole number',explain:'The fraction algorithm is for amounts below 1. This value has whole part 1 and fractional part 0.',html:multiplicationDiagram(0n,0n,d,base,0,'1.0',true,true)+banner('1₁₀',`= 1.0 (base ${base})`)}],takeaway:`1₁₀ = 1.0 in base ${base}. No fractional multiplication is needed.`};
      let rem=n,result=n===0n?'0.0':'0.', repeat=null;
      const seen=new Map(),frames=[{title:'Load the fraction',explain:'The colored amount is the starting fraction. Each step multiplies only the current remainder.',html:multiplicationDiagram(n,n,d,base,0,result,n===0n,true)}];
      for(let i=0;i<8&&rem!==0n;i++) {
        if(seen.has(String(rem))&&repeat===null) repeat={start:seen.get(String(rem)),at:i};
        if(!seen.has(String(rem)))seen.set(String(rem),i);
        const before=rem,product=rem*BigInt(base),next=Number(product/d);rem=product%d;result+=digit(next);
        frames.push({title:`Step ${i+1}: extract ${digit(next)}`,explain:`${exact(before,d)} × ${base} = ${exact(product,d)}. Write ${digit(next)}; keep only ${exact(rem,d)} for the next step.`,html:multiplicationDiagram(before,rem,d,base,next,result,rem===0n,false)});
      }
      if(result==='0.')result='0.0';
      const symbol=rem===0n?'=':'≈';
      const tail=rem===0n?'The remainder is zero, so the expansion is exact.':repeat?'A remainder has repeated, so the same cycle of digits continues. Eight displayed digits are a truncation.':'A nonzero remainder remains. Eight displayed digits are a truncation; more digits would follow.';
      const last=frames[frames.length-1].html;
      frames.push({title:rem===0n?'Stop: nothing remains':'The remainder explains the dots',explain:tail,html:last+banner(exact(n,d)+'₁₀',`${symbol} ${result} (base ${base})`)});
      return {frames,takeaway:`${exact(n,d)}₁₀ ${symbol} ${result} (base ${base}). ${rem===0n?'Read fractional digits from top to bottom.':'The finite digit string is approximate because the remainder is not zero.'}`};
    }
  });

  function groupingDiagram(data,size,leftPadded,rightPadded,groupIndex,showPadding) {
    const whole=showPadding?leftPadded:data.whole,fraction=showPadding?rightPadded:data.fraction;
    const bits=whole+fraction,point=whole.length,cell=Math.min(32,610/bits.length),left=(700-(bits.length*cell+18))/2;
    let s=text(38,28,showPadding?`Groups contain ${size} bits; the point stays fixed`:'Build groups outward from the point',15,C.muted);
    const totalGroups=showPadding?bits.length/size:0;
    for(let i=0;i<bits.length;i++) {
      const x=left+i*cell+(i>=point?18:0),pad=showPadding&&(i<leftPadded.length-data.whole.length||i>=point+data.fraction.length);
      const group=Math.floor(i/size),active=showPadding&&group===groupIndex;
      s+=rect(x,70,cell-3,51,pad?C.pale:active?C.gold:C.white,pad?C.muted:active?C.orange:C.line,5,pad?'stroke-dasharray="3 3"':'');
      s+=text(x+(cell-3)/2,105,bits[i],25,pad?C.muted:C.ink,'text-anchor="middle" font-weight="700"');
      if(i===point)s+=text(x-11,105,'·',27,C.blue,'text-anchor="middle"');
    }
    if(showPadding) {
      for(let g=0;g<totalGroups;g++) {
        const start=g*size,x=left+start*cell+(start>=point?18:0),cx=x+(size*cell-3)/2;
        const on=g<=groupIndex,active=g===groupIndex,value=parseInt(bits.slice(start,start+size),2),fill=active?C.orange:C.blue;
        s+=line(x,138,x+size*cell-3,138,active?C.orange:C.blue);
        s+=line(cx,138,cx,171,fill)+text(cx,207,on?digit(value):'?',29,on?fill:C.muted,'text-anchor="middle" font-weight="700"');
        if(active) {
          const expr=bits.slice(start,start+size).split('').map((b,i)=>b==='1'?2**(size-1-i):null).filter(n=>n!==null);
          s+=text(350,259,`${bits.slice(start,start+size)}₂ → ${expr.length?expr.join(' + '):'0'} = ${value}${value>9?' → '+digit(value):''}`,17,C.orange,'text-anchor="middle" font-weight="600"');
        }
      }
      s+=text(350,301,'Dashed gray 0 = padding added at an outer edge',13,C.muted,'text-anchor="middle"');
    } else {
      const pointX=left+point*cell+7;
      s+=line(pointX-16,159,left,159,C.blue,'stroke-dasharray="5 3"')+text((pointX+left)/2,189,'whole groups ←',14,C.blue,'text-anchor="middle"');
      s+=line(pointX+14,159,700-left,159,C.green,'stroke-dasharray="5 3"')+text((pointX+700-left)/2,219,'→ fraction groups',14,C.green,'text-anchor="middle"');
      s+=text(350,278,'Do not move a bit across the point.',16,C.ink,'text-anchor="middle" font-weight="600"');
    }
    return svg(`${data.source} grouped in ${size} bits. ${showPadding?'Padding is dashed; current group '+(groupIndex+1)+'.':'Whole groups go left, fractional groups go right.'}`,322,s);
  }
  V.register({
    id:'grouping',title:'Group bits outward from the point',
    lead:'Watch three bits become one octal digit, or four bits become one hexadecimal digit. Dashed zeros show safe padding.',
    inputs:[{key:'bits',label:'Binary fraction',type:'text',value:'101101.01101',maxLength:17,hint:'Up to 8 bits on each side of the point.'},{key:'base',label:'Group into',type:'select',value:'16',options:[{value:'16',label:'Hexadecimal: groups of 4'},{value:'8',label:'Octal: groups of 3'}]}],
    presets:[{label:'Hex with padding',values:{bits:'101101.01101',base:'16'}},{label:'Octal with padding',values:{bits:'101101.01101',base:'8'}},{label:'The same half',values:{bits:'111.100',base:'16'}}],
    build(values) {
      const data=binary(values.bits,8,8),base=Number(values.base);
      if(![8,16].includes(base))throw Error('Choose octal or hexadecimal.');
      const size=base===8?3:4,left=data.whole.padStart(Math.ceil(data.whole.length/size)*size,'0'),right=data.fraction.padEnd(Math.ceil(data.fraction.length/size)*size,'0');
      const all=left+right,groups=all.match(new RegExp('.{'+size+'}','g')),wholeGroups=left.length/size;
      const result=groups.slice(0,wholeGroups).map(g=>digit(parseInt(g,2))).join('').replace(/^0+(?=.)/,'')+'.'+groups.slice(wholeGroups).map(g=>digit(parseInt(g,2))).join('');
      const frames=[{title:'Anchor at the radix point',explain:'Group the whole part to the left and the fraction to the right. A group never crosses the point.',html:groupingDiagram(data,size,left,right,-1,false)}, {title:'Complete only the outer edges',explain:`Add ${left.length-data.whole.length} leading whole-number zero(s) and ${right.length-data.fraction.length} trailing fraction zero(s). These zeros preserve the value.`,html:groupingDiagram(data,size,left,right,-1,true)}];
      groups.forEach((g,i)=>frames.push({title:`Group ${i+1}: ${g} → ${digit(parseInt(g,2))}`,explain:`Use ordinary binary weights inside this group: ${size===4?'8, 4, 2, 1':'4, 2, 1'}. Place the resulting digit on the same side of the point.`,html:groupingDiagram(data,size,left,right,i,true)}));
      frames.push({title:'Read the new digits',explain:`The point separates the same whole and fractional amounts. Both representations equal ${nfmt(data.value)} in decimal.`,html:groupingDiagram(data,size,left,right,groups.length,true)+banner(data.source+'₂',`= ${result}${base===8?'₈':'₁₆'}`)});
      return {frames,takeaway:`${data.source}₂ = ${result}${base===8?'₈':'₁₆'}. Pad before the whole part or after the fraction; never insert zeros beside the point.`};
    }
  });

  function arithmeticBoard(a,b,f,state,op) {
    const count=a.length,point=count-f,cell=Math.min(52,570/count),left=(700-(count*cell+15))/2+15;
    const xpos=i=>left+i*cell+(i>=point?15:0);
    let s=text(35,26,op==='+'?'Work right to left. Two units here carry as one unit to the left.':'Work right to left. One unit to the left splits into two units here.',14,C.muted);
    const rowY=op==='+'?[112,169,238]:[136,190,254];
    s+=text(left-28,rowY[1],op,25,C.ink,'text-anchor="middle"');
    for(let i=0;i<count;i++) {
      const x=xpos(i),cx=x+(cell-6)/2,active=i===state.col;
      if(active)s+=rect(x-3,op==='+'?48:49,cell,op==='+'?205:222,C.gold,'none',8);
      if(op==='+') {
        if(state.carries[i])s+=text(cx,64,'1',17,C.orange,'text-anchor="middle" font-weight="700"');
        s+=text(cx,rowY[0],a[i],27,C.ink,'text-anchor="middle"');
      } else {
        const changed=state.top[i]!==Number(a[i]);
        s+=text(cx,78,a[i],18,changed?C.muted:C.ink,'text-anchor="middle"'+(changed?' text-decoration="line-through"':''));
        if(changed)s+=text(cx,rowY[0],state.top[i],27,C.orange,'text-anchor="middle" font-weight="700"');
        else s+=text(cx,rowY[0],state.top[i],27,C.ink,'text-anchor="middle"');
      }
      s+=text(cx,rowY[1],b[i],27,C.ink,'text-anchor="middle"');
      s+=text(cx,rowY[2],state.result[i]===null?'·':state.result[i],29,state.result[i]===null?C.muted:C.blue,'text-anchor="middle" font-weight="700"');
      if(i===point) {
        const px=x-11;
        rowY.forEach(y=>s+=text(px,y,'·',25,C.blue,'text-anchor="middle"'));
      }
    }
    s+=line(left-10,rowY[1]+17,xpos(count-1)+cell,rowY[1]+17,C.ink);
    if(state.arrow) {
      const from=xpos(state.arrow.from)+(cell-6)/2,to=xpos(state.arrow.to)+(cell-6)/2,y=op==='+'?73:87;
      s+=`<path d="M ${from} ${y} Q ${(from+to)/2} ${Math.max(29,y-45)} ${to} ${y}" fill="none" stroke="${C.orange}" stroke-width="2"/>`;
      const dir=to>from?1:-1;
      s+=`<path d="M ${to-dir*7} ${y-7} L ${to} ${y} L ${to-dir*2} ${y-10}" fill="none" stroke="${C.orange}" stroke-width="2"/>`;
    }
    const labelY=op==='+'?286:298;
    s+=text(350,labelY,state.note||'The highlighted column is the next place to solve.',15,C.ink,'text-anchor="middle" font-weight="600"');
    s+=text(350,labelY+28,op==='+'?'Small orange 1 = incoming carry':'Gray crossed digit = original · orange digit = after borrowing',12,C.muted,'text-anchor="middle"');
    return svg(`Binary ${op==='+'?'addition':'subtraction'}. ${a.slice(0,point)+'.'+a.slice(point)} ${op} ${b.slice(0,point)+'.'+b.slice(point)}. ${state.note||'Start at the rightmost fractional place.'}`,labelY+48,s);
  }
  V.register({
    id:'binary-arithmetic',title:'Follow every carry and borrow',
    lead:'Line up the points, then solve one column at a time. Watch a borrowed whole split across the point.',
    inputs:[{key:'a',label:'First binary value',type:'text',value:'1.00',maxLength:9,hint:'Up to 4 whole bits and 4 fraction bits.'},{key:'op',label:'Operation',type:'select',value:'-',options:[{value:'-',label:'Subtract'},{value:'+',label:'Add'}]},{key:'b',label:'Second binary value',type:'text',value:'0.01',maxLength:9}],
    presets:[{label:'Borrow across the point',values:{a:'1.00',b:'0.01',op:'-'}},{label:'Carry across the point',values:{a:'0.11',b:'0.01',op:'+'}},{label:'Several carries',values:{a:'11.111',b:'1.011',op:'+'}},{label:'Borrow through zeros',values:{a:'10.000',b:'0.001',op:'-'}}],
    build(values) {
      const A=binary(values.a,4,4),B=binary(values.b,4,4),op=String(values.op);
      if(!['+','-'].includes(op))throw Error('Choose addition or subtraction.');
      if(op==='-'&&A.value<B.value)throw Error('For this unsigned subtraction, make the first value at least as large as the second. Try 1.00 − 0.01.');
      const f=Math.max(A.fraction.length,B.fraction.length),whole=Math.max(A.whole.length,B.whole.length)+1;
      const a=A.whole.padStart(whole,'0')+A.fraction.padEnd(f,'0'),b=B.whole.padStart(whole,'0')+B.fraction.padEnd(f,'0');
      const count=a.length,top=a.split('').map(Number),result=Array(count).fill(null),carries=Array(count).fill(0);
      let carry=0;
      const frames=[{title:'Align the points and add harmless zeros',explain:'Equal places must share a column. The extra leading zero leaves room for a possible carry.',html:arithmeticBoard(a,b,f,{col:count-1,top:top.slice(),result:result.slice(),carries:carries.slice()},op)}];
      for(let i=count-1;i>=0;i--) {
        let note,explain,arrow=null;
        const weight=weightLabel(count-f-1-i);
        if(op==='+') {
          const total=Number(a[i])+Number(b[i])+carry,incoming=carry;
          result[i]=total%2;carry=Math.floor(total/2);
          if(i>0)carries[i-1]=carry;
          if(carry&&i>0)arrow={from:i,to:i-1};
          note=`${a[i]} + ${b[i]} + ${incoming} = ${total} → write ${result[i]}${carry?', carry 1':''}`;
          explain=`At weight ${weight}, ${total} units become ${carry?'one unit in the next larger place and ':''}${result[i]} unit(s) here. ${carry?'The carry moves left, even across the point.':'No carry is needed.'}`;
        } else {
          let borrowed=false,donor=i;
          if(top[i]<Number(b[i])) {
            donor=i-1;while(donor>=0&&top[donor]===0)donor--;
            if(donor<0)throw Error('The subtraction would need a negative unsigned result.');
            top[donor]--;
            for(let j=donor+1;j<i;j++)top[j]=1;
            top[i]+=2;borrowed=true;arrow={from:donor,to:i};
          }
          result[i]=top[i]-Number(b[i]);
          note=`${top[i]} − ${b[i]} = ${result[i]}${borrowed?' (after borrowing)':''}`;
          explain=borrowed?`Borrow from weight ${weightLabel(count-f-1-donor)}: its donor loses 1, each crossed zero keeps 1, and the active column receives 2. Now ${top[i]} − ${b[i]} = ${result[i]}.`:`At weight ${weight}, ${top[i]} − ${b[i]} = ${result[i]}. Use the adjusted top digit if an earlier step already borrowed from it.`;
        }
        frames.push({title:`Solve the ${weight} column`,explain,html:arithmeticBoard(a,b,f,{col:i,top:top.slice(),result:result.slice(),carries:carries.slice(),note,arrow},op)});
      }
      const answer=binaryResult(result.join(''),f),decimal=op==='+'?A.value+B.value:A.value-B.value;
      frames.push({title:'Read and reverse-check the answer',explain:`Decimal check: ${nfmt(A.value)} ${op==='-'?'−':'+'} ${nfmt(B.value)} = ${nfmt(decimal)}. The binary result represents this same amount.`,html:arithmeticBoard(a,b,f,{col:-1,top:top.slice(),result:result.slice(),carries:carries.slice(),note:'Every column is complete.'},op)+banner(`${A.source}₂ ${op==='-'?'−':'+'} ${B.source}₂`,`= ${answer}₂`)});
      return {frames,takeaway:`${A.source}₂ ${op==='-'?'−':'+'} ${B.source}₂ = ${answer}₂ = ${nfmt(decimal)}₁₀. ${op==='+'?'A carry transfers two units here into one unit to the left.':'Borrowing splits one unit to the left into two units here.'}`};
    }
  });

  V.register({
    id:'fixed-point',title:'Decode a signed fixed-point word',
    lead:'An 8-bit two’s-complement word has one negative place. Move the implied point to see its scale change.',
    inputs:[{key:'bits',label:'8-bit word',type:'text',value:'11101000',maxLength:8,hint:'Exactly 8 binary bits.'},{key:'fraction',label:'Fractional places',type:'select',value:'3',options:[{value:'2',label:'2 fraction bits (divide by 4)'},{value:'3',label:'3 fraction bits (divide by 8)'},{value:'4',label:'4 fraction bits (divide by 16)'}]}],
    presets:[{label:'A negative fraction',values:{bits:'11101000',fraction:'3'}},{label:'A positive fraction',values:{bits:'00101100',fraction:'3'}},{label:'Smallest negative',values:{bits:'10000000',fraction:'4'}}],
    build(values) {
      const bits=String(values.bits).trim(),f=Number(values.fraction);
      if(!/^[01]{8}$/.test(bits))throw Error('Enter exactly eight bits, such as 11101000.');
      if(![2,3,4].includes(f))throw Error('Choose 2, 3 or 4 fractional places.');
      const unsigned=parseInt(bits,2),signed=unsigned>=128?unsigned-256:unsigned,value=signed/(2**f),data={bits};
      const frames=[{title:'The leftmost weight is negative',explain:`With ${f} fractional places, the signed weights start at −${2**(7-f)}. The point is implied; the stored word still has eight bits.`,html:placeDiagram(data,-1,true,f).html}];
      let total=0;
      bits.split('').forEach((b,i)=>{
        const p=7-f-i,w=i===0?-(2**p):2**p,next=total+Number(b)*w;
        frames.push({title:`Bit ${i+1}: ${b} × ${w<0?'−':''}${weightLabel(p)}`,explain:`${nfmt(total)} ${Number(b)*w<0?'−':'+'} ${nfmt(Math.abs(Number(b)*w))} = ${nfmt(next)}. ${i===0?'Only the sign place has a negative weight.':'Every remaining place has its ordinary positive weight.'}`,html:placeDiagram(data,i,true,f).html});total=next;
      });
      frames.push({title:'Check with integer decoding, then scale',explain:`As an 8-bit signed integer, ${bits} is ${signed}${unsigned>=128?' ('+unsigned+' − 256)':''}. Divide by ${2**f} for ${f} fractional places: ${signed} ÷ ${2**f} = ${nfmt(value)}.`,html:placeDiagram(data,8,true,f).html+banner(bits+' · signed, '+f+' fraction bits','= '+nfmt(value))});
      return {frames,takeaway:`${bits} with ${f} fractional bits represents ${nfmt(value)}. Decode the 8-bit two’s-complement integer (${signed}), then divide by ${2**f}.`};
    }
  });

  function productBoard(a,b,rows,shown,total,showSum) {
    const width=Math.max(a.length+b.length,total.toString(2).length),cell=Math.min(42,440/width),right=660,left=right-width*cell;
    let s=text(38,27,'Multiply whole-number bit strings; restore the scale at the end',14,C.muted);
    const bitRow=(bits,y,highlight,shift=0)=>{
      let row='';const padded=bits.padStart(width,' ');
      for(let i=0;i<width;i++) {
        const x=left+i*cell,cx=x+cell/2;
        if(highlight)row+=rect(x+1,y-25,cell-2,34,C.gold,'none',5);
        if(padded[i]!==' ')row+=text(cx,y,padded[i],23,i>=width-shift?C.muted:C.ink,'text-anchor="middle" font-weight="600"');
      }
      return row;
    };
    s+=text(38,74,'Point removed',13,C.muted)+bitRow(a,76,false);
    s+=text(left-22,117,'×',24,C.ink)+bitRow(b,119,false);
    s+=line(left-17,136,right,136,C.ink);
    rows.forEach((row,i)=>{
      const y=173+i*37,active=i===shown-1;
      s+=text(38,y,`bit ${row.bit} · shift ${i}`,13,active?C.orange:C.muted,'font-weight="600"');
      if(i<shown)s+=bitRow(row.value.toString(2),y,active,row.bit?i:0);
      else s+=text(right-6,y,'…',19,C.muted,'text-anchor="end"');
    });
    const sumY=173+rows.length*37;
    s+=line(left-17,sumY-17,right,sumY-17,C.ink);
    s+=text(38,sumY+13,'Add the partial products',13,C.muted);
    if(showSum)s+=bitRow(total.toString(2),sumY+15,false);else s+=text(right-6,sumY+15,'?',25,C.muted,'text-anchor="end"');
    s+=text(350,sumY+58,'Each left shift multiplies a whole-number row by 2.',13,C.muted,'text-anchor="middle"');
    return svg(`Whole-number binary multiplication ${a} times ${b}. ${shown} partial-product rows revealed.${showSum?' Sum is '+total.toString(2)+'.':''}`,sumY+78,s);
  }
  V.register({
    id:'binary-multiplication',title:'Build multiplication from shifted rows',
    lead:'Every 1 in the multiplier selects a shifted copy. The two inputs tell you exactly where the final point belongs.',
    inputs:[{key:'a',label:'First binary fraction',type:'text',value:'10.1',maxLength:6,hint:'Up to 3 whole bits and 2 fractional bits.'},{key:'b',label:'Second binary fraction',type:'text',value:'1.1',maxLength:6}],
    presets:[{label:'2.5 × 1.5',values:{a:'10.1',b:'1.1'}},{label:'Two fractions',values:{a:'0.11',b:'0.10'}},{label:'More shifted rows',values:{a:'101.01',b:'10.11'}}],
    build(values) {
      const A=binary(values.a,3,2),B=binary(values.b,3,2),ai=parseInt(A.whole+A.fraction,2),bi=parseInt(B.whole+B.fraction,2),a=ai.toString(2),b=bi.toString(2),raw=ai*bi,f=A.fraction.length+B.fraction.length;
      const rows=b.split('').reverse().map((bit,i)=>({bit:Number(bit),value:ai*Number(bit)*(2**i)}));
      const frames=[{title:'Temporarily remove both points',explain:`${A.source} becomes ${a}; ${B.source} becomes ${b}. Remember ${A.fraction.length} + ${B.fraction.length} = ${f} fractional places for the answer.`,html:productBoard(a,b,rows,0,raw,false)}];
      rows.forEach((row,i)=>frames.push({title:`Multiplier bit ${i+1}: ${row.bit}`,explain:row.bit?`Select a copy of ${a}, then shift it ${i} place(s) left. A shift appends zero(s), multiplying this row by ${2**i}.`:'This multiplier bit is 0, so its partial-product row is zero.',html:productBoard(a,b,rows,i+1,raw,false)}));
      frames.push({title:'Add the shifted rows',explain:`The whole-number product is ${raw.toString(2)}₂ (${raw}₁₀). This is still scaled; the fractional places must be restored.`,html:productBoard(a,b,rows,rows.length,raw,true)});
      const answer=binaryResult(raw.toString(2).padStart(f+1,'0'),f),decimal=A.value*B.value;
      frames.push({title:`Restore ${f} fractional places`,explain:`Count ${f} bits from the right and insert the point, padding leading zeros when needed. Decimal check: ${nfmt(A.value)} × ${nfmt(B.value)} = ${nfmt(decimal)}.`,html:productBoard(a,b,rows,rows.length,raw,true)+banner(`${A.source}₂ × ${B.source}₂`,`= ${answer}₂`)});
      return {frames,takeaway:`${A.source}₂ × ${B.source}₂ = ${answer}₂ = ${nfmt(decimal)}₁₀. Add the inputs’ fractional-place counts: ${A.fraction.length} + ${B.fraction.length} = ${f}.`};
    }
  });
})();
