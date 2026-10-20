/* Complete, independently authored worked solutions for the fraction practice bank.
   These explanations supplement the study edition; they are not an instructor answer key. */
(() => {
  'use strict';
  const bank = window.QUESTION_BANK;
  if (!Array.isArray(bank)) throw new Error('Load questions.js before solutions-fractions.js.');
  const step = (title, explanation, math) => ({ title, explanation, ...(math ? { math } : {}) });
  const table = (caption, headers, rows) => ({ caption, headers, rows });
  const put = (id, method, given, steps, tables, check, pitfall) => {
    const question = bank.find(item => item.id === id);
    if (!question) throw new Error(`Missing fraction question ${id}.`);
    question.worked = { method, given, steps, tables, check, pitfall };
  };

  put('f1-01', 'Expand every fractional place value',
    'Given 0.101₂. Find its value in decimal.', [
      step('Identify the base and the point', 'The subscript 2 means binary. The leading 0 is the whole-number part; the digits 1, 0, 1 are fractions of one.'),
      step('Assign the first fractional weight', 'One position right of the point means divide by the base once.', '2⁻¹ = 1/2 = 0.5'),
      step('Assign the next two weights', 'Divide the weight by 2 each time you move right. The second bit gets 1/4 and the third gets 1/8.', '2⁻² = 1/4 = 0.25; 2⁻³ = 1/8 = 0.125'),
      step('Multiply each bit by its own weight', 'The middle zero contributes nothing, but it still occupies the 1/4 position.', '1 × 1/2 = 0.5; 0 × 1/4 = 0; 1 × 1/8 = 0.125'),
      step('Add the contributions', 'Start with the first contribution and include the zero term before adding the final contribution.', '0.5 + 0 + 0.125 = 0.625'),
      step('Write the decimal answer', 'Choose the option 0.625. Its digits now use decimal place values.', '0.101₂ = 0.625₁₀')
    ], [table('Each bit has its own fractional place', ['Position after point', 'Bit', 'Weight', 'Contribution'], [
      ['1', '1', '1/2', '1 × 1/2 = 0.5'], ['2', '0', '1/4', '0 × 1/4 = 0'], ['3', '1', '1/8', '1 × 1/8 = 0.125']
    ])], ['Using a common denominator: 1/2 + 1/8 = 4/8 + 1/8 = 5/8 = 0.625.', 'The answer is greater than 1/2 because the first bit is 1 and another positive term is present; it is less than 3/4 because the 1/4 bit is 0.'],
    'Do not read 0.101₂ as decimal 0.101, and do not remove the zero between the two 1s.');

  put('f1-02', 'Follow the weights one place at a time',
    'Find the weight of the second binary fractional position.', [
      step('Start immediately left of the point', 'The ones position has weight 2⁰, which is 1.', '2⁰ = 1'),
      step('Move one position right', 'Moving right in base 2 divides the previous weight by 2. This is the first fractional place.', '1 ÷ 2 = 1/2 = 2⁻¹'),
      step('Move a second position right', 'Divide by 2 again. This is the position asked for.', '(1/2) ÷ 2 = 1/4 = 2⁻²'),
      step('Make the position concrete', 'Put a single 1 in the second fractional position and 0 in the first. That number is 0.01₂.', '0.01₂ = 0 × 1/2 + 1 × 1/4 = 1/4'),
      step('Select the matching option', 'The correct weight is 1/4, equal to decimal 0.25.', 'Second fractional bit → 1/4')
    ], [table('Weights around the binary point', ['Position', 'Power', 'Value'], [
      ['Ones, immediately left', '2⁰', '1'], ['First after point', '2⁻¹', '1/2'], ['Second after point', '2⁻²', '1/4'], ['Third after point', '2⁻³', '1/8']
    ])], ['Two units of the second fractional weight equal one unit of the first: 1/4 + 1/4 = 1/2.', 'The choices 1/2 and 1/8 belong to the first and third fractional positions. The value 2 belongs on the integer side.'],
    '“Second” counts from the binary point, not from the first 1 in the digit string.');

  const multiply = (id, given, source, rows, digits, result, check, pitfall, extraSteps = []) => {
    const steps = [
      step('Use repeated multiplication by 2', 'We are converting a decimal fraction to binary. Multiplying by 2 exposes the next binary digit as the integer part. Keep only the fractional remainder for the next row.', `${source}₁₀ → binary`)
    ];
    rows.forEach((row, index) => {
      steps.push(step(`Multiplication ${index + 1}: record ${row[2]}`,
        `The product is ${row[1]}. Its integer part ${row[2]} is binary fractional digit ${index + 1}. ${row[3] === '0' ? 'The fractional remainder is zero, so the conversion is exact and can stop.' : `Keep ${row[3]} as the next fractional input; do not multiply the whole product again.`}`,
        `${row[0]} × 2 = ${row[1]} = ${row[2]} + ${row[3]}`));
    });
    steps.push(step('Read the digits from top to bottom', 'These are fractional digits, so place them after 0. in the same order they were produced. Keep any zero digits.', `Recorded digits: ${digits.split('').join(', ')} → ${result}₂`));
    steps.push(...extraSteps);
    put(id, 'Repeated multiplication, with every remainder shown', given, steps,
      [table('Read the digit column downward', ['Fraction entering this row', '× 2 gives', 'Record integer part', 'Keep fractional remainder'], rows)], check, pitfall);
  };

  multiply('f1-03', 'Given decimal 0.375. Find its exact binary fraction.', '0.375', [
    ['0.375', '0.750', '0', '0.750'], ['0.750', '1.500', '1', '0.500'], ['0.500', '1.000', '1', '0']
  ], '011', '0.011', ['Convert back: 0 × 1/2 + 1 × 1/4 + 1 × 1/8 = 0 + 0.25 + 0.125 = 0.375.', 'The remainder became zero after three multiplications, so 0.011₂ is exact. Appending trailing zeros preserves the same value.'],
    'The first recorded bit is 0. Removing it would change 0.011₂ into 0.11₂ = 0.75.');

  put('f1-04', 'Connect a finite binary expansion to its denominator',
    'A rational number has already been reduced to lowest terms. Decide when its binary fractional part terminates.', [
      step('Write what one finite binary fraction means', 'With three fractional bits, all contributions can be written over denominator 2³ = 8.', '0.101₂ = 1/2 + 0/4 + 1/8 = (4 + 0 + 1)/8 = 5/8'),
      step('Generalize to n fractional bits', 'Each bit weight is a fraction whose denominator divides 2ⁿ. Adding the terms produces an integer numerator divided by 2ⁿ.', 'Any finite n-bit binary fraction = integer / 2ⁿ'),
      step('Reduce the fraction', 'Reducing a denominator that is a power of 2 can remove factors of 2, but cannot create factors such as 3 or 5.', '5/8 has denominator 8 = 2³; 6/16 reduces to 3/8'),
      step('Prove the reverse direction', 'If the reduced denominator is 2ᵏ, write the numerator in binary and place the point k positions from the right.', '3/8 = 3/2³ = 0.011₂'),
      step('Test a denominator with another prime factor', 'The reduced fraction 1/5 cannot equal an integer divided by 2ⁿ for any finite n. Its binary expansion repeats.', '1/5 = 0.(0011)₂'),
      step('Select the criterion', 'The reduced denominator must be a power of 2. This includes denominator 1 = 2⁰ for an integer or zero fractional part.', 'Correct option: When its denominator is a power of 2')
    ], [table('Reduce first, then inspect the denominator', ['Original fraction', 'Lowest terms', 'Reduced denominator', 'Binary result'], [
      ['3/12', '1/4', '4 = 2²', '0.01₂, terminates'], ['6/16', '3/8', '8 = 2³', '0.011₂, terminates'], ['2/10', '1/5', '5, not a power of 2', '0.(0011)₂, repeats']
    ])], ['An even numerator is insufficient: 2/3 has an even numerator but its denominator 3 prevents termination.', 'A multiple-of-10 denominator is insufficient before reduction: 2/10 reduces to 1/5 and repeats, while 5/10 reduces to 1/2 and terminates.'],
    'Apply the criterion only after reducing the fraction. A denominator containing 2 as one factor is not enough; all its prime factors must be 2.');

  multiply('f1-05', 'Given decimal 0.8125. Find an exact binary fraction.', '0.8125', [
    ['0.8125', '1.625', '1', '0.625'], ['0.625', '1.25', '1', '0.25'], ['0.25', '0.5', '0', '0.5'], ['0.5', '1.0', '1', '0']
  ], '1101', '0.1101', ['Convert back: 1 × 1/2 + 1 × 1/4 + 0 × 1/8 + 1 × 1/16 = 0.5 + 0.25 + 0 + 0.0625 = 0.8125.', 'Using sixteenths: (8 + 4 + 0 + 1)/16 = 13/16 = 0.8125.'],
    'Record the zero from the third multiplication. Skipping it would shift the final 1 from the 1/16 place to the 1/8 place.');

  put('f1-06', 'Expand both sides of the binary point',
    'Given 10.011₂. Find the exact decimal value.', [
      step('Separate the two parts', 'Keep the binary point fixed. The whole-number digits are 10 and the fractional digits are 011.', '10.011₂ = 10₂ + 0.011₂'),
      step('Evaluate the leftmost integer bit', 'The 1 is one position left of the ones position, so its weight is 2¹.', '1 × 2¹ = 1 × 2 = 2'),
      step('Evaluate the ones bit', 'The 0 immediately left of the point has weight 2⁰ = 1.', '0 × 1 = 0; integer total = 2 + 0 = 2'),
      step('Evaluate the first fractional bit', 'Immediately right of the point the weight is 1/2. Its bit is 0.', '0 × 1/2 = 0'),
      step('Evaluate the second and third fractional bits', 'The next weights are 1/4 and 1/8. Both bits are 1.', '1 × 1/4 = 0.25; 1 × 1/8 = 0.125'),
      step('Add the fractional contributions', 'Add every fractional term, preserving the zero position.', '0 + 0.25 + 0.125 = 0.375'),
      step('Combine integer and fraction', 'The whole-number contribution and the fractional contribution form one decimal number.', '2 + 0.375 = 2.375₁₀')
    ], [table('Weights across the binary point', ['Bit', 'Position weight', 'Decimal contribution'], [
      ['1', '2¹ = 2', '2'], ['0', '2⁰ = 1', '0'], ['0', '2⁻¹ = 1/2', '0'], ['1', '2⁻² = 1/4', '0.25'], ['1', '2⁻³ = 1/8', '0.125']
    ])], ['In eighths the number is (16 + 0 + 0 + 2 + 1)/8 = 19/8 = 2.375.', 'Converting the decimal parts back gives 2₁₀ = 10₂ and 0.375₁₀ = 0.011₂.'],
    '10₂ means decimal two. Reading the integer digits as decimal ten would mix two bases in the same calculation.');

  put('f1-07', 'Generate eight bits, then truncate',
    'Given decimal 0.1. Keep exactly eight binary fractional bits by truncation.', [
      step('Interpret “truncate”', 'We keep the first eight produced bits and discard everything after them. We do not increase the last kept bit, even if more nonzero bits follow.'),
      step('Multiplication 1: record 0', 'The integer part is 0. Keep the fractional part 0.2.', '0.1 × 2 = 0.2 = 0 + 0.2'),
      step('Multiplication 2: record 0', 'The integer part is 0. Keep 0.4.', '0.2 × 2 = 0.4 = 0 + 0.4'),
      step('Multiplication 3: record 0', 'The integer part is 0. Keep 0.8.', '0.4 × 2 = 0.8 = 0 + 0.8'),
      step('Multiplication 4: record 1', 'The integer part is 1. Subtract 1 from the product and keep 0.6.', '0.8 × 2 = 1.6 = 1 + 0.6'),
      step('Multiplication 5: record 1', 'The integer part is 1. Keep only the fractional remainder 0.2.', '0.6 × 2 = 1.2 = 1 + 0.2'),
      step('Multiplication 6: record 0', 'The remainder has returned to 0.2, so later bits follow the same cycle. Continue until eight bits have been recorded.', '0.2 × 2 = 0.4 = 0 + 0.4'),
      step('Multiplication 7: record 0', 'The integer part is 0. Keep 0.8.', '0.4 × 2 = 0.8 = 0 + 0.8'),
      step('Multiplication 8: record 1', 'The integer part is 1. A nonzero remainder 0.6 remains, but the instruction says to stop after eight bits.', '0.8 × 2 = 1.6 = 1 + 0.6'),
      step('Read exactly eight digits', 'Read from the first multiplication to the eighth: 0, 0, 0, 1, 1, 0, 0, 1.', 'Truncated answer = 0.00011001₂'),
      step('Measure the stored value', 'The 1s are in positions 4, 5, and 8. Add their weights to see what the truncated numeral actually stores.', '1/16 + 1/32 + 1/256 = (16 + 8 + 1)/256 = 25/256 = 0.09765625')
    ], [table('All eight multiplications', ['Bit number', 'Fraction × 2', 'Product', 'Recorded bit', 'Remainder'], [
      ['1', '0.1 × 2', '0.2', '0', '0.2'], ['2', '0.2 × 2', '0.4', '0', '0.4'], ['3', '0.4 × 2', '0.8', '0', '0.8'], ['4', '0.8 × 2', '1.6', '1', '0.6'], ['5', '0.6 × 2', '1.2', '1', '0.2'], ['6', '0.2 × 2', '0.4', '0', '0.4'], ['7', '0.4 × 2', '0.8', '0', '0.8'], ['8', '0.8 × 2', '1.6', '1', '0.6']
    ])], ['Independent scaling check: 0.1 × 256 = 25.6. Truncating to the integer numerator gives 25, which is 00011001₂ in eight bits.', 'Signed truncation error = stored − exact = 0.09765625 − 0.1 = −0.00234375.', 'Rounding instead would select numerator 26, or 0.00011010₂ = 0.1015625. That is a different instruction.'],
    'Stopping after eight bits does not make decimal 0.1 exact in binary. Use an approximation sign when equating the stored binary value to 0.1.');

  put('f1-08', 'Convert the integer and fraction separately',
    'Given decimal 3.625. Convert the complete mixed number to binary.', [
      step('Split at the decimal point', 'The integer part 3 and the fractional part 0.625 require different procedures.', '3.625 = 3 + 0.625'),
      step('Integer division 1', 'Divide 3 by 2. Record the remainder 1 and continue with quotient 1.', '3 = 1 × 2 + 1'),
      step('Integer division 2', 'Divide quotient 1 by 2. Record the remainder 1. Quotient 0 ends the integer conversion.', '1 = 0 × 2 + 1'),
      step('Read integer remainders from bottom to top', 'Integer division produces the least significant bit first. Reverse the order of these remainders.', '3₁₀ = 11₂'),
      step('Fraction multiplication 1', 'Multiply 0.625 by 2. Record integer part 1 and keep 0.25.', '0.625 × 2 = 1.25 = 1 + 0.25'),
      step('Fraction multiplication 2', 'Multiply the retained remainder 0.25 by 2. Record 0 and keep 0.5.', '0.25 × 2 = 0.5 = 0 + 0.5'),
      step('Fraction multiplication 3', 'Multiply 0.5 by 2. Record 1. The remainder is now 0, so this fraction terminates.', '0.5 × 2 = 1.0 = 1 + 0'),
      step('Read fraction digits top to bottom', 'Fraction multiplication produces the first fractional digit first, so do not reverse these digits.', '0.625₁₀ = 0.101₂'),
      step('Join the two parts', 'Write integer 11, the binary point, then fractional digits 101.', '3.625₁₀ = 11.101₂')
    ], [table('Integer part: read remainders upward', ['Dividend', 'Quotient after ÷ 2', 'Remainder'], [['3', '1', '1'], ['1', '0', '1']]),
    table('Fractional part: read digits downward', ['Fraction', '× 2 gives', 'Record digit', 'Keep remainder'], [['0.625', '1.25', '1', '0.25'], ['0.25', '0.5', '0', '0.5'], ['0.5', '1.0', '1', '0']])],
    ['Convert back: 1 × 2 + 1 × 1 + 1 × 1/2 + 0 × 1/4 + 1 × 1/8 = 2 + 1 + 0.5 + 0 + 0.125 = 3.625.'],
    'Integer remainders are read upward; fractional digits are read downward. The two directions belong to different algorithms.');

  multiply('f1-09', 'Given decimal 0.6875. Find its exact binary fraction.', '0.6875', [
    ['0.6875', '1.375', '1', '0.375'], ['0.375', '0.75', '0', '0.75'], ['0.75', '1.5', '1', '0.5'], ['0.5', '1.0', '1', '0']
  ], '1011', '0.1011', ['Weighted check: 1/2 + 0/4 + 1/8 + 1/16 = (8 + 0 + 2 + 1)/16 = 11/16 = 0.6875.', 'Alternative numerator method: 0.6875 × 16 = 11, and 11₁₀ = 1011₂. Dividing by 16 = 2⁴ moves the point four places left, giving 0.1011₂.'],
    'The second multiplication records a zero; do not omit it. The final answer needs the point: 1011₂ alone means decimal 11.');

  put('f1-10', 'Compare the two nearest representable values',
    'Round decimal 0.1 to four binary fractional bits. Find signed error = stored − exact.', [
      step('Find the spacing between stored values', 'Four fractional bits represent integer multiples of 1/2⁴. Adjacent stored numbers are one sixteenth apart.', 'Step size = 1/16 = 0.0625'),
      step('Scale to a whole-number grid', 'Multiplying the exact target by 16 tells us which integer numerator is nearest.', '0.1 × 16 = 1.6'),
      step('Locate the two neighbors', 'The adjacent numerator choices are 1 and 2. Divide each by 16 to return to the original scale.', 'Lower: 1/16 = 0.0625; upper: 2/16 = 0.125'),
      step('Measure both distances', 'Nearest rounding selects the stored value with the smaller absolute difference from the target.', '0.1 − 0.0625 = 0.0375; 0.125 − 0.1 = 0.025'),
      step('Choose numerator 2', 'Because 0.025 is smaller than 0.0375, the upper neighbor 0.125 is closer. There is no tie.', '1.6 rounds to 2, so stored value = 2/16'),
      step('Write numerator 2 using four bits', 'Decimal 2 is binary 10. Pad on the left to four numerator bits, then put all four after the binary point.', '2₁₀ = 0010₂; 2/16 = 0.0010₂'),
      step('Compute the signed error in the requested order', 'Subtract the exact target from the stored value. Since the stored value is larger, the sign is positive.', 'stored − exact = 0.125 − 0.1 = +0.025'),
      step('Select the full matching option', 'Both the bit string and the sign must agree.', '0.0010₂; error +0.025')
    ], [table('Compare both neighboring values', ['Numerator', 'Four-bit fraction', 'Stored decimal', 'Stored − exact', 'Absolute error'], [
      ['1', '0.0001₂', '0.0625', '−0.0375', '0.0375'], ['2', '0.0010₂', '0.125', '+0.025', '0.025']
    ])], ['The midpoint between 0.0625 and 0.125 is 0.09375. Since 0.1 is above the midpoint, round upward to 0.125.', 'The weight of the third fractional bit is 1/8 = 0.125, which confirms 0.0010₂. The final trailing zero preserves the requested four places.'],
    'Rounding and truncation are different. Also, “stored − exact” has the opposite sign from “exact − stored.”');

  put('f1-11', 'Align the places, then compare left to right',
    'Choose the smallest of 0.101₂, 0.11₂, 0.1001₂, and 0.0111₂.', [
      step('Make every fractional string the same length', 'Append zeros at the right end of the shorter fractions. Trailing zeros add no value.', '0.1010₂, 0.1100₂, 0.1001₂, 0.0111₂'),
      step('Start with the first fractional bit', 'At the first position after the point, the weight is 1/2. The first three options contain 1 there; the last contains 0.', 'First bits: 1, 1, 1, 0'),
      step('Compare the half-unit contribution', 'The first three options already contain at least 1/2 before any later terms are added. The last has no 1/2 term.', 'First three ≥ 0.5; last = 0/2 + 1/4 + 1/8 + 1/16'),
      step('Add the last option’s contributions', 'Use a common denominator to see its exact size.', '1/4 + 1/8 + 1/16 = (4 + 2 + 1)/16 = 7/16 = 0.4375'),
      step('Select the smallest', 'Since 0.4375 is below 0.5 and all other options are at least 0.5, no later comparison can change the conclusion.', 'Smallest = 0.0111₂'),
      step('Check all four numerically', 'Expanding each option provides an independent confirmation.', '0.625, 0.75, 0.5625, 0.4375; smallest decimal value = 0.4375')
    ], [table('Same positions, comparable weights', ['Original option', 'Padded to four places', 'Sum of weights', 'Decimal'], [
      ['0.101₂', '0.1010₂', '1/2 + 1/8', '0.625'], ['0.11₂', '0.1100₂', '1/2 + 1/4', '0.75'], ['0.1001₂', '0.1001₂', '1/2 + 1/16', '0.5625'], ['0.0111₂', '0.0111₂', '1/4 + 1/8 + 1/16', '0.4375']
    ])], ['Full ascending order: 0.0111₂ < 0.1001₂ < 0.101₂ < 0.11₂.', 'Appending a zero on the right preserves value: 0.11₂ = 0.1100₂ = 0.75.'],
    'A longer fractional digit string is not automatically larger. Compare aligned place values, beginning nearest the point.');

  put('f1-12', 'Detect a repeating remainder, then prove its value',
    'Find the exact binary expansion of decimal 0.2. Parentheses mark a block repeated forever.', [
      step('Begin repeated multiplication', 'The target base is 2. At each row, record the integer part and continue with the fractional remainder.', 'Initial remainder = 0.2'),
      step('Multiplication 1: record 0', 'The product is below 1, so its integer part is 0. Keep 0.4.', '0.2 × 2 = 0.4 = 0 + 0.4'),
      step('Multiplication 2: record 0', 'The product is again below 1. Record 0 and keep 0.8.', '0.4 × 2 = 0.8 = 0 + 0.8'),
      step('Multiplication 3: record 1', 'The product has integer part 1. Remove that 1 and keep 0.6.', '0.8 × 2 = 1.6 = 1 + 0.6'),
      step('Multiplication 4: record 1', 'The integer part is 1. Keeping the fractional remainder returns us to the initial input 0.2.', '0.6 × 2 = 1.2 = 1 + 0.2'),
      step('Recognize the cycle', 'An identical remainder produces an identical next digit and remainder. Because 0.2 has returned, the four digits 0011 repeat without end.', '0.2₁₀ = 0.001100110011…₂ = 0.(0011)₂'),
      step('Give the repeating numeral a name', 'Let x be the exact infinite repeating binary fraction. Shifting the point four places right multiplies by 2⁴ = 16.', 'x = 0.(0011)₂; 16x = 11.(0011)₂'),
      step('Subtract to remove the repeating tail', 'The fractional tails match exactly. Their difference is zero; the integer part 11₂ equals decimal 3.', '16x − x = 11₂ = 3; therefore 15x = 3'),
      step('Solve for the exact value', 'Divide both sides by 15 and reduce. This proves that the repeating choice equals the decimal target.', 'x = 3/15 = 1/5 = 0.2')
    ], [table('The remainder cycle closes after four rows', ['Row', 'Fraction entering row', '× 2 product', 'Record', 'Next remainder'], [
      ['1', '0.2', '0.4', '0', '0.4'], ['2', '0.4', '0.8', '0', '0.8'], ['3', '0.8', '1.6', '1', '0.6'], ['4', '0.6', '1.2', '1', '0.2 — the starting remainder']
    ])], ['The finite numeral 0.0011₂ equals 1/8 + 1/16 = 3/16 = 0.1875, so omitting repetition changes the value.', 'The other repeating options give 0.(01)₂ = 1/3 and 0.(0001)₂ = 1/15, neither of which is 1/5.', 'The reduced denominator 5 is not a power of 2, so decimal 0.2 cannot have a finite exact binary expansion.'],
    'A repeated remainder proves a cycle. Repeating digits must continue forever for the answer to be exact; a finite prefix is an approximation.');

  put('f2-01', 'Use the first octal fractional weight',
    'Given 0.4₈. Find the decimal value.', [
      step('Identify the source base', 'The subscript 8 means octal. Each position to the right divides the preceding weight by 8.'),
      step('Assign the first fractional weight', 'The 4 is immediately after the point, so it has weight 8⁻¹.', '8⁻¹ = 1/8 = 0.125'),
      step('Multiply digit by weight', 'There are four units of one eighth.', '4 × 1/8 = 4/8'),
      step('Reduce the fraction', 'Divide numerator and denominator by 4.', '4/8 = 1/2'),
      step('Express the result in decimal', 'One half is decimal 0.5.', '0.4₈ = 1/2 = 0.5₁₀')
    ], [table('One digit, one weighted contribution', ['Octal digit', 'Weight', 'Exact fraction', 'Decimal'], [['4', '8⁻¹ = 1/8', '4/8 = 1/2', '0.5']])],
    ['Reverse conversion: 0.5 × 8 = 4 with remainder 0, which reproduces the octal digit 4.', 'Decimal 0.4 means 4/10; octal 0.4₈ means 4/8. These fractions are different.'],
    'The digit 4 stays the digit 4, but its place weight is determined by the base.');

  put('f2-02', 'Translate A, then apply hexadecimal place value',
    'Given 0.A₁₆. Find the decimal value.', [
      step('Translate the hexadecimal digit', 'The hexadecimal alphabet continues after 9 with A, B, C, D, E, F. A represents the integer ten.', 'A₁₆ → digit value 10₁₀'),
      step('Locate the digit’s weight', 'A is the first digit after the hexadecimal point. Its weight is 16⁻¹.', '16⁻¹ = 1/16 = 0.0625'),
      step('Multiply value by weight', 'A contributes ten sixteenths, not ten tenths.', '10 × 1/16 = 10/16'),
      step('Reduce the fraction', 'Divide numerator and denominator by 2.', '10/16 = 5/8'),
      step('Convert the fraction to decimal', 'Divide 5 by 8, or multiply 10 by 0.0625.', '5 ÷ 8 = 0.625; therefore 0.A₁₆ = 0.625₁₀')
    ], [table('Hexadecimal letter and place are separate ideas', ['Written digit', 'Decimal digit value', 'Position weight', 'Contribution'], [['A', '10', '1/16', '10/16 = 0.625']])],
    ['Reverse conversion: 0.625 × 16 = 10 with remainder 0. Hexadecimal digit value 10 is A, so the answer converts back to 0.A₁₆.', 'For comparison, 0.1₁₆ = 1/16 = 0.0625. A contributes ten times that amount.'],
    'A is one digit. Do not replace 0.A₁₆ with decimal 0.10 or interpret A as a variable here.');

  put('f2-03', 'Group fractional binary bits in threes',
    'Given 0.101011₂. Convert to octal without changing its value.', [
      step('Choose the group size', 'Octal base 8 equals 2³. Therefore each octal digit represents exactly three binary bits.', '8 = 2³ → three bits per octal digit'),
      step('Start grouping at the point', 'For a fractional part, move rightward from the binary point. There are six bits, so they form two complete groups.', '0.101011₂ → 0.101 011₂'),
      step('Convert the first group', 'Within this three-bit group, use integer weights 4, 2, 1 to identify the octal digit value.', '101₂ = 1 × 4 + 0 × 2 + 1 × 1 = 5'),
      step('Convert the second group', 'Keep the leading zero inside this group so it still has three positions.', '011₂ = 0 × 4 + 1 × 2 + 1 × 1 = 3'),
      step('Place both digits after the octal point', 'The first group gives the first octal fractional digit; the second gives the second. Keep the order.', '0.101 011₂ = 0.53₈'),
      step('Check using weighted fractions', 'The octal digits have actual fractional weights 1/8 and 1/64. Their sum must match the original binary fraction.', '5/8 + 3/64 = 40/64 + 3/64 = 43/64 = 0.671875')
    ], [table('Replace each three-bit group with one octal digit', ['Group position', 'Binary group', 'Digit calculation', 'Octal digit', 'Actual fractional contribution'], [
      ['First after point', '101', '4 + 0 + 1 = 5', '5', '5/8 = 0.625'], ['Second after point', '011', '0 + 2 + 1 = 3', '3', '3/64 = 0.046875']
    ])], ['Original binary value: 1/2 + 0/4 + 1/8 + 0/16 + 1/32 + 1/64 = (32 + 8 + 2 + 1)/64 = 43/64.', 'Expanding octal 5 → 101 and octal 3 → 011 reproduces every original bit.'],
    'Weights 4, 2, 1 identify the digit inside a group. After grouping, the digits still belong to octal fractional positions; the result is 0.53₈, not the integer 53₈.');

  put('f2-04', 'Replace one four-bit group with one hexadecimal digit',
    'Given 0.1101₂. Choose the equal hexadecimal fraction.', [
      step('Choose four-bit grouping', 'Hexadecimal base 16 equals 2⁴, so one hexadecimal digit corresponds to four binary bits.', '16 = 2⁴'),
      step('Keep the group next to the point', 'There are already exactly four fractional bits. No padding is needed.', '0.1101₂ → 0.[1101]₂'),
      step('Find the group’s digit value', 'Use group weights 8, 4, 2, 1. Multiply each bit by its weight.', '1 × 8 + 1 × 4 + 0 × 2 + 1 × 1 = 8 + 4 + 0 + 1 = 13'),
      step('Translate 13 to its hexadecimal symbol', 'The symbols for digit values 10, 11, 12, 13 are A, B, C, D.', '13₁₀ → D₁₆'),
      step('Retain the fractional point', 'Replace the four bits by the single digit D after the point.', '0.1101₂ = 0.D₁₆'),
      step('Check both values in decimal', 'The binary numerator over 16 and the hexadecimal digit over 16 are the same fraction.', '1/2 + 1/4 + 0/8 + 1/16 = 13/16 = 0.8125 = 0.D₁₆')
    ], [table('The four bits determine digit D', ['Bit', 'Group weight', 'Contribution'], [['1', '8', '8'], ['1', '4', '4'], ['0', '2', '0'], ['1', '1', '1']])],
    ['The wrong choices 0.B₁₆ and 0.C₁₆ represent 11/16 and 12/16, which are too small.', 'The choice 0.13₁₆ represents 1/16 + 3/256 = 19/256, not 13/16. Decimal digit value 13 is one hexadecimal digit D.'],
    'The group value is decimal 13, but writing the two hexadecimal digits 13 does not encode the single digit value thirteen. Use D.');

  put('f2-05', 'Expand an octal mixed number by powers of eight',
    'Given 12.34₈. Find its exact decimal value.', [
      step('Assign positions from the point', 'Immediately left of the point is weight 1. Moving left multiplies by 8; moving right divides by 8.', 'Weights under 1, 2, 3, 4: 8¹, 8⁰, 8⁻¹, 8⁻²'),
      step('Evaluate the first integer digit', 'The leftmost 1 occupies the eights position.', '1 × 8¹ = 1 × 8 = 8'),
      step('Evaluate the ones digit', 'The 2 immediately left of the point has weight 1.', '2 × 8⁰ = 2 × 1 = 2; integer total = 8 + 2 = 10'),
      step('Evaluate the first fractional digit', 'The 3 immediately after the point represents three eighths.', '3 × 8⁻¹ = 3/8 = 0.375'),
      step('Evaluate the second fractional digit', 'Moving one more octal position right divides the weight by 8 again.', '4 × 8⁻² = 4/64 = 1/16 = 0.0625'),
      step('Add fractional contributions', 'Add the values of the two fractional positions.', '0.375 + 0.0625 = 0.4375'),
      step('Combine both sides of the point', 'The decimal integer part is 10 and the decimal fractional part is 0.4375.', '10 + 0.4375 = 10.4375₁₀')
    ], [table('Every octal digit and its contribution', ['Digit', 'Power', 'Weight', 'Product'], [['1', '8¹', '8', '8'], ['2', '8⁰', '1', '2'], ['3', '8⁻¹', '1/8', '0.375'], ['4', '8⁻²', '1/64', '0.0625']])],
    ['Using a single denominator: 12.34₈ = (1 × 512 + 2 × 64 + 3 × 8 + 4)/64 = 668/64 = 10.4375.', 'Reverse check: decimal 10 = 12₈; 0.4375 × 8 = 3.5 gives digit 3, then 0.5 × 8 = 4 gives digit 4.'],
    'The second octal fractional position has denominator 8² = 64. It is not denominator 16, and 12₈ is not decimal twelve.');

  put('f2-06', 'Translate F and expand hexadecimal place values',
    'Given 2F.8₁₆. Find the exact decimal value.', [
      step('Translate the hexadecimal letter', 'F is the largest single hexadecimal digit and represents decimal 15.', 'F₁₆ → digit value 15₁₀'),
      step('Assign the three position weights', 'The digit immediately left of the point has weight 1. The 2 to its left has weight 16, and the fractional 8 has weight 1/16.', '2F.8₁₆ = 2 × 16¹ + 15 × 16⁰ + 8 × 16⁻¹'),
      step('Evaluate the sixteens digit', 'Multiply the leftmost digit 2 by 16.', '2 × 16 = 32'),
      step('Evaluate and add the ones digit', 'F contributes 15 ones. Add it to the previous integer contribution.', '15 × 1 = 15; 32 + 15 = 47'),
      step('Evaluate the fractional digit', 'The 8 after the point represents eight sixteenths.', '8/16 = 1/2 = 0.5'),
      step('Add the integer and fractional values', 'The decimal result is the sum of 47 and 0.5.', '47 + 0.5 = 47.5₁₀')
    ], [table('Three weighted terms', ['Hexadecimal digit', 'Digit value', 'Weight', 'Contribution'], [['2', '2', '16', '32'], ['F', '15', '1', '15'], ['8', '8', '1/16', '0.5']])],
    ['Reverse integer conversion: 47 = 2 × 16 + 15, giving 2F₁₆. Reverse fraction conversion: 0.5 × 16 = 8, giving .8₁₆.', 'The total is between 47 and 48, as expected from an integer part 2F₁₆ = 47 and a proper fractional part.'],
    'Hexadecimal digit 8 in the first fractional position means 8/16 = 0.5, not decimal 0.8.');

  put('f2-07', 'Use division for the integer and multiplication for the fraction',
    'Given decimal 26.6875. Convert the complete number to hexadecimal.', [
      step('Split integer and fractional parts', 'Convert 26 and 0.6875 separately, then join them with the point.', '26.6875 = 26 + 0.6875'),
      step('Integer division 1', 'Divide 26 by 16. The quotient is 1 and the remainder is 10. Write remainder 10 as hexadecimal A.', '26 = 1 × 16 + 10 → record A'),
      step('Integer division 2', 'Divide quotient 1 by 16. The quotient is 0 and the remainder is 1. Quotient 0 ends the integer conversion.', '1 = 0 × 16 + 1 → record 1'),
      step('Read integer remainders upward', 'The last remainder is the most significant digit. Read 1, then A.', '26₁₀ = 1A₁₆'),
      step('Fraction multiplication 1', 'Multiply by the target base 16. The product is exactly 11, so record digit value 11 and keep remainder 0.', '0.6875 × 16 = 11.0000 = 11 + 0'),
      step('Translate the fractional digit', 'Hexadecimal digit value 11 is written B. The zero remainder means this fractional conversion is already exact.', '11₁₀ → B₁₆; 0.6875₁₀ = 0.B₁₆'),
      step('Join the parts', 'Write the integer digits 1A, the point, and the fractional digit B.', '26.6875₁₀ = 1A.B₁₆'),
      step('Verify every resulting digit', 'Convert the hexadecimal result back using its three place values.', '1 × 16 + 10 × 1 + 11/16 = 16 + 10 + 0.6875 = 26.6875')
    ], [table('Integer part: read remainders bottom to top', ['Dividend', 'Quotient after ÷ 16', 'Remainder value', 'Hex digit'], [['26', '1', '10', 'A'], ['1', '0', '1', '1']]),
    table('Fractional part: read digits top to bottom', ['Fraction', '× 16 product', 'Integer digit value', 'Hex digit', 'Remainder'], [['0.6875', '11', '11', 'B', '0']])],
    ['The integer check 1 × 16 + 10 = 26 confirms 1A, while the fractional check 11/16 = 0.6875 confirms .B.', 'A and B stand for different digit values: A = 10 and B = 11.'],
    'Do not reverse the fractional digits. Also, the product 11 is decimal eleven and becomes the single hexadecimal digit B, not the two digits 11.');

  put('f2-08', 'Expand one octal fractional digit into three binary places',
    'Given 0.3₈. Choose the binary fraction with exactly the same value.', [
      step('Use the base relationship', 'Because 8 = 2³, each octal digit expands into a group of three binary bits.', 'One octal fractional place ↔ three binary fractional places'),
      step('Convert digit value 3 to binary', 'Within the group use weights 4, 2, 1. Three is zero fours, one two, and one one.', '3 = 0 × 4 + 1 × 2 + 1 × 1 → 011'),
      step('Place the entire group after the point', 'The octal digit is fractional, so all three bits belong after the binary point.', '0.3₈ = 0.011₂'),
      step('Check the original octal value', 'The first octal fractional position has weight 1/8.', '0.3₈ = 3/8 = 0.375'),
      step('Check the binary value', 'The first binary bit is zero, while the second and third are one.', '0.011₂ = 0/2 + 1/4 + 1/8 = 0.25 + 0.125 = 0.375'),
      step('Reject the tempting shortened string', 'Removing the zero immediately after the point shifts every following 1 to a larger place value.', '0.11₂ = 1/2 + 1/4 = 0.75, which is twice the required value')
    ], [table('The zero keeps the fractional positions aligned', ['Binary position', 'Bit', 'Weight', 'Contribution'], [['First', '0', '1/2', '0'], ['Second', '1', '1/4', '0.25'], ['Third', '1', '1/8', '0.125']])],
    ['Grouping backward: binary fractional group 011 has digit value 3, giving 0.3₈.', 'The option 0.0011₂ = 3/16 = 0.1875 is too small, and 0.3₂ is invalid because binary has only digits 0 and 1.'],
    'A zero immediately after a fractional point cannot be removed like a leading zero on an integer. It controls every following digit’s weight.');

  put('f2-09', 'Expand every hexadecimal digit to a complete four-bit group',
    'Given A.BC₁₆. Convert to binary, retaining all four bits for each hexadecimal digit.', [
      step('Choose four bits per digit', 'The target is binary and 16 = 2⁴, so every hexadecimal digit becomes four binary bits. Keep the point in its original boundary.', 'A . B C → [four bits] . [four bits] [four bits]'),
      step('Expand A', 'A means decimal 10. With group weights 8, 4, 2, 1, choose 8 and 2.', '10 = 8 + 0 + 2 + 0 → A = 1010₂'),
      step('Expand B', 'B means decimal 11. Choose 8, 2, and 1.', '11 = 8 + 0 + 2 + 1 → B = 1011₂'),
      step('Expand C', 'C means decimal 12. Choose 8 and 4. The final two zeros must be retained because the question asks for all four bits.', '12 = 8 + 4 + 0 + 0 → C = 1100₂'),
      step('Keep the point and digit order', 'A was before the hexadecimal point; its four bits stay before the binary point. B and C were after it; their groups stay after it.', 'A.BC₁₆ = 1010.1011 1100₂'),
      step('Remove only grouping spaces', 'Do not remove bits. Join the two fractional groups to form eight fractional bits.', 'Required answer: 1010.10111100'),
      step('Check the hexadecimal value', 'Evaluate the original number independently in decimal.', '10 + 11/16 + 12/256 = 10 + 0.6875 + 0.046875 = 10.734375'),
      step('Check the binary value', 'The fractional 1s occupy positions 1, 3, 4, 5, and 6. Add their weights to the integer 10.', '8 + 2 + 1/2 + 1/8 + 1/16 + 1/32 + 1/64 = 10.734375')
    ], [table('One hexadecimal digit becomes one four-bit group', ['Hex digit', 'Digit value', '8, 4, 2, 1 decomposition', 'Four-bit group', 'Side of point'], [
      ['A', '10', '8 + 0 + 2 + 0', '1010', 'Integer'], ['B', '11', '8 + 0 + 2 + 1', '1011', 'Fraction, first group'], ['C', '12', '8 + 4 + 0 + 0', '1100', 'Fraction, second group']
    ])], ['Regroup 1010.10111100₂ as 1010 . 1011 1100. Reading the groups as hexadecimal gives A.BC exactly.', 'Trailing fractional zeros preserve numeric value, but this question explicitly requires retaining all four bits per digit.'],
    'Keep both final zeros in 1100. The mathematically equal shortened fraction does not satisfy this question’s requested four-bit grouping format.');

  put('f2-10', 'Add aligned binary columns, carrying right to left',
    'Add 0.1011₂ and 0.011₂. Find the exact binary sum.', [
      step('Align the binary points', 'The first number has four fractional bits, so append one trailing zero to the second. That zero adds no value.', '0.1011₂ + 0.0110₂'),
      step('Know the carry rule', 'Each binary column stores only 0 or 1. A column total of decimal 2 is binary 10: write 0 in that column and carry 1 to the next column left.', '1 + 1 = 10₂ → write 0, carry 1'),
      step('Column 1: the 1/16 position', 'Start at the far right. There is no incoming carry. Add 1 and 0; write 1 and send no carry.', '1 + 0 + 0 = 1 → result bit 1, carry 0'),
      step('Column 2: the 1/8 position', 'The operand bits are both 1. Their total 2 cannot fit into one binary digit, so write 0 and carry 1 into the 1/4 column.', '1 + 1 + 0 = 2₁₀ = 10₂ → result bit 0, carry 1'),
      step('Column 3: the 1/4 position', 'Include the carry from the previous column. Zero plus one plus that carried one totals 2.', '0 + 1 + 1 = 2₁₀ = 10₂ → result bit 0, carry 1'),
      step('Column 4: the 1/2 position', 'Include the new carry. One plus zero plus the carried one again totals 2. This carry moves across the binary point into the ones column.', '1 + 0 + 1 = 2₁₀ = 10₂ → result bit 0, carry 1'),
      step('Column 5: the ones position', 'Both written integer digits are zero, but the incoming carry is 1. Write 1 before the point.', '0 + 0 + 1 = 1 → integer bit 1, carry 0'),
      step('Assemble the result in normal order', 'The fractional bits were found right to left as 1, 0, 0, 0. Written left to right they are 0001, with integer bit 1.', '0.1011₂ + 0.0110₂ = 1.0001₂'),
      step('Verify with exact fractions', 'The first operand is eleven sixteenths; the second is six sixteenths. Their sum exceeds one by one sixteenth.', '11/16 + 6/16 = 17/16 = 1 + 1/16 = 1.0001₂')
    ], [table('Addition in processing order, from right to left', ['Column weight', 'Top bit', 'Bottom bit', 'Carry in', 'Total', 'Write', 'Carry left'], [
      ['1/16', '1', '0', '0', '1', '1', '0'], ['1/8', '1', '1', '0', '2 = 10₂', '0', '1'], ['1/4', '0', '1', '1', '2 = 10₂', '0', '1'], ['1/2', '1', '0', '1', '2 = 10₂', '0', '1'], ['1 (ones)', '0', '0', '1', '1', '1', '0']
    ])], ['Decimal check: 0.1011₂ = 0.6875 and 0.011₂ = 0.375. Their sum is 1.0625, equal to 1 + 1/16.', 'A carry from the 1/2 column is one whole unit because two halves make one.'],
    'Carry through every affected column, including across the binary point. Align points first; aligning only the last digits changes the addends.');

  put('f2-11', 'Subtract aligned columns, borrowing through a zero',
    'Subtract 0.111₂ from 1.01₂. The required order is 1.01₂ − 0.111₂.', [
      step('Align and pad the fractional parts', 'Append a trailing zero to 1.01₂ to provide an eighths column. This changes its spelling, not its value.', '1.010₂ − 0.111₂'),
      step('Start at the 1/8 column', 'The top bit is 0 and the bottom bit is 1. We need to borrow from a larger place before subtracting.', 'At 1/8: 0 − 1 needs a borrow'),
      step('Borrow one quarter for the eighths column', 'The top 1/4 column has a 1. Change that 1 to 0. One quarter equals two eighths, so the current 1/8 column receives 10₂ units.', '1/4 = 2 × 1/8; top eighths become 10₂ = decimal 2'),
      step('Subtract the eighths column', 'The top now has two eighth-units and the bottom has one. Subtract and write 1 in the eighths position.', '10₂ − 1₂ = 1₂ → write 1 at 1/8'),
      step('Inspect the 1/4 column after that borrow', 'Its original 1 was spent, leaving top 0. The bottom bit is 1, so another borrow is required. The immediately larger 1/2 column is also 0.', 'At 1/4: 0 − 1; at 1/2: top is 0'),
      step('Borrow across the zero from the ones column', 'The top ones bit is 1. Change it to 0 and give two half-units to the 1/2 column. The 1/2 column now temporarily contains 10₂ units.', '1 whole = 2 × 1/2; top ones: 1 → 0; top halves: 0 → 10₂'),
      step('Pass one half down to the quarters column', 'The halves column gives away one of its two half-units, leaving one half-unit. The borrowed half becomes two quarter-units in the current column.', 'Top halves: 10₂ → 1; top quarters: 0 → 10₂'),
      step('Subtract the quarters column', 'Two quarter-units minus one quarter-unit leaves one. Write 1 in the 1/4 position.', '10₂ − 1₂ = 1₂ → write 1 at 1/4'),
      step('Subtract the remaining two columns', 'The top halves bit is now 1, so 1 − 1 = 0 there. The top ones bit is now 0, so 0 − 0 = 0 there.', 'At 1/2: 1 − 1 = 0; at ones: 0 − 0 = 0'),
      step('Read the result and verify it', 'The result bits from ones through eighths are 0 . 0 1 1.', '1.010₂ − 0.111₂ = 0.011₂; 10/8 − 7/8 = 3/8')
    ], [table('Subtraction columns after all necessary borrowing for that column', ['Processing order', 'Weight', 'Top available units', 'Bottom bit', 'Subtraction', 'Result bit'], [
      ['1', '1/8', '2 (borrowed from 1/4)', '1', '2 − 1 = 1', '1'], ['2', '1/4', '2 (borrowed through the 1/2 column)', '1', '2 − 1 = 1', '1'], ['3', '1/2', '1 (left after passing a borrow)', '1', '1 − 1 = 0', '0'], ['4', '1 (ones)', '0 (its 1 was borrowed)', '0', '0 − 0 = 0', '0']
    ])], ['Decimal check: 1.010₂ = 1 + 1/4 = 1.25 and 0.111₂ = 1/2 + 1/4 + 1/8 = 0.875. Their difference is 1.25 − 0.875 = 0.375.', 'Answer check: 0.011₂ = 1/4 + 1/8 = 0.375. Adding the subtrahend back gives 0.011₂ + 0.111₂ = 1.010₂.'],
    'A borrowed 1 from the next column becomes 10₂ units in the current column, not decimal ten. Update every top digit that gives or passes a borrow.');

  put('f2-12', 'Multiply the digit strings, then restore all fractional places',
    'Multiply 0.1₂ by 0.11₂. Find the exact binary product.', [
      step('Count the fractional positions', 'The first factor has one bit after its point. The second has two. The product must allow one plus two fractional positions.', '1 + 2 = 3 fractional positions'),
      step('Temporarily remove the points', 'The first factor becomes the integer string 1 and the second becomes 11. This is a temporary scaling operation, not an equality of the original numbers.', '0.1₂ = 1₂ / 2; 0.11₂ = 11₂ / 4'),
      step('Multiply the rightmost digit', 'Multiply integer string 11 by multiplier bit 1. At the rightmost column, 1 × 1 = 1, so write 1 with no carry.', 'Rightmost product bit: 1 × 1 = 1'),
      step('Multiply the next digit', 'At the next column, the other multiplicand bit is also 1. Again write 1, with no carry. There is only one multiplier bit, so no further partial-product rows are needed.', 'Next product bit: 1 × 1 = 1; integer digit product = 11₂'),
      step('Pad to three fractional places', 'The integer digit product 11 has two bits, but the final product requires three fractional positions. Add one zero to its left before placing the point.', '11₂ → 011₂; restore three places → 0.011₂'),
      step('Check with fractions', 'The temporary point removal scaled the factors by 2 and 4. Therefore divide their integer product 3 by 2 × 4 = 8.', '(1/2) × (3/4) = 3/8 = 0.011₂'),
      step('Select the matching answer', 'The exact product is 0.011₂, equal to decimal 0.375.', '0.1₂ × 0.11₂ = 0.011₂')
    ], [table('Track how the points change the scale', ['Quantity', 'Integer digits', 'Fractional bits', 'Actual value'], [['First factor', '1₂ = 1', '1', '1/2'], ['Second factor', '11₂ = 3', '2', '3/4'], ['Product', '11₂ = 3', '1 + 2 = 3', '3/8 = 0.011₂']]),
    table('Single partial-product row', ['Multiplier bit', 'Multiplicand', 'Bit products from right to left', 'Partial product'], [['1', '11₂', '1 × 1 = 1; 1 × 1 = 1', '11₂']])],
    ['Decimal check: 0.1₂ = 0.5 and 0.11₂ = 0.75. The product 0.5 × 0.75 = 0.375 agrees with 0.011₂.', 'Multiplying by 0.1₂ means multiplying by one half. Moving the point in 0.11₂ one position left gives 0.011₂ directly.'],
    'Count all fractional bits from both factors, including the leading zero needed in the final product. Placing the point as 0.11₂ would give 0.75, twice the correct product.');
})();
