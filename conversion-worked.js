/* Exact, fully worked source-place and target-digit explanations for the converter. */
(function (root) {
  'use strict';
  const DIGITS = '0123456789ABCDEF';
  const SUB = {2:'₂',8:'₈',10:'₁₀',16:'₁₆'};
  const NAMES = {2:'binary',8:'octal',10:'decimal',16:'hexadecimal'};
  function gcd(a,b) { while (b) { const r = a % b; a = b; b = r; } return a; }
  function rational(n,d) {
    if (d === 0n) throw new Error('A denominator cannot be zero.');
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n < 0n ? -n : n,d);
    return {n:n/g,d:d/g};
  }
  function add(a,b) { return rational(a.n*b.d+b.n*a.d,a.d*b.d); }
  function equal(a,b) { return a.n*b.d === b.n*a.d; }
  function fraction(a) { return a.n.toString() + (a.d === 1n ? '' : '/' + a.d.toString()); }
  function power(base,n) { return BigInt(base) ** BigInt(n); }
  function assert(condition,message) { if (!condition) throw new Error('Worked-solution verification failed: ' + message); }
  function decimal(a) {
    // Test termination before division. No floating-point arithmetic is used.
    let d = a.d;
    while (d % 2n === 0n) d /= 2n;
    while (d % 5n === 0n) d /= 5n;
    if (d !== 1n) return null;
    const negative = a.n < 0n, n = negative ? -a.n : a.n;
    const whole = n / a.d;
    let remainder = n % a.d, digits = '';
    while (remainder) {
      const product = remainder * 10n;
      digits += (product / a.d).toString();
      remainder = product % a.d;
    }
    return (negative ? '-' : '') + whole.toString() + (digits ? '.' + digits : '');
  }
  function shown(a) {
    const f = fraction(a), d = decimal(a);
    // Long terminating values stay exact fractions in dense tables.
    return d !== null && d !== f && d.length <= 72 ? f + ' (= ' + d + ')' : f;
  }
  function operation(title,explanation,math) {
    const out = {title,explanation};
    if (math !== undefined) out.math = math;
    return out;
  }
  function readDigits(text,base) {
    let n = 0n;
    for (const c of text) n = n * BigInt(base) + BigInt(DIGITS.indexOf(c));
    return n;
  }
  function parseMagnitude(text,base) {
    const unsigned = text.replace(/^[+-]/,'');
    const parts = unsigned.split('.'), whole = parts[0] || '0', tail = parts[1] || '';
    const rawN = readDigits(whole + tail,base), rawD = power(base,tail.length);
    return {whole,tail,rawN,rawD,value:rational(rawN,rawD),negative:text[0] === '-' && rawN !== 0n};
  }
  function canTerminate(n,d,base) {
    let rest = rational(n,d).d;
    let common = gcd(rest,BigInt(base));
    while (common > 1n) { rest /= common; common = gcd(rest,BigInt(base)); }
    return rest === 1n;
  }
  function build(input,fromBase,toBase,precision) {
    if (!root.LogicEngine || typeof root.LogicEngine.convert !== 'function') {
      throw new Error('The number conversion engine has not loaded. Reload the page and try again.');
    }
    // Match all engine input validation, including 100 characters and 1–64 places.
    const reference = root.LogicEngine.convert(input,fromBase,toBase,precision);
    const sourceBase = Number(fromBase), targetBase = Number(toBase);
    const places = precision === undefined ? 16 : precision;
    const source = String(input).trim().toUpperCase();
    const p = parseMagnitude(source,sourceBase);
    const sourceSigned = rational(p.negative ? -p.value.n : p.value.n,p.value.d);
    assert(fraction(sourceSigned) === reference.fraction,'source rational disagrees with the engine');
    const steps = [], tables = [], checks = [];
    const placeRows = [];
    const targetBig = BigInt(targetBase);
    steps.push(operation('Read the number and its base',
      'The base tells us the weight of each position. The radix point separates whole-number places from fractional places. Changing base changes the written digits while preserving the value.',
      source + SUB[sourceBase] + ' → base ' + targetBase + '\nAllowed source digits: ' + DIGITS.slice(0,sourceBase)));
    steps.push(operation('Give every source position its weight',
      'The place just left of the point has exponent 0 and weight 1. Move left to multiply the weight by the source base. Move right to divide by the source base. A negative exponent means a reciprocal, not a negative number.',
      sourceBase + '^0 = 1; ' + sourceBase + '^1 = ' + sourceBase + '\n' + sourceBase + '^(-1) = 1/' + sourceBase + '; ' + sourceBase + '^(-2) = 1/' + power(sourceBase,2)));
    let sum = rational(0n,1n);
    const positions = [];
    for (let i = 0; i < p.whole.length; i++) positions.push({digit:p.whole[i],exponent:p.whole.length-i-1,label:'Whole position ' + (i+1) + ' from the left'});
    for (let i = 0; i < p.tail.length; i++) positions.push({digit:p.tail[i],exponent:-(i+1),label:'Fractional position ' + (i+1)});
    for (const pos of positions) {
      const digit = BigInt(DIGITS.indexOf(pos.digit));
      const weight = pos.exponent >= 0 ? rational(power(sourceBase,pos.exponent),1n) : rational(1n,power(sourceBase,-pos.exponent));
      const contribution = rational(digit*weight.n,weight.d);
      const previous = sum;
      sum = add(sum,contribution);
      const digitLabel = pos.digit + (digit >= 10n ? ' = ' + digit : '');
      const weightLabel = sourceBase + '^(' + pos.exponent + ') = ' + fraction(weight);
      placeRows.push([pos.label,digitLabel,weightLabel, digit + ' × ' + fraction(weight) + ' = ' + fraction(contribution),decimal(contribution)]);
      steps.push(operation('Evaluate source digit ' + pos.digit + ' at exponent ' + pos.exponent,
        'This digit has decimal digit value ' + digit + '. Its position has weight ' + fraction(weight) + '. Multiply the digit value by the weight, then add the contribution to the running total.' + (digit === 0n ? ' This zero contributes 0, but its position is still counted; later digits cannot slide into its place.' : ''),
        digit + ' × ' + sourceBase + '^(' + pos.exponent + ') = ' + shown(contribution) + '\nRunning total: ' + fraction(previous) + ' + ' + fraction(contribution) + ' = ' + shown(sum)));
    }
    assert(equal(sum,p.value),'source place contributions do not reconstruct the input');
    tables.push({caption:'Every source digit: place weight and exact contribution',headers:['Source position','Digit value','Weight','Exact contribution','Exact decimal contribution'],rows:placeRows});
    steps.push(operation('Restore the point with one exact fraction',
      'As a second way to reconstruct the same value, remove the radix point, read the combined digits as an integer in the source base, then divide by one source-base factor for every fractional position. Reduce numerator and denominator by their greatest common divisor.',
      p.whole + p.tail + SUB[sourceBase] + ' = ' + p.rawN + ' in decimal\n' + p.rawN + '/' + sourceBase + '^' + p.tail.length + ' = ' + p.rawN + '/' + p.rawD + '\ngcd(' + p.rawN + ', ' + p.rawD + ') = ' + gcd(p.rawN,p.rawD) + '\nMagnitude = ' + shown(p.value)));
    if (p.negative) steps.push(operation('Handle the negative sign separately',
      'The digit algorithms below work with the positive magnitude. Keep the minus sign aside, convert that magnitude, then put the minus sign back in front of the completed numeral.',
      source + SUB[sourceBase] + ' has magnitude ' + fraction(p.value) + ' and signed value ' + fraction(sourceSigned)));
    else if (/^-/.test(source)) steps.push(operation('Normalize negative zero',
      'Every digit has value zero, so the value is zero. Its standard numeral is 0; a leading minus sign does not change zero.', '-0 = 0'));
    const numerator = p.value.n, denominator = p.value.d;
    const wholeValue = numerator / denominator, initialRemainder = numerator % denominator;
    steps.push(operation('Separate the whole number from the fraction',
      'Divide the exact numerator by its denominator. The integer quotient is the whole-number part; the remainder divided by the denominator is the fractional part. Only the fractional remainder goes into fractional digit generation.',
      numerator + ' ÷ ' + denominator + ' = ' + wholeValue + ' remainder ' + initialRemainder + '\n' + numerator + ' = ' + wholeValue + ' × ' + denominator + ' + ' + initialRemainder + '\nMagnitude = ' + wholeValue + ' + ' + shown(rational(initialRemainder,denominator))));
    checks.push('The source-place contributions add to ' + fraction(p.value) + '. Independently removing the radix point gives ' + p.rawN + '/' + p.rawD + ', which reduces to the same exact value.');
    checks.push('Whole/fraction split: ' + wholeValue + ' × ' + denominator + ' + ' + initialRemainder + ' = ' + numerator + '. Dividing this identity by ' + denominator + ' restores the input magnitude.');
    let integerDigits = '', reverseDigits = [];
    if (targetBase === 10) {
      integerDigits = wholeValue.toString();
      steps.push(operation('Write the decimal whole-number part',
        'The quotient above is already an exact base-ten integer, so it is the decimal whole-number part. We still need to find every fractional decimal digit below.',
        'Decimal whole part = ' + integerDigits));
    } else {
      const integerRows = [];
      if (wholeValue === 0n) {
        integerDigits = '0';
        integerRows.push(['1','0','0 ÷ ' + targetBase + ' = 0','0 → 0','0 = 0 × ' + targetBase + ' + 0']);
        steps.push(operation('Keep the zero before the radix point',
          'The whole-number part is 0. Write 0 before the point. No nonzero integer remains to divide, but this zero is an essential part of the complete fractional numeral.',
          '0 ÷ ' + targetBase + ' = 0 remainder 0\nWhole-number digits: 0'));
      } else {
        steps.push(operation('Divide the whole-number part repeatedly',
          'Divide the current whole number by ' + targetBase + '. Record the remainder as one target-base digit and carry only the integer quotient into the next row. The first remainder is the rightmost whole-number digit. Stop when the quotient becomes 0.',
          'current whole number = quotient × ' + targetBase + ' + remainder'));
        let current = wholeValue, index = 0;
        while (current > 0n) {
          index++;
          const quotient = current / targetBig, remainder = current % targetBig, digit = DIGITS[Number(remainder)];
          assert(current === quotient*targetBig+remainder,'integer division identity');
          integerRows.push([String(index),String(current),current + ' ÷ ' + targetBase + ' = ' + quotient,remainder + ' → ' + digit,current + ' = ' + quotient + ' × ' + targetBase + ' + ' + remainder]);
          steps.push(operation('Whole-number division ' + index + ': keep remainder ' + digit,
            'Divide ' + current + ' by ' + targetBase + '. The quotient is ' + quotient + ' and the remainder is ' + remainder + '. Record digit ' + digit + (remainder >= 10n ? ' because hexadecimal uses ' + digit + ' for decimal digit value ' + remainder : '') + '. The quotient ' + quotient + ' becomes the next current whole number.',
            current + ' ÷ ' + targetBase + ' = ' + quotient + ' remainder ' + remainder + '\nCheck: ' + quotient + ' × ' + targetBase + ' + ' + remainder + ' = ' + current));
          reverseDigits.push(digit);
          current = quotient;
        }
        integerDigits = reverseDigits.slice().reverse().join('');
        steps.push(operation('Reverse only the whole-number remainders',
          'Repeated division finds the lowest place first. Read its recorded remainders from the last row back to the first to write the whole-number digits from left to right.',
          'Found top to bottom: ' + reverseDigits.join(' → ') + '\nRead bottom to top: ' + integerDigits));
      }
      tables.push({caption:'Whole-number conversion: divide downward, read the remainders upward',headers:['Row','Current whole number','Integer quotient','Remainder → digit','Exact identity'],rows:integerRows});
      assert(readDigits(integerDigits,targetBase) === wholeValue,'whole-number digits do not reconstruct the integer');
      checks.push('Reading the whole-number remainders upward gives ' + integerDigits + SUB[targetBase] + '. Reading those digits back in base ' + targetBase + ' gives decimal integer ' + wholeValue + '.');
    }
    let remainder = initialRemainder, fractionalDigits = '', cycle = null;
    const fractionRows = [], seen = new Map();
    if (remainder !== 0n) {
      seen.set(remainder.toString(),0);
      steps.push(operation(targetBase === 10 ? 'Generate decimal fractional digits by long division' : 'Multiply the fractional remainder repeatedly',
        'Multiply the current fraction by ' + targetBase + '. Its whole-number part is the next fractional digit. Subtract that whole part to get the next fractional remainder. Keep the denominator fixed for an exact arithmetic trace. Fractional digits are read downward in the order found.',
        '(current remainder / ' + denominator + ') × ' + targetBase + ' = next digit + (new remainder / ' + denominator + ')'));
      while (remainder !== 0n && fractionalDigits.length < places) {
        const index = fractionalDigits.length + 1, before = remainder;
        const productN = before * targetBig, digitValue = productN / denominator;
        remainder = productN % denominator;
        assert(digitValue >= 0n && digitValue < targetBig,'fractional digit is outside the target base');
        assert(productN === digitValue*denominator+remainder,'fractional division identity');
        const digit = DIGITS[Number(digitValue)];
        fractionalDigits += digit;
        const currentValue = rational(before,denominator), productValue = rational(productN,denominator), nextValue = rational(remainder,denominator);
        fractionRows.push([String(index),shown(currentValue),shown(productValue),digitValue + ' → ' + digit,shown(nextValue)]);
        steps.push(operation('Fractional digit ' + index + ': write ' + digit,
          'Multiply the current fraction ' + shown(currentValue) + ' by ' + targetBase + '. Divide its product numerator ' + productN + ' by the unchanged denominator ' + denominator + ': the whole-number quotient is ' + digitValue + ', so the next target digit is ' + digit + (digitValue >= 10n ? ' (' + digitValue + ' is written ' + digit + ' in hexadecimal)' : '') + '. Subtract the whole-number part. Only the new fraction ' + shown(nextValue) + ' is carried into the next row.' + (digitValue === 0n ? ' Keep this 0 digit; it holds the place for later digits.' : ''),
          before + '/' + denominator + ' × ' + targetBase + ' = ' + productN + '/' + denominator + ' = ' + shown(productValue) + '\n' + productN + ' ÷ ' + denominator + ' = ' + digitValue + ' remainder ' + remainder + '\nRemainder numerator: ' + productN + ' − ' + digitValue + ' × ' + denominator + ' = ' + remainder + '\nNext fraction: ' + remainder + '/' + denominator + ' = ' + shown(nextValue)));
        if (remainder !== 0n) {
          const oldIndex = seen.get(remainder.toString());
          if (oldIndex !== undefined && cycle === null) cycle = {start:oldIndex,length:index-oldIndex};
          else if (oldIndex === undefined) seen.set(remainder.toString(),index);
        }
      }
      tables.push({caption:targetBase === 10 ? 'Decimal long division: every digit and remainder' : 'Fraction conversion: multiply downward and read the digits downward',headers:['Digit position','Current fraction','Exact product','Whole part → digit','Keep this fractional remainder'],rows:fractionRows});
      steps.push(operation('Read the fractional digits without reversing them',
        'Multiplication reveals the first fractional position first, then the second, and so on. Join these digits in the same top-to-bottom order and place them after the radix point.',
        'Digits in row order: ' + fractionalDigits.split('').join(' → ') + '\nFractional part written: 0.' + fractionalDigits + SUB[targetBase]));
    } else {
      steps.push(operation('No fractional digits are needed',
        'The fractional remainder is 0 from the start. The value is an integer, so the standard output omits the radix point. Adding .0 would have the same value.',
        'Fractional remainder = 0\nWhole numeral = ' + integerDigits + SUB[targetBase]));
    }
    const exact = remainder === 0n;
    const result = (p.negative ? '-' : '') + integerDigits + (fractionalDigits ? '.' + fractionalDigits : '');
    assert(result === reference.result,'generated target numeral disagrees with the engine');
    assert(exact === reference.exact,'exactness flag disagrees with the engine');
    if (exact) {
      steps.push(operation('Stop because the remainder is zero',
        'Every part of the input value has been used. Every later fractional digit would be 0, so this result is exact. The precision setting is a maximum, not a request to pad the answer with zeros.',
        'Final remainder = 0\n' + source + SUB[sourceBase] + ' = ' + result + SUB[targetBase] + ' exactly'));
    } else {
      const terminates = canTerminate(initialRemainder,denominator,targetBase);
      let why = terminates ? 'This expansion can terminate, but it needs more fractional positions than the selected limit.' : 'The reduced denominator contains a factor that cannot be removed by multiplying by the target base. Its target-base fractional expansion therefore repeats and does not terminate.';
      if (cycle) {
        const block = fractionalDigits.slice(cycle.start,cycle.start+cycle.length);
        why += ' The same exact remainder has already reappeared: after ' + cycle.start + ' initial fractional digit(s), the block ' + block + ' repeats with period ' + cycle.length + '.';
      } else if (!terminates) why += ' The complete repeating cycle is not yet visible within this selected number of digits.';
      steps.push(operation('Stop at the selected precision: this is truncation',
        'We have written the maximum ' + places + ' fractional digits, but a nonzero remainder remains. ' + why + ' The engine stops without rounding. For a negative input, this truncation is toward zero because the sign is restored after converting the positive magnitude.',
        'Final current remainder = ' + remainder + '/' + denominator + '\nDisplayed result: ' + result + SUB[targetBase] + '\nThis displayed numeral is truncated, not exact.'));
    }
    if (p.negative) steps.push(operation('Put the minus sign back',
      'The magnitude conversion is complete. Apply the original minus sign to the whole converted numeral, including its fractional part.',
      'Signed output: ' + result + SUB[targetBase]));
    const scale = power(targetBase,fractionalDigits.length);
    const fractionalInteger = fractionalDigits ? readDigits(fractionalDigits,targetBase) : 0n;
    const represented = rational(wholeValue*scale+fractionalInteger,scale);
    const missing = rational(p.value.n*represented.d-represented.n*p.value.d,p.value.d*represented.d);
    const expectedMissing = rational(remainder,denominator*scale);
    assert(equal(missing,expectedMissing),'displayed numeral plus remaining tail does not reconstruct the input');
    assert(missing.n >= 0n && missing.n*scale < missing.d,'truncation error is outside one final-place unit');
    if (exact) assert(equal(represented,p.value),'exact target answer has a different value');
    const signedRepresented = rational(p.negative ? -represented.n : represented.n,represented.d);
    steps.push(operation('Reconstruct the written answer to check it',
      'Read the completed whole-number digits back as an integer. Read the fractional digits as an integer and divide by one target-base factor for every fractional position. This checks the displayed numeral with exact fractions, without rounded intermediate values.',
      integerDigits + SUB[targetBase] + ' = ' + wholeValue + '\n' + (fractionalDigits ? fractionalDigits + SUB[targetBase] + ' = ' + fractionalInteger + '\nFractional contribution = ' + fractionalInteger + '/' + targetBase + '^' + fractionalDigits.length + ' = ' + fraction(rational(fractionalInteger,scale)) : 'Fractional contribution = 0') + '\nMagnitude represented = ' + fraction(represented) + '\nSigned displayed value = ' + shown(signedRepresented)));
    if (exact) checks.push('The completed numeral ' + result + SUB[targetBase] + ' reconstructs the exact signed fraction ' + fraction(signedRepresented) + ', equal to the original value ' + fraction(sourceSigned) + '.');
    else {
      checks.push('The written magnitude represents ' + fraction(represented) + '. The discarded positive magnitude is exactly ' + fraction(missing) + ' = final remainder / (' + denominator + ' × ' + targetBase + '^' + fractionalDigits.length + ').');
      checks.push('That discarded magnitude is less than one unit in the last displayed fractional place, 1/' + scale + '. Adding it back to the written magnitude gives the exact input magnitude ' + fraction(p.value) + '.');
    }
    checks.push('The independently generated digit string and exactness flag agree with the existing conversion engine: ' + result + ' in base ' + targetBase + '; ' + (exact ? 'exact' : 'truncated after ' + places + ' fractional digits') + '.');
    return {
      method:targetBase === 10 ? 'Every source place value, followed by exact decimal long division' : 'Every source place value, repeated whole-number division, and repeated fractional multiplication',
      given:source + SUB[sourceBase] + ' → ' + NAMES[targetBase] + ' (base ' + targetBase + '), with at most ' + places + ' fractional digits.',
      steps:steps,
      tables:tables,
      check:checks,
      pitfall:'Read whole-number division remainders from bottom to top. Read fractional multiplication digits from top to bottom. Carry only the integer quotient for whole-number division and only the fractional remainder for fractional multiplication. Keep zero digits in their positions. A nonzero final remainder means the display was truncated; it was not rounded.',
      result:result,
      exact:exact,
      fraction:fraction(sourceSigned)
    };
  }
  root.ConversionWorked = {build:build};
})(typeof globalThis !== 'undefined' ? globalThis : this);
