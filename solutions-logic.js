/* Independently authored, fully worked solutions. Original questions and keys are preserved. */
(() => {
  'use strict';
  const bank = window.QUESTION_BANK;
  if (!Array.isArray(bank)) throw new Error('Load questions.js before solutions-logic.js.');
  const S = (title, explanation, math) => ({ title, explanation, ...(math ? { math } : {}) });
  const T = (caption, headers, rows) => ({ caption, headers, rows: rows.map(row => row.map(String)) });
  const all = n => Array.from({ length: 2 ** n }, (_, i) => i.toString(2).padStart(n, '0').split('').map(Number));
  const bit = value => Number(Boolean(value));
  const xor = (a, b) => a ^ b;
  const written = [];
  function put(id, method, given, steps, tables, check, pitfall) {
    const q = bank.find(item => item.id === id);
    if (!q) throw new Error(`Missing question ${id}`);
    q.worked = { method, given, steps, tables, check, pitfall };
    written.push(id);
  }
  function truth(caption, names, headers, evaluate) {
    return T(caption, [...names, ...headers], all(names.length).map(inputs => [...inputs, ...evaluate(...inputs)]));
  }
  function weights(word, label = 'Bit-by-bit place-value check') {
    return T(label, ['Position from left', 'Bit', 'Weight', 'Contribution'], [...word].map((b, i) => {
      const weight = 2 ** (word.length - i - 1);
      return [i + 1, b, weight, `${b} × ${weight} = ${Number(b) * weight}`];
    }));
  }
  const AND_TABLE = truth('Check every AND input pair', ['A', 'B'], ['A AND B'], (a, b) => [a & b]);
  put('lg-01', 'Test all four input pairs', 'A and B are single bits; F = A AND B.', [
    S('Translate AND', 'Both requirements must be met. One false input is enough to make the combined requirement false.'),
    S('Try A = 0, B = 0', 'Neither input is 1, so the output is 0.', '0 AND 0 = 0'),
    S('Try A = 0, B = 1', 'B is true, but A is false. The output stays 0.', '0 AND 1 = 0'),
    S('Try A = 1, B = 0', 'A is true, but B is false. The output is again 0.', '1 AND 0 = 0'),
    S('Try A = 1, B = 1', 'Both inputs are finally true. This is the only row with output 1.', '1 AND 1 = 1'),
    S('Choose the matching statement', 'The correct condition is “Only when both inputs are 1.” “At least one” describes OR; “inputs differ” describes XOR; “both 0” describes NOR.')
  ], [AND_TABLE], ['The output column in row order 00, 01, 10, 11 is 0001; only the final row has output 1.'], 'AND does not mean that any one input may be true; it requires every input to be true.');
  put('lg-02', 'Apply the OR and XOR rules to the same inputs', 'A = 1, B = 1; the answer order is OR first, XOR second.', [
    S('Keep the requested order', 'We need a pair (OR output, XOR output), not two bits from one gate.'),
    S('Evaluate inclusive OR', 'At least one input is 1. Here both are 1, which also satisfies OR.', '1 OR 1 = 1'),
    S('Evaluate exclusive OR', 'XOR needs exactly one input to be 1. Two 1s are an equal pair, so XOR gives 0.', '1 XOR 1 = 0'),
    S('Assemble the pair', 'Place the OR result first and the XOR result second.', '(OR, XOR) = (1, 0)'),
    S('Reject the other choices', 'Every choice with OR = 0 fails because the input contains a 1. The pair (1, 1) fails because XOR excludes the both-true case.')
  ], [truth('OR and XOR agree on unequal inputs, but differ for 11', ['A', 'B'], ['OR', 'XOR'], (a, b) => [a | b, a ^ b])], ['For inputs 11, the OR column is 1 and the XOR column is 0.'], 'Do not treat “OR” and “exclusive OR” as the same gate.');
  put('lg-03', 'Evaluate AND, then invert its output', 'A = 1, B = 0; NAND = NOT(A AND B).', [
    S('Expand the gate name', 'NAND contains one AND operation followed by a NOT applied to that AND output.', 'F = NOT(A AND B)'),
    S('Substitute the inputs', 'Put 1 in place of A and 0 in place of B.', 'F = NOT(1 AND 0)'),
    S('Evaluate the inner gate', 'AND needs both inputs to be 1; B is 0.', '1 AND 0 = 0'),
    S('Invert the intermediate result', 'NOT swaps 0 and 1.', 'F = NOT 0 = 1'),
    S('State the single-bit result', 'The answer is 1. It is neither the two-bit input string 10 nor an undetermined value.')
  ], [truth('The inverter changes each AND result into its NAND complement', ['A', 'B'], ['AND', 'NOT(AND) = NAND'], (a, b) => [a & b, 1 - (a & b)])], ['The row A = 1, B = 0 gives AND = 0 and NAND = 1. NAND is 0 only for 11.'], 'Invert the result of AND once; do not invent a separate inversion of each input followed by AND.');
  put('lg-04', 'Complement the one input bit', 'A NOT gate has input 0.', [
    S('Identify the operation', 'NOT is a one-input gate. Its output is the opposite logical value.'),
    S('List the possible bit values', 'The available logical values are 0 and 1; the complement of either one is the other.'),
    S('Apply NOT to this input', 'The given input is 0, so change it to 1.', 'NOT 0 = 1'),
    S('Write the requested output', 'Enter the single digit 1.'),
    S('Check by applying NOT again', 'A second inversion would return the original 0.', 'NOT(NOT 0) = NOT 1 = 0')
  ], [T('Complete NOT truth table', ['Input A', 'Output NOT A'], [[0, 1], [1, 0]])], ['Input 0 corresponds to output 1 in the NOT table.'], 'The input and the output are separate bits; do not concatenate them as 01.');
  put('lg-05', 'Evaluate XOR in the stated row order', 'Rows AB = 00, 01, 10, 11; write one output per row.', [
    S('Use the XOR rule', 'Equal bits give 0. Unequal bits give 1.'),
    S('Row 00', 'The two inputs are equal.', '0 XOR 0 = 0'),
    S('Row 01', 'The two inputs differ.', '0 XOR 1 = 1'),
    S('Row 10', 'The two inputs differ.', '1 XOR 0 = 1'),
    S('Row 11', 'The two inputs are equal.', '1 XOR 1 = 0'),
    S('Read down, without changing row order', 'Join the four output bits from top to bottom.', '0, 1, 1, 0 → 0110'),
    S('Compare the distractors', '0001 is AND; 0111 is OR; 1001 is XNOR. Only 0110 is XOR for this row order.')
  ], [truth('XOR outputs in the requested order', ['A', 'B'], ['Equal or different?', 'XOR'], (a, b) => [a === b ? 'Equal' : 'Different', a ^ b])], ['There are exactly two unequal input pairs, 01 and 10, so exactly those two output positions are 1.'], 'A truth-table output string is meaningful only with its row order.');
  put('lg-06', 'Evaluate the two branches before the final OR', 'F = (A AND B) OR (NOT C), with A = 1, B = 0, C = 0.', [
    S('Name the branch outputs', 'Let X be the AND output and Y be the NOT output. The final gate computes X OR Y.', 'X = A AND B; Y = NOT C; F = X OR Y'),
    S('Substitute the inputs', 'Replace every variable, while keeping the original parentheses.', 'F = (1 AND 0) OR (NOT 0)'),
    S('Find branch X', 'AND is 0 because its second input is 0.', 'X = 1 AND 0 = 0'),
    S('Find branch Y', 'Complementing C = 0 produces 1.', 'Y = NOT 0 = 1'),
    S('Feed both branch outputs into OR', 'At least one branch is 1, so the final result is 1.', 'F = 0 OR 1 = 1'),
    S('Trace the completed circuit', 'Inputs 1 and 0 give X = 0; input C = 0 gives Y = 1; the OR gate therefore receives 0 and 1.')
  ], [T('Every intermediate signal for the supplied inputs', ['A', 'B', 'C', 'X = A AND B', 'Y = NOT C', 'F = X OR Y'], [[1, 0, 0, 0, 1, 1]])], ['Since NOT C = 1, the final OR must be 1 regardless of the AND branch. This agrees with the full substitution.'], 'NOT applies to C only; it does not complement the whole OR expression.');
  put('lg-07', 'Track the two consecutive inversions', 'A NAND output is connected to a NOT input.', [
    S('Write the first gate output', 'The NAND first ANDs A and B, then complements that result.', 'X = (A·B)′'),
    S('Write the second gate output', 'The NOT gate complements X.', 'F = X′ = ((A·B)′)′'),
    S('Cancel the two NOT operations', 'For either bit value, complementing twice restores the original bit.', '(Y′)′ = Y, with Y = A·B'),
    S('Read the remaining function', 'Only A·B remains, so the equivalent single gate is AND.', 'F = A·B'),
    S('Verify every input case', 'The table follows AND → NAND → final NOT for 00, 01, 10, and 11. The last column is 0001, exactly the AND column.')
  ], [truth('Follow all three signal columns', ['A', 'B'], ['A AND B', 'NAND output', 'NOT(NAND)'], (a, b) => [a & b, 1 - (a & b), a & b])], ['The circuit output equals A AND B in all four rows, not merely for a sample input.'], 'Two consecutive output inversions cancel; an OR function cannot be obtained by simply deleting the AND operation.');
  put('lg-08', 'Apply the equality test separately to all four positions', 'Input words 1010 and 1100; XNOR returns 1 when a bit pair is equal.', [
    S('Align the two four-bit words', 'Compare corresponding positions, starting at the left. No carries or borrows are involved.', '1010\n1100'),
    S('Leftmost position', 'The pair is 1 and 1. Equal bits give XNOR = 1.', '1 XNOR 1 = 1'),
    S('Second position', 'The pair is 0 and 1. Different bits give XNOR = 0.', '0 XNOR 1 = 0'),
    S('Third position', 'The pair is 1 and 0. Different bits again give 0.', '1 XNOR 0 = 0'),
    S('Rightmost position', 'The pair is 0 and 0. Equal bits give 1.', '0 XNOR 0 = 1'),
    S('Join the outputs in the same order', 'Read the four results left to right.', '1, 0, 0, 1 → 1001'),
    S('Check by complementing XOR', 'XOR gives 0110 for these inputs. Complementing each bit of 0110 gives 1001.')
  ], [T('One equality test for each corresponding bit pair', ['Position from left', 'First word', 'Second word', 'XOR', 'XNOR'], [...'1010'].map((a, i) => [i + 1, a, '1100'[i], Number(a) ^ Number('1100'[i]), 1 - (Number(a) ^ Number('1100'[i]))]))], ['Only the first and last bit pairs match, so only the first and last XNOR outputs are 1.'], 'This is a bitwise equality test, not a test that returns one output for the entire two words.');
  put('lg-09', 'Build the truth table with both intermediate branches', 'F = (A OR B) AND (NOT A); row order AB = 00, 01, 10, 11.', [
    S('Choose intermediate columns', 'Compute X = A OR B and Y = NOT A before computing F = X AND Y.'),
    S('Evaluate row 00', 'The OR branch gives 0; NOT A gives 1; their AND is 0.', '(0 OR 0) AND (NOT 0) = 0 AND 1 = 0'),
    S('Evaluate row 01', 'The OR branch gives 1; NOT A gives 1; their AND is 1.', '(0 OR 1) AND (NOT 0) = 1 AND 1 = 1'),
    S('Evaluate row 10', 'The OR branch gives 1; NOT A gives 0; their AND is 0.', '(1 OR 0) AND (NOT 1) = 1 AND 0 = 0'),
    S('Evaluate row 11', 'The OR branch gives 1; NOT A gives 0; their AND is 0.', '(1 OR 1) AND (NOT 1) = 1 AND 0 = 0'),
    S('Read the final column', 'Keep the exact requested row order.', 'F = 0, 1, 0, 0 → 0100'),
    S('Check with algebra', 'Distribute AND, then use AA′ = 0 and 0 + X = X.', '(A + B)A′ = AA′ + BA′ = 0 + A′B = A′B')
  ], [truth('Both branch values and the final AND for every row', ['A', 'B'], ['X = A OR B', 'Y = NOT A', 'F = X AND Y', 'Check: A′B'], (a, b) => [a | b, 1 - a, (a | b) & (1 - a), (1 - a) & b])], ['A′B is true only for A = 0 and B = 1, which is the second output bit in the stated ordering.'], 'When A = 1, NOT A = 0 forces the final AND to 0 even if the OR branch is 1.');
  put('lg-10', 'Calculate the sum bit and carry bit separately', 'A = 1, B = 1; S = A XOR B; C = A AND B; requested tuple is (S, C).', [
    S('Find the sum bit', 'The XOR inputs are equal, so the sum output is 0.', 'S = 1 XOR 1 = 0'),
    S('Find the carry bit', 'Both inputs are 1, so the AND output is 1.', 'C = 1 AND 1 = 1'),
    S('Respect the requested tuple order', 'The question asks for sum first and carry second.', '(S, C) = (0, 1)'),
    S('Reconstruct the ordinary binary result', 'A carry has weight 2 and the sum bit has weight 1.', '2C + S = 2(1) + 0 = 2'),
    S('Compare with the original addition', 'One plus one equals two. As a binary numeral, write carry before sum.', '1₂ + 1₂ = 10₂ = CS')
  ], [truth('Complete half-adder table and arithmetic check', ['A', 'B'], ['S = A XOR B', 'C = A AND B', '2C + S', 'A + B (ordinary sum)'], (a, b) => [a ^ b, a & b, 2 * (a & b) + (a ^ b), a + b])], ['The tuple (S, C) = (0, 1) produces the numeral CS = 10₂, equal to decimal 2.'], 'The tuple order S, C differs from the numeral order C then S; (1, 0) would reverse the requested outputs.');
  put('lg-11', 'Tie both NAND inputs to the same signal', 'Use one two-input NAND gate to obtain NOT A.', [
    S('Recall NAND', 'For input signals X and Y, the output is NOT(X AND Y).', 'F = (XY)′'),
    S('Connect A to both inputs', 'Set X = A and Y = A, so the gate first computes A AND A.', 'F = (AA)′'),
    S('Simplify the repeated input', 'When A is 0, 0 AND 0 = 0. When A is 1, 1 AND 1 = 1. Therefore AA = A.', 'F = A′'),
    S('Verify A = 0', 'Both NAND inputs are 0; AND gives 0; the output inverter gives 1.', 'NAND(0, 0) = NOT 0 = 1'),
    S('Verify A = 1', 'Both NAND inputs are 1; AND gives 1; the output inverter gives 0.', 'NAND(1, 1) = NOT 1 = 0'),
    S('Check the offered alternatives', 'Using a fixed 0 on either input makes the inner AND 0 for every A, so the NAND output is always 1. Leaving an input unconnected does not supply a dependable logical value.')
  ], [T('Tied-input NAND implements the entire NOT truth table', ['A', 'NAND input 1', 'NAND input 2', 'Inner AND', 'NAND output', 'Desired NOT A'], [[0, 0, 0, 0, 1, 1], [1, 1, 1, 1, 0, 0]])], ['The output is 1 for A = 0 and 0 for A = 1, so it equals NOT A for every possible input.'], 'Tie both inputs to A; do not leave a gate input floating.');
  put('lg-12', 'Evaluate the AND branches and final OR for all eight rows', 'F = AB + A′C; row order ABC = 000, 001, 010, 011, 100, 101, 110, 111.', [
    S('Set up three intermediate signals', 'Use N = NOT A, X = A AND B, Y = N AND C. The final output is X OR Y.'),
    ...all(3).map(([a, b, c]) => S(`Row ${a}${b}${c}`, `NOT A = ${1 - a}; AB = ${a & b}; A′C = ${(1 - a) & c}. The final OR combines the two AND outputs.`, `(${a} AND ${b}) OR ((NOT ${a}) AND ${c}) = ${a & b} OR ${(1 - a) & c} = ${(a & b) | ((1 - a) & c)}`)),
    S('Read all eight final outputs', 'Keep all eight rows in the supplied order, including each zero.', '0, 1, 0, 1, 0, 0, 1, 1 → 01010011'),
    S('Verify the selection behavior', 'When A = 0, AB = 0 and A′C = C, so F follows C. When A = 1, A′C = 0 and AB = B, so F follows B.')
  ], [truth('Full three-input table with both AND branches', ['A', 'B', 'C'], ['NOT A', 'AB', 'A′C', 'F = AB OR A′C'], (a, b, c) => [1 - a, a & b, (1 - a) & c, (a & b) | ((1 - a) & c)])], ['Rows A = 0 produce 0101 by following C. Rows A = 1 produce 0011 by following B. Joining them gives 01010011.'], 'A changes slowest and C changes fastest in this stated row order; reordering rows would change the output string.');

  put('bc-01', 'Encode each decimal digit in its own 8421 group', 'Decimal number 59; its decimal digits, in order, are 5 and 9.', [
    S('Separate the decimal digits', 'BCD preserves decimal digit boundaries. We must encode 5, then encode 9; we do not convert 59 as one ordinary binary integer.', '59 → digits 5 | 9'),
    S('Set the four weights for digit 5', 'A group uses weights 8, 4, 2, 1. Since 5 = 4 + 1, select the 4 and 1 positions.', '5 = 0×8 + 1×4 + 0×2 + 1×1 → 0101'),
    S('Set the four weights for digit 9', 'Since 9 = 8 + 1, select the 8 and 1 positions.', '9 = 1×8 + 0×4 + 0×2 + 1×1 → 1001'),
    S('Keep each complete four-bit group', 'Retain the zero at the start of 0101. It keeps digit 5 in a four-bit BCD group.'),
    S('Put the encoded digits back in order', 'The tens digit 5 comes first; the ones digit 9 comes second.', '59 in BCD = 0101 1001'),
    S('Decode to check', 'Read 0101 as decimal digit 5 and 1001 as decimal digit 9, then concatenate the decimal digits.', '0101 | 1001 → 5 | 9 → 59')
  ], [T('Complete contribution of every BCD bit', ['Decimal digit', '8 bit', '4 bit', '2 bit', '1 bit', 'Weighted sum', 'Four-bit group'], [['5', '0×8 = 0', '1×4 = 4', '0×2 = 0', '1×1 = 1', '0+4+0+1 = 5', '0101'], ['9', '1×8 = 8', '0×4 = 0', '0×2 = 0', '1×1 = 1', '8+0+0+1 = 9', '1001']])], ['Both groups represent valid decimal digits, and decoding them in order returns 59.', 'Ordinary binary 111011₂ = 32+16+8+2+1 = 59 is correct in a different code; it is not the requested BCD.'], 'Do not interpret the entire BCD word 01011001 as one ordinary positional binary integer.');
  put('bc-02', 'Decode each candidate and apply the single-digit limit', 'One standard BCD group must represent one decimal digit 0 through 9.', [
    S('Establish the valid range', 'A single decimal digit cannot be 10, 11, 12, 13, 14, or 15. Those values need more than one decimal digit.', 'Valid single-digit BCD values: 0 ≤ value ≤ 9'),
    S('Test 1001', 'Its weighted value is 9, so this is the valid BCD encoding of decimal digit 9.', '1×8 + 0×4 + 0×2 + 1×1 = 8 + 1 = 9'),
    S('Test 0101', 'Its weighted value is 5, which is a permitted decimal digit.', '0×8 + 1×4 + 0×2 + 1×1 = 4 + 1 = 5'),
    S('Test 0000', 'All contributions are zero. Decimal digit 0 is valid.', '0×8 + 0×4 + 0×2 + 0×1 = 0'),
    S('Test 1010', 'Its weighted value is 10. Ten is not one decimal digit, so this candidate is invalid as one BCD digit.', '1×8 + 0×4 + 1×2 + 0×1 = 8 + 2 = 10'),
    S('Select the invalid group', 'Only 1010 lies outside the one-digit range. To write decimal 10 in BCD, use two groups: 0001 0000.')
  ], [T('Check all four offered groups', ['Group', '8 contribution', '4 contribution', '2 contribution', '1 contribution', 'Value', 'Valid BCD digit?'], [['1001', 8, 0, 0, 1, 9, 'Yes'], ['0101', 0, 4, 0, 1, 5, 'Yes'], ['0000', 0, 0, 0, 0, 0, 'Yes'], ['1010', 8, 0, 2, 0, 10, 'No']])], ['1010 is a valid ordinary binary number with value 10, but standard BCD leaves it unused as an individual decimal digit.'], '“Invalid BCD” does not mean “invalid binary.” The restriction belongs to this code.');
  put('bc-03', 'Keep ordinary binary and digitwise BCD separate', 'Represent decimal 12 first in ordinary binary, then in 8421 BCD.', [
    S('Convert the whole value for ordinary binary', 'Use powers 8, 4, 2, 1. Twelve contains 8 and 4, with no remainder.', '12 = 8 + 4 + 0 + 0 → 1100₂'),
    S('Split 12 for BCD', 'The decimal digits are 1 and 2. Each receives its own four-bit group.', '12 → 1 | 2'),
    S('Encode digit 1', 'Only the weight-1 bit is set.', '1 = 0×8 + 0×4 + 0×2 + 1×1 → 0001'),
    S('Encode digit 2', 'Only the weight-2 bit is set.', '2 = 0×8 + 0×4 + 1×2 + 0×1 → 0010'),
    S('Write the requested pair', 'Put ordinary binary first and BCD second.', '1100; 0001 0010'),
    S('Check the two meanings', 'Ordinary binary 1100 has value 12. In BCD, 0001 and 0010 decode as decimal digits 1 and 2. The single group 1100 cannot be a BCD digit because its value 12 exceeds 9.')
  ], [weights('1100', 'Ordinary binary: one weighted value for 12'), T('BCD: one four-bit group per decimal digit', ['Digit', '8 bit', '4 bit', '2 bit', '1 bit', 'Group'], [[1, 0, 0, 0, 1, '0001'], [2, 0, 0, 1, 0, '0010']])], ['Binary check: 8+4 = 12. BCD check: digit 1 followed by digit 2 forms decimal 12.'], 'A four-bit binary value can reach 15, but one standard BCD digit can reach only 9.');
  put('bc-04', 'Derive the four weights from powers of two', 'One standard BCD digit is a four-bit natural-binary group.', [
    S('Start at the rightmost bit', 'The rightmost bit has exponent 0.', '2⁰ = 1'),
    S('Move left one place', 'Each move left doubles the weight.', '2¹ = 2'),
    S('Move left again', 'Double 2 to obtain the next weight.', '2² = 4'),
    S('Reach the leftmost of four bits', 'Double 4 to obtain the highest weight in this group.', '2³ = 8'),
    S('Read in the direction the question asks', 'The question asks left to right, so reverse the order in which we built the weights.', '8, 4, 2, 1'),
    S('Apply the weights to a real BCD digit', 'For example, digit 9 uses the leftmost and rightmost weights.', '1001 → 1×8 + 0×4 + 0×2 + 1×1 = 9')
  ], [T('The full four-bit weight map', ['Position from left', 'Exponent', 'Weight', 'Contribution in 1001'], [[1, '2³', 8, '1×8 = 8'], [2, '2²', 4, '0×4 = 0'], [3, '2¹', 2, '0×2 = 0'], [4, '2⁰', 1, '1×1 = 1']])], ['The weights themselves spell the name 8421. Their direction is left to right.'], 'The rightmost weight is 1, not 0. A zero bit contributes 0 because the bit is 0, not because its position has zero weight.');
  put('bc-05', 'Add the Excess-3 bias, then encode the result', 'Decimal digit d = 7; Excess-3 stores d + 3 in four ordinary binary bits.', [
    S('Apply the code rule', 'Add the bias before converting to binary.', 'Stored value = 7 + 3 = 10'),
    S('Choose the 8 bit', 'Ten contains one 8; subtract it and keep remainder 2.', '10 − 8 = 2 → first bit 1'),
    S('Choose the 4 bit', 'The remaining 2 is smaller than 4, so this bit is 0.', '2 < 4 → second bit 0; remainder 2'),
    S('Choose the 2 bit', 'The remaining 2 contains one 2.', '2 − 2 = 0 → third bit 1'),
    S('Choose the 1 bit', 'No value remains, so the last bit is 0.', '0 < 1 → fourth bit 0'),
    S('Join the four bits', 'Read the selected bits in weights 8, 4, 2, 1 order.', '7 in Excess-3 = 1010'),
    S('Decode as an independent check', 'The stored group has ordinary binary value 10. Subtract the Excess-3 bias to recover the original digit.', '1010₂ = 8 + 2 = 10; 10 − 3 = 7')
  ], [weights('1010', 'Weighted value of the biased four-bit group')], ['The group 1010 decodes to 10−3 = 7 in Excess-3.', 'Plain BCD for 7 would be 0111; the requested code is Excess-3.'], 'Do not reject 1010 using the BCD validity rule; Excess-3 uses a different mapping.');
  put('bc-06', 'Read the stored binary value, then subtract three', 'The Excess-3 group is 0110.', [
    S('Write the ordinary binary weights', 'Use 8, 4, 2, 1 under the four supplied bits.', 'Bits: 0 1 1 0; weights: 8 4 2 1'),
    S('Evaluate every contribution', 'The two middle bits are set; the outer bits are not.', '0×8 + 1×4 + 1×2 + 0×1 = 0 + 4 + 2 + 0'),
    S('Add the contributions', 'This is the stored biased value, not yet the represented digit.', '0 + 4 + 2 + 0 = 6'),
    S('Remove the Excess-3 bias', 'Encoding added 3, so decoding must subtract 3.', 'Digit = 6 − 3 = 3'),
    S('Check that the decoded digit is valid', 'Three lies in the decimal digit range 0 through 9.'),
    S('Re-encode the result', 'Adding the bias back gives 6, whose four-bit encoding is the original group.', '3 + 3 = 6 = 0110₂')
  ], [weights('0110', 'Decode every supplied bit before removing the bias')], ['Re-encoding digit 3 in Excess-3 produces 0110, exactly the input.'], 'Returning 6 would report the biased storage value rather than the decimal digit.');
  function paritySolution(id, word, kind) {
    let total = 0;
    const rows = [...word].map((b, i) => { total += Number(b); return [i + 1, b, total]; });
    const target = kind === 'odd' ? 1 : 0;
    const p = (total % 2) ^ target;
    put(id, 'Count data 1s and include the appended parity bit', `Data = ${word}; required total parity is ${kind}.`, [
      S('Read all seven data bits', 'Only bits equal to 1 increase the count. The table keeps a running total so no position is skipped.', [...word].join(' + ') + ` = ${total}`),
      S('Classify the data count', `${total} is ${total % 2 ? 'odd' : 'even'}. The required count for the entire protected word is ${kind}.`, `${total} mod 2 = ${total % 2}`),
      S('Try appending parity bit 0', 'Appending 0 leaves the number of 1s unchanged.', `${total} + 0 = ${total} (${total % 2 ? 'odd' : 'even'})`),
      S('Try appending parity bit 1', 'Appending 1 increases the count by one.', `${total} + 1 = ${total + 1} (${(total + 1) % 2 ? 'odd' : 'even'})`),
      S('Select the bit that meets the requirement', `Parity bit ${p} makes the total count ${total + p}, which is ${kind}.`, `p = ${p}`),
      S('Write the protected word', 'The question says append, so place the parity bit at the right end.', `${word} | ${p} → ${word}${p}`),
      S('Check the entire word', 'Count the data bits and parity bit together; do not check the data alone.', `${total} data 1s + ${p} parity 1s = ${total + p} total 1s`)
    ], [T('Count every data-bit position', ['Position from left', 'Data bit', 'Running count of 1s'], rows), T('Compare both possible parity bits', ['Candidate p', 'Total number of 1s', 'Total parity', 'Meets requirement?'], [0, 1].map(candidate => [candidate, total + candidate, (total + candidate) % 2 ? 'Odd' : 'Even', candidate === p ? 'Yes' : 'No']))], [`The complete word ${word}${p} contains ${total + p} ones, satisfying ${kind} parity.`], `${kind[0].toUpperCase() + kind.slice(1)} parity describes the total count, not a fixed value for the parity bit.`);
  }
  paritySolution('bc-07', '1011001', 'odd');
  paritySolution('bc-08', '1011011', 'even');
  put('bc-09', 'Add the binary groups, then perform BCD correction', 'BCD digits 8 = 1000 and 7 = 0111. The decimal sum must be 15.', [
    S('Start with valid input groups', 'Digit 8 sets the 8 bit; digit 7 sets the 4, 2, and 1 bits.', '8 → 1000; 7 → 0111'),
    S('Add the ones column', 'The rightmost bits are 0 and 1. There is no incoming carry.', '0 + 1 + 0 = 1 → write 1, carry 0'),
    S('Add the twos and fours columns', 'Both columns contain 0 + 1 with no incoming carry, so each produces 1 with carry 0.', 'Twos: 0+1+0 = 1; fours: 0+1+0 = 1'),
    S('Add the eights column', 'The bits are 1 and 0 with no carry, giving 1.', '1 + 0 + 0 = 1 → raw sum 1111'),
    S('Decide whether correction is required', '1111 has value 15, exceeding the largest single BCD digit 1001 = 9. We must add the correction 0110.', '1111 > 1001; correction = 0110'),
    S('Correct the ones and twos columns', 'In 1111 + 0110, the ones column gives 1 with carry 0. The twos column totals 2, so write 0 and carry 1.', 'Ones: 1+0+0 = 1; twos: 1+1+0 = 2 = 10₂'),
    S('Correct the fours column', 'Include the incoming carry from the twos column. A total of 3 is 11₂: write its low bit 1 and carry 1.', '1 + 1 + 1 = 3 = 11₂'),
    S('Correct the eights column', 'A total of 2 produces low bit 0 and a new carry of 1 into the next decimal digit.', '1 + 0 + 1 = 2 = 10₂'),
    S('Form the two decimal digit groups', 'The outgoing carry becomes decimal tens digit 1 → 0001. The corrected low four bits are 0101 → decimal ones digit 5.', '1111 + 0110 = 1 0101 → BCD 0001 0101'),
    S('Check by decoding', 'Decode the result as digit 1 followed by digit 5, rather than as a single ordinary binary integer.', '0001 | 0101 → 1 | 5 → 15 = 8 + 7')
  ], [T('Initial binary addition, from right to left', ['Column weight', 'Bit of 1000', 'Bit of 0111', 'Carry in', 'Column total', 'Written bit', 'Carry out'], [[1, 0, 1, 0, 1, 1, 0], [2, 0, 1, 0, 1, 1, 0], [4, 0, 1, 0, 1, 1, 0], [8, 1, 0, 0, 1, 1, 0]]), T('Correction addition 1111 + 0110, from right to left', ['Column weight', 'Raw bit', 'Correction bit', 'Carry in', 'Column total', 'Written bit', 'Carry out'], [[1, 1, 0, 0, 1, 1, 0], [2, 1, 1, 0, 2, 0, 1], [4, 1, 1, 1, 3, 1, 1], [8, 1, 0, 1, 2, 0, 1], [16, 0, 0, 1, 1, 1, 0]])], ['The two output groups have valid BCD values 1 and 5, giving decimal 15.', 'In ordinary binary, the corrected bit string 10101₂ equals 21. That intermediate binary value reflects adding 6; the final two-group BCD interpretation is decimal 15.'], 'Do not leave the invalid low group 1111 in the answer. The correction adjusts the encoding to valid decimal digit groups.');
  put('bc-10', 'Place the supplied character-code value into eight binary positions', 'The question supplies ASCII A = decimal 65; output must contain eight bits.', [
    S('Use the supplied numeric code', 'The symbol A maps to number 65 in this question. Now represent that number in binary.'),
    S('Test the 128 position', '65 is below 128, so the leading bit is 0 and the remainder is still 65.', '65 < 128 → bit 0'),
    S('Test the 64 position', '65 contains one 64. Set this bit to 1 and subtract 64.', '65 − 64 = 1 → bit 1'),
    S('Test the 32, 16, 8, 4, and 2 positions', 'The remainder is only 1, smaller than each of these five weights. Each corresponding bit is 0.', '1 < 32, 16, 8, 4, 2 → bits 0 0 0 0 0'),
    S('Test the 1 position', 'Use the last remaining unit.', '1 − 1 = 0 → bit 1'),
    S('Read all eight positions', 'Keep the leading zero because an eight-bit byte is requested.', '128 64 32 16 8 4 2 1 → 0 1 0 0 0 0 0 1 → 01000001'),
    S('Add back the weights to check', 'Only the 64 and 1 positions contribute.', '0×128 + 1×64 + 0×32 + 0×16 + 0×8 + 0×4 + 0×2 + 1×1 = 65')
  ], [weights('01000001', 'Every bit of the requested byte')], ['01000001₂ = 64+1 = 65, matching the supplied ASCII code.', 'Seven-bit ASCII 1000001 gains one leading zero to make the requested eight-bit representation.'], 'The leading 0 is part of the requested byte width; do not drop it.');
  put('bc-11', 'Track how each bit flip toggles total parity', 'One parity bit protects the whole word; flipped bits may include the parity bit.', [
    S('Start with a valid even-parity example', 'Use protected word 1010, containing two 1s. A receiver expecting even parity accepts it.'),
    S('Flip one position', 'Changing the first bit gives 0010 with one 1. Its parity changed from even to odd, so the check fails.', '1010 → 0010; count 2 → 1'),
    S('Flip two distinct positions', 'Changing the first two bits gives 0110 with two 1s. It differs from the original word, but parity remains even, so parity alone misses this error.', '1010 → 0110; count 2 → 2'),
    S('Flip three distinct positions', 'Changing the first three bits gives 0100 with one 1. An odd number of flips changes parity, so the check fails.', '1010 → 0100; count 2 → 1'),
    S('Generalize the pattern', 'Every changed bit toggles the parity once. An odd number of toggles reverses it; an even number restores it.', 'Received parity = expected parity XOR (number of flipped positions mod 2)'),
    S('Choose the correct capability', 'Every odd number of flipped positions is detected. An even number can leave the parity unchanged and go undetected.'),
    S('Separate detection from correction', 'A failed parity check does not tell which position changed. For example, both 0010 and 1110 violate the original even parity, but their different error locations cannot be identified from parity alone.')
  ], [T('Concrete examples with valid original word 1010', ['Flipped positions from left', 'Received word', 'Number of 1s', 'Even-parity check'], [['None', '1010', 2, 'Pass'], ['1', '0010', 1, 'Fail: error detected'], ['1 and 2', '0110', 2, 'Pass: error missed'], ['1, 2, and 3', '0100', 1, 'Fail: error detected'], ['1, 2, 3, and 4', '0101', 2, 'Pass: error missed']])], ['The same toggle reasoning holds for odd-parity words and for a changed parity-bit position.', 'The check detects an odd Hamming-distance error pattern; it neither locates a bad bit nor guarantees correction.'], 'Count the positions that differ between sent and received words. If a bit is toggled twice and returns to its original value, those two physical toggles do not create two differing received positions.');
  put('bc-12', 'Complement the stored bits, then decode Excess-3', 'Original Excess-3 group 0111; find the digit represented by its bitwise complement.', [
    S('Invert the first bit', 'The first supplied bit is 0, so its complement is 1.', '0 → 1'),
    S('Invert the remaining three bits', 'Each supplied 1 becomes 0. Complement each position exactly once.', '1 1 1 → 0 0 0'),
    S('Write the complemented group', 'Keep the original four-bit width.', '0111 → 1000'),
    S('Decode the complemented binary value', 'The 8 bit is set and the other bits are zero.', '1000₂ = 1×8 + 0×4 + 0×2 + 0×1 = 8'),
    S('Remove the Excess-3 bias', 'The group stores the digit plus 3, so subtract 3.', 'Digit = 8 − 3 = 5'),
    S('Decode the original for a second check', 'The original stored value was 7; removing the bias gives digit 4.', '0111₂ = 4+2+1 = 7; 7−3 = 4'),
    S('Check the self-complementing property', 'The digits 4 and 5 sum to 9, so they are 9’s complements.', '9 − 4 = 5')
  ], [T('Bit-by-bit complementation', ['Position from left', 'Original bit', 'Complemented bit'], [...'0111'].map((b, i) => [i + 1, b, 1 - Number(b)])), weights('1000', 'Weighted value after complementation')], ['Complementing an Excess-3 digit for d gives stored value 15−(d+3). Decoding subtracts 3, leaving 9−d.', 'With original digit 4, this gives 9−4 = 5.'], 'Do not report the complemented group’s ordinary binary value 8; Excess-3 still requires subtracting the bias 3.');

  put('ba-01', 'Verify the OR identity for every possible A', 'The expression is A + 0; + means logical OR.', [
    S('Read the operator correctly', 'Boolean + means OR, so this expression asks whether A or the fixed input 0 is true.', 'A + 0 = A OR 0'),
    S('Substitute A = 0', 'Neither input is 1, so OR produces 0.', '0 + 0 = 0'),
    S('Substitute A = 1', 'The A input is 1, so OR produces 1.', '1 + 0 = 1'),
    S('Compare the output with A', 'For both possible inputs, the expression’s output equals A itself.', 'A + 0 = A'),
    S('Name the law and eliminate alternatives', 'This is the OR identity law. Constant 0 fails when A = 1; constant 1 fails when A = 0; A′ gives the opposite output in both rows.')
  ], [truth('Exhaustive verification of A + 0 = A', ['A'], ['A OR 0', 'Simplified A', 'Match?'], a => [a | 0, a, 'Yes'])], ['Both rows match A, so the simplification holds for every Boolean input.'], 'A·0 = 0 is a different law for AND; the operator in this problem is OR.');
  put('ba-02', 'Verify the AND idempotent law', 'The expression is A·A; · means logical AND.', [
    S('Identify the repeated input', 'Both AND inputs are the same variable A, so the possible pairs are only 00 and 11.'),
    S('Substitute A = 0', 'Both inputs are 0. AND returns 0.', 'A·A = 0·0 = 0'),
    S('Substitute A = 1', 'Both inputs are 1. AND returns 1.', 'A·A = 1·1 = 1'),
    S('Compare with the original variable', 'The output equals A for both values, so the extra copy of A changes nothing.', 'A·A = A'),
    S('Name and check the law', 'This is the idempotent law for AND. A constant cannot match both rows, whereas A does.')
  ], [truth('Exhaustive verification of A·A = A', ['A'], ['A·A', 'Simplified A', 'Match?'], a => [a & a, a, 'Yes'])], ['When A = 0 both forms are 0; when A = 1 both forms are 1.'], 'Boolean A is restricted to 0 or 1. Do not leave an ordinary-algebra A² term when a single variable is requested.');
  put('ba-03', 'Evaluate a variable OR its complement', 'A′ means NOT A; the expression is A + A′.', [
    S('Pair each input with its complement', 'A′ is always the opposite bit from A. The pair is either 0,1 or 1,0.'),
    S('Evaluate A = 0', 'The complement is 1, so OR has one true input.', 'A′ = 1; A + A′ = 0 + 1 = 1'),
    S('Evaluate A = 1', 'The complement is 0, so OR again has one true input.', 'A′ = 0; A + A′ = 1 + 0 = 1'),
    S('Recognize the constant result', 'Both rows are 1, so the whole expression is always true.', 'A + A′ = 1'),
    S('Distinguish the companion law', 'A AND A′ would always be 0 because the pair is never simultaneously 1. Here the operator is OR.')
  ], [truth('Every row of the OR complement law', ['A'], ['A′', 'A + A′', 'Simplified 1', 'Match?'], a => [1 - a, a | (1 - a), 1, 'Yes'])], ['The output column is 11, matching constant 1 in all possible cases.'], 'Do not confuse A + A′ = 1 with A·A′ = 0.');
  put('ba-04', 'Apply the conventional precedence to a concrete expression', 'With no overriding parentheses, evaluate NOT, then AND, then OR.', [
    S('Process NOT first', 'In A + B′·C, the prime belongs to B. Compute B′ before using it in a product.', 'A + B′·C = A OR ((NOT B) AND C)'),
    S('Process AND next', 'Combine the complemented B with C before the final OR.', 'Intermediate X = (NOT B) AND C'),
    S('Process OR last', 'Use the AND result as one OR input.', 'Final F = A OR X'),
    S('Work a complete example', 'Let A = 1, B = 1, C = 0. NOT B = 0, then 0 AND 0 = 0, then 1 OR 0 = 1.', '1 + 1′·0 = 1 + 0·0 = 1 + 0 = 1'),
    S('See why a different order is wrong', 'If OR were incorrectly done before AND, this example would become (1 + 0)·0 = 0, disagreeing with the conventional value 1.'),
    S('Allow parentheses to override the convention', 'For (A + B)·C, evaluate the parenthesized OR before the outer AND. The stated question concerns expressions without such overriding parentheses.'),
    S('Choose the requested ordering', 'The correct choice is “NOT, then AND, then OR.”')
  ], [T('One full evaluation under the conventional order', ['Stage', 'Operation', 'Result'], [['1: NOT', 'B′ = NOT 1', 0], ['2: AND', 'B′·C = 0·0', 0], ['3: OR', 'A + (B′·C) = 1 + 0', 1]])], ['For A = 1, B = 1, C = 0, the conventional grouping A + (B′C) produces 1. The incorrect grouping (A + B′)C produces 0.'], 'A prime complements the expression it is attached to; parentheses can change that scope.');
  put('ba-05', 'Factor the common A, then apply OR domination and AND identity', 'Simplify A + A·B; + is OR and · is AND.', [
    S('Expose a common factor', 'Write the standalone A as A·1, using the AND identity law.', 'A + AB = A·1 + A·B'),
    S('Factor A from the two products', 'Both products contain A, so use the distributive law in reverse.', 'A·1 + A·B = A(1 + B)'),
    S('Simplify the inner OR', 'Whether B is 0 or 1, OR with 1 is 1.', '1 + B = 1'),
    S('Simplify the remaining AND', 'AND with 1 leaves the other input unchanged.', 'A(1 + B) = A·1 = A'),
    S('Explain the covered cases', 'If A = 0, both A and AB are 0. If A = 1, the standalone A already makes the OR true; AB cannot add another true case.'),
    S('Verify every row', 'The original A + AB column and the simplified A column agree for all four pairs AB.')
  ], [truth('Exhaustive verification of absorption', ['A', 'B'], ['AB', 'Original A + AB', 'Simplified A', 'Match?'], (a, b) => [a & b, a | (a & b), a, 'Yes'])], ['For AB = 00,01,10,11, both expressions produce 0011.'], 'Boolean 1 + B equals 1, not an ordinary arithmetic 1+B quantity.');
  put('ba-06', 'Distribute, then apply idempotence and absorption', 'Simplify A·(A + B).', [
    S('Distribute A into both inner terms', 'Use X(Y + Z) = XY + XZ, with X = A, Y = A, Z = B.', 'A(A + B) = AA + AB'),
    S('Apply AND idempotence', 'Two copies of the same Boolean input combined by AND equal that input.', 'AA + AB = A + AB'),
    S('Expose the common factor', 'Replace A with A·1 and factor A.', 'A + AB = A·1 + AB = A(1 + B)'),
    S('Apply OR domination', 'The inner OR is 1 for either possible B.', 'A(1 + B) = A·1'),
    S('Apply AND identity', 'AND with 1 leaves A.', 'A·1 = A'),
    S('Verify both cases of A', 'For A = 0 the outside AND forces 0. For A = 1 the inner OR is 1, so the whole expression is 1. The output therefore always follows A.')
  ], [truth('All input rows verify the dual absorption law', ['A', 'B'], ['A + B', 'Original A(A + B)', 'AA + AB', 'Simplified A', 'Match?'], (a, b) => [a | b, a & (a | b), (a & a) | (a & b), a, 'Yes'])], ['The original and simplified expressions both have output column 0011 for AB = 00,01,10,11.'], 'Distribute A to both A and B; forgetting the AA term changes the expression.');
  put('ba-07', 'Apply De Morgan and verify the complemented OR', 'Rewrite (A + B)′.', [
    S('Identify the scope of the prime', 'The prime is outside the parentheses, so it complements the entire OR result.', 'Original = NOT(A OR B)'),
    S('Ask when an OR output is 0', 'A OR B is 0 only when A = 0 and B = 0. Its complement is therefore 1 only for that same pair.'),
    S('Express those two requirements', 'A = 0 means A′ = 1; B = 0 means B′ = 1. Both are required, so combine them with AND.', '(A + B)′ = A′·B′'),
    S('State the De Morgan transformation', 'Change the internal OR to AND and complement each operand. Both changes are necessary.'),
    S('Test the misleading A′ + B′ choice', 'For A = 1, B = 0, the original is (1 + 0)′ = 0. But A′ + B′ = 0 + 1 = 1, so that choice is not equivalent.'),
    S('Verify all rows', 'The complemented-OR and A′B′ columns both read 1000 in row order 00,01,10,11.')
  ], [truth('Full De Morgan verification with intermediate columns', ['A', 'B'], ['A + B', '(A + B)′', 'A′', 'B′', 'A′·B′', 'Match?'], (a, b) => [a | b, 1 - (a | b), 1 - a, 1 - b, (1 - a) & (1 - b), 'Yes'])], ['The complete output columns match, so the identity holds for every possible pair.'], 'Removing the outer prime requires changing OR to AND as well as complementing both operands.');
  put('ba-08', 'Factor A and use the complementary pair B + B′', 'Simplify A·B + A·B′.', [
    S('Find the common factor', 'Both product terms contain A. Their other factors are B and B′.'),
    S('Factor using the distributive law', 'Use XY + XZ = X(Y + Z), with X = A, Y = B, Z = B′.', 'AB + AB′ = A(B + B′)'),
    S('Evaluate the complementary OR', 'Exactly one of B and B′ is 1, so their OR is always 1.', 'B + B′ = 1'),
    S('Apply the AND identity', 'The common A is ANDed with 1.', 'A(B + B′) = A·1 = A'),
    S('Check B = 0', 'B′ = 1, so AB is 0 and AB′ equals A.', 'A·0 + A·1 = 0 + A = A'),
    S('Check B = 1', 'B′ = 0, so AB equals A and AB′ is 0.', 'A·1 + A·0 = A + 0 = A')
  ], [truth('Each product term and the simplified expression', ['A', 'B'], ['B′', 'AB', 'AB′', 'Original AB + AB′', 'Simplified A', 'Match?'], (a, b) => [1 - b, a & b, a & (1 - b), (a & b) | (a & (1 - b)), a, 'Yes'])], ['The two terms cover both B values when A = 1 and neither term is true when A = 0. Every truth-table row matches A.'], 'B + B′ equals 1. Replacing this OR with an AND would instead give the wrong constant 0.');
  put('ba-09', 'Expand every product before simplifying', 'Simplify (A + B)·(A + B′).', [
    S('Distribute the first A', 'Multiply A by each term in the second parentheses.', 'A(A + B′) = AA + AB′'),
    S('Distribute the first B', 'Multiply B by each term in the second parentheses.', 'B(A + B′) = BA + BB′'),
    S('Combine all four products', 'No term may be dropped during expansion.', '(A + B)(A + B′) = AA + AB′ + BA + BB′'),
    S('Apply idempotence and the AND complement law', 'AA = A, BA = AB by commutativity, and BB′ = 0.', 'AA + AB′ + BA + BB′ = A + AB′ + AB + 0'),
    S('Remove the OR identity term', 'OR with 0 changes nothing.', 'A + AB′ + AB + 0 = A + AB′ + AB'),
    S('Absorb AB′ into A', 'Use A + AX = A, with X = B′.', 'A + AB′ + AB = A + AB'),
    S('Absorb AB into A', 'Apply the same law with X = B.', 'A + AB = A'),
    S('Verify the complete result', 'The two parentheses and their product appear in the table; the product equals A for all four rows.')
  ], [truth('Full verification of the product-of-sums simplification', ['A', 'B'], ['B′', 'A + B', 'A + B′', 'Original product', 'Simplified A', 'Match?'], (a, b) => [1 - b, a | b, a | (1 - b), (a | b) & (a | (1 - b)), a, 'Yes'])], ['When A = 0, the product becomes BB′ = 0. When A = 1, both parentheses are 1. Thus the result is A in both cases.'], 'There are four products after full distribution. Omitting a cross-product can lead to an unjustified simplification.');
  put('ba-10', 'Evaluate both product terms and identify their true rows', 'F = A′·B + A·B′; identify the gate function.', [
    S('Read the first product', 'A′B is true only if A = 0 and B = 1.', 'A′B = 1 only for AB = 01'),
    S('Read the second product', 'AB′ is true only if A = 1 and B = 0.', 'AB′ = 1 only for AB = 10'),
    S('Evaluate row 00', 'Both products contain a zero input.', '(1·0) + (0·1) = 0 + 0 = 0'),
    S('Evaluate row 01', 'The first product is 1 and the second is 0.', '(1·1) + (0·0) = 1 + 0 = 1'),
    S('Evaluate row 10', 'The first product is 0 and the second is 1.', '(0·0) + (1·1) = 0 + 1 = 1'),
    S('Evaluate row 11', 'Each complemented input is 0, so both products vanish.', '(0·1) + (1·0) = 0 + 0 = 0'),
    S('Name the gate', 'The output is 1 exactly when the two inputs differ. That is XOR.', 'F = A XOR B'),
    S('Compare the alternatives', 'XNOR gives the opposite column 1001; AND gives 0001; OR gives 0111. The derived column is 0110.')
  ], [truth('Every intermediate term in the XOR sum of products', ['A', 'B'], ['A′', 'B′', 'A′B', 'AB′', 'F = A′B + AB′', 'XOR', 'Match?'], (a, b) => [1 - a, 1 - b, (1 - a) & b, a & (1 - b), ((1 - a) & b) | (a & (1 - b)), a ^ b, 'Yes'])], ['The complete expression and XOR have identical output columns 0110.'], 'Boolean + combines the products with OR; it is not an ordinary numeric sum needing a carry.');
  put('ba-11', 'Expand the listed minterms and eliminate variables that vary freely', 'F(A,B,C) = Σm(1,3,5,7); index = 4A + 2B + C.', [
    S('Convert every listed index to ABC', 'A is the weight-4 bit, B the weight-2 bit, and C the weight-1 bit.', '1 = 001; 3 = 011; 5 = 101; 7 = 111'),
    S('Write each minterm explicitly', 'A 0 bit creates a complemented literal; a 1 bit creates an uncomplemented literal.', 'F = A′B′C + A′BC + AB′C + ABC'),
    S('Factor C from all four terms', 'Each listed row has C = 1.', 'F = C(A′B′ + A′B + AB′ + AB)'),
    S('Group by A', 'The first two products contain A′ and the last two contain A.', 'F = C[A′(B′ + B) + A(B′ + B)]'),
    S('Remove the complementary B pairs', 'B′ + B = 1 in both groups.', 'F = C(A′·1 + A·1) = C(A′ + A)'),
    S('Remove the complementary A pair', 'A′ + A = 1, so the remaining AND is C·1.', 'F = C·1 = C'),
    S('Check the rows not listed', 'Indices 0,2,4,6 are 000,010,100,110; every one has C = 0. Because no such minterm is listed, F = 0 in exactly those rows.'),
    S('Verify all eight rows', 'The membership-based F column and the simple C column alternate 0,1,0,1,0,1,0,1 and match everywhere.')
  ], [truth('Complete minterm membership and simplification check', ['A', 'B', 'C'], ['Index 4A + 2B + C', 'Listed minterm?', 'Original F', 'Simplified C', 'Match?'], (a, b, c) => {
    const index = 4 * a + 2 * b + c, listed = [1, 3, 5, 7].includes(index);
    return [index, listed ? 'Yes' : 'No', bit(listed), c, 'Yes'];
  })], ['All combinations of A and B occur with C = 1, so neither A nor B constrains the true rows.', 'F = C′ would reverse every output; F = A or F = B would fail listed rows such as 001.'], 'Read indices in ABC order with A most significant; using C as the most significant bit changes the interpretation.');
  put('ba-12', 'Show algebraically why the consensus term BC adds no true rows', 'F = AB + A′C + BC. The consensus theorem can remove BC.', [
    S('Identify the complementary pair', 'AB contains A, while A′C contains A′. Their remaining factors are B and C, producing consensus term BC.'),
    S('Insert an identity into BC', 'A + A′ is always 1, so multiplying BC by it does not change BC.', 'BC = BC·1 = BC(A + A′)'),
    S('Expand the consensus term', 'Distribute BC across A + A′, then substitute the expansion into F.', 'F = AB + A′C + ABC + A′BC'),
    S('Group terms with common factors', 'Group AB with ABC; group A′C with A′BC.', 'F = (AB + ABC) + (A′C + A′BC)'),
    S('Factor each group', 'The first common factor is AB; the second is A′C.', 'F = AB(1 + C) + A′C(1 + B)'),
    S('Use OR domination', 'Both 1 + C and 1 + B equal 1.', 'F = AB·1 + A′C·1'),
    S('Use AND identity', 'The factors of 1 can be removed.', 'F = AB + A′C'),
    S('Explain why BC is redundant', 'If BC = 1, then B = C = 1. For A = 1, AB already gives 1. For A = 0, A′C already gives 1. BC never adds an uncovered true case.'),
    S('Keep the two essential terms', 'At ABC = 110 only AB supplies 1. At ABC = 001 only A′C supplies 1. Removing either of those terms would change F.'),
    S('Check all eight input rows', 'The full table calculates all three original products, the original OR, and the simplified two-term OR; their outputs match everywhere.')
  ], [truth('Exhaustive verification of consensus-term removal', ['A', 'B', 'C'], ['AB', 'A′C', 'BC', 'Original F', 'Reduced AB + A′C', 'Match?'], (a, b, c) => {
    const ab = a & b, ac = (1 - a) & c, bc = b & c;
    return [ab, ac, bc, ab | ac | bc, ab | ac, 'Yes'];
  })], ['In row order 000 through 111, both forms produce 01010011.', 'The candidate B + C fails at ABC = 010: B + C = 1, but the original F = 0.'], 'The consensus theorem removes BC only. It does not license removing either AB or A′C.');

  function encodeGray(word) {
    return [...word].map((b, i) => i === 0 ? b : String(Number(word[i - 1]) ^ Number(b))).join('');
  }
  function decodeGray(word) {
    let previous = 0;
    return [...word].map((g, i) => {
      previous = i === 0 ? Number(g) : previous ^ Number(g);
      return String(previous);
    }).join('');
  }
  function grayEncodeRows(word) {
    return [...word].map((b, i) => [i + 1, i === 0 ? `Copy b${word.length - 1}` : `b${word.length - i} XOR b${word.length - i - 1}`, i === 0 ? `Copy ${b}` : `${word[i - 1]} XOR ${b}`, i === 0 ? b : String(Number(word[i - 1]) ^ Number(b))]);
  }
  function grayDecodeRows(word) {
    const binary = decodeGray(word);
    return [...word].map((g, i) => [i + 1, g, i === 0 ? 'No previous bit: copy the first Gray bit' : `Previous computed binary bit = ${binary[i - 1]}`, i === 0 ? `Copy ${g} = ${binary[i]}` : `${binary[i - 1]} XOR ${g} = ${binary[i]}`, binary.slice(0, i + 1)]);
  }
  function graySequence(n, caption) {
    return T(caption, ['Decimal position', 'Ordinary binary position', 'Zero-filled right shift', 'Gray codeword'], all(n).map(bits => {
      const binary = bits.join('');
      return [parseInt(binary, 2), binary, `0${binary.slice(0, -1)}`, encodeGray(binary)];
    }));
  }
  function encodeSolution(id, binary) {
    const gray = encodeGray(binary), shifted = `0${binary.slice(0, -1)}`, decoded = decodeGray(gray);
    const n = binary.length;
    put(id, 'Copy the first bit, then XOR adjacent ORIGINAL binary bits', `Binary word ${binary}; keep exactly ${n} output bits.`, [
      S('Label and preserve the input', `Write binary bits b${n - 1} through b0 from left to right. All XOR operands in this encoding come from this original word.`, `Binary input = ${binary}`),
      S('Copy the most significant bit', 'The first Gray bit is the first binary bit; no XOR is needed for this first position.', `g${n - 1} = b${n - 1} = ${binary[0]}`),
      ...[...binary].slice(1).map((b, i) => {
        const index = i + 1, left = binary[index - 1], result = Number(left) ^ Number(b);
        return S(`Find Gray bit g${n - index - 1}`, `Use original binary bits b${n - index} = ${left} and b${n - index - 1} = ${b}. ${left === b ? 'The inputs are equal, so XOR is 0.' : 'The inputs differ, so XOR is 1.'}`, `g${n - index - 1} = ${left} XOR ${b} = ${result}`);
      }),
      S('Join the Gray bits in their original position order', `Retain all ${n} positions, including a leading zero when present.`, `${[...gray].join(', ')} → ${gray}`),
      S('Check with the shifted-word formula', 'Zero-fill a one-place right shift of the ORIGINAL binary word, then XOR it with the original.', `${binary} XOR ${shifted} = ${gray}`),
      S('Decode to verify the inverse', 'A Gray decoder copies the first bit, then uses the previous computed binary bit XOR the next Gray bit. The reverse-check table shows every position.', `${gray} Gray → ${decoded} binary = original input`)
    ], [T('Every encoding operation', ['Gray position from left', 'Rule', 'Actual input operation', 'Gray bit'], grayEncodeRows(binary)), T('Independent inverse check: prefix-XOR decoding', ['Position from left', 'Gray input bit', 'Previous binary bit', 'Operation', 'Binary prefix so far'], grayDecodeRows(gray))], [`Encoding gives ${gray}; prefix-XOR decoding returns ${binary} exactly.`, `The shift check uses ${binary} XOR ${shifted}, with an inserted leading 0 rather than a rotation.`], 'For binary-to-Gray, use adjacent original binary bits. Using a newly computed Gray bit as the next operand applies the wrong rule.');
  }
  function decodeSolution(id, gray) {
    const binary = decodeGray(gray), shifted = `0${binary.slice(0, -1)}`, n = gray.length;
    put(id, 'Copy the first bit, then use the PREVIOUS COMPUTED binary bit', `Gray word ${gray}; recover an ordinary binary word of exactly ${n} bits.`, [
      S('Set the decoding direction', 'Work from left to right. After finding each new binary bit, keep it for the next XOR.'),
      S('Copy the most significant Gray bit', 'The first ordinary binary bit equals the first Gray bit.', `b${n - 1} = g${n - 1} = ${gray[0]}`),
      ...[...gray].slice(1).map((g, i) => {
        const index = i + 1, previous = binary[index - 1], result = binary[index];
        return S(`Find binary bit b${n - index - 1}`, `Use the binary bit just computed, b${n - index} = ${previous}, and the current supplied Gray bit g${n - index - 1} = ${g}. ${previous === g ? 'Equal inputs give 0.' : 'Different inputs give 1.'}`, `b${n - index - 1} = ${previous} XOR ${g} = ${result}`);
      }),
      S('Read the completed binary word', 'Join the computed binary bits in left-to-right order.', `${[...binary].join(', ')} → ${binary}`),
      S('Re-encode using the separate encoding rule', 'Use adjacent bits of the completed binary word, or XOR it with its zero-filled right shift.', `${binary} XOR ${shifted} = ${encodeGray(binary)}`),
      S('Compare with the supplied Gray word', 'The re-encoded word matches the input exactly, verifying the decoding.', `${encodeGray(binary)} = ${gray}`)
    ], [T('Every running-XOR decoding operation', ['Position from left', 'Gray input bit', 'Previous computed binary bit', 'Actual operation', 'Binary prefix so far'], grayDecodeRows(gray)), T('Inverse check: adjacent-binary encoding', ['Gray position from left', 'Rule', 'Actual operation', 'Recreated Gray bit'], grayEncodeRows(binary))], [`The decoded binary word is ${binary}. Re-encoding it gives ${gray}, the original Gray input.`], 'Gray-to-binary uses the previous computed BINARY bit. XORing adjacent original Gray bits is not the decoding algorithm.');
  }
  put('gc-01', 'Inspect the number of bit changes at each adjacent step', 'The code is the standard binary-reflected Gray sequence.', [
    S('Start with the full two-bit reflected sequence', 'Its positions 0,1,2,3 use Gray codewords 00,01,11,10.', '00 → 01 → 11 → 10'),
    S('Compare the first transition', 'Only the rightmost position changes.', '00 XOR 01 = 01 → one changed bit'),
    S('Compare the second transition', 'Only the leftmost position changes.', '01 XOR 11 = 10 → one changed bit'),
    S('Compare the third transition', 'Only the rightmost position changes.', '11 XOR 10 = 01 → one changed bit'),
    S('Check the cyclic wraparound', 'The last and first words also differ in one position in the standard cyclic reflected code.', '10 XOR 00 = 10 → one changed bit'),
    S('State the defining adjacency property', 'Every adjacent pair has Hamming distance 1: exactly one bit differs.'),
    S('Reject the other descriptions', 'The words contain 0,1,2,1 ones, so the number of ones is not fixed and adjacent parity is not the same. At position 2, Gray is 11 while ordinary binary is 10.')
  ], [T('Every transition in the cyclic two-bit Gray sequence', ['From', 'To', 'XOR difference mask', 'Number of changed positions'], [['00', '01', '01', 1], ['01', '11', '10', 1], ['11', '10', '01', 1], ['10', '00', '10', 1]])], ['Each XOR mask has exactly one 1, confirming a single changed position at every adjacent transition.'], 'A Gray codeword may contain several 1s. The one-bit rule counts changes between adjacent words, not the number of 1s within a word.');
  encodeSolution('gc-02', '1011');
  decodeSolution('gc-03', '1101');
  put('gc-04', 'Compare Gray sequence positions with fixed weighted sums', 'Standard binary-reflected Gray code; ordinary binary uses fixed powers of two.', [
    S('Recall what weighted means', 'In an ordinary three-bit binary word abc, the value is 4a + 2b + c. A fixed weight belongs to each position regardless of the other bits.'),
    S('Inspect a Gray example', 'The standard three-bit Gray sequence puts codeword 110 at decimal position 4. Treating those same digits as ordinary binary would give 6.', 'Gray 110 → position 4; ordinary binary 110 → 4+2 = 6'),
    S('Try assigning fixed weights to Gray positions', 'The Gray word 001 represents position 1, so a fixed rightmost weight would have to be 1.', 'Assume value = w₂g₂ + w₁g₁ + w₀g₀; 001 implies w₀ = 1'),
    S('Use a second single-bit Gray word', 'Gray 010 represents position 3, so a fixed middle weight would have to be 3.', '010 implies w₁ = 3'),
    S('Find the contradiction', 'Gray 011 represents position 2, but the proposed fixed weights would sum to 3+1 = 4. Therefore no simple fixed positional-weight sum describes this Gray mapping.', '011 should give 2, but w₁ + w₀ = 3 + 1 = 4'),
    S('Choose the non-weighted definition', 'Gray bits do not have fixed positional weights that can simply be summed to obtain the represented value.'),
    S('Recover a numerical value correctly', 'Convert Gray to ordinary binary first. For 110: copy 1, then 1 XOR 1 = 0, then 0 XOR 0 = 0, giving binary 100 = decimal 4.', 'Gray 110 → binary 100 → 4')
  ], [graySequence(3, 'All three-bit positions and their binary-reflected Gray words')], ['The fixed-weight contradiction uses actual standard Gray positions, not only a comparison with powers of two.', 'Gray 000 represents zero; the code uses the two symbols 0 and 1 and carries position information.'], 'Non-weighted does not mean that every bit has weight zero or that the code cannot represent a value.');
  encodeSolution('gc-05', '0110');
  decodeSolution('gc-06', '1010');
  put('gc-07', 'Build the full three-bit sequence by reflection', 'The first four three-bit Gray words are 000, 001, 011, 010; find the next word.', [
    S('Start with the one-bit Gray list', 'The initial list is 0,1. Reflecting means making a reversed copy.', 'Forward: 0,1; reverse: 1,0'),
    S('Build the two-bit Gray list', 'Prefix 0 to the forward list, then prefix 1 to the reversed list.', '0|0, 0|1, 1|1, 1|0 → 00,01,11,10'),
    S('Create the first three-bit half', 'Prefix 0 to the two-bit list in its forward order. This reproduces exactly the four words in the question.', '0|00, 0|01, 0|11, 0|10 → 000,001,011,010'),
    S('Reflect the two-bit list', 'Reverse 00,01,11,10 to obtain 10,11,01,00.', 'Forward: 00,01,11,10; reflected: 10,11,01,00'),
    S('Create the second three-bit half', 'Prefix 1 to each reflected entry.', '1|10, 1|11, 1|01, 1|00 → 110,111,101,100'),
    S('Pick the first word of that second half', 'Immediately after the first-half last word 010 comes 110.', '000,001,011,010,110,111,101,100'),
    S('Verify by encoding the next position', 'The next decimal position is 4 = binary 100. Zero-fill its right shift to 010 and XOR.', '100 XOR 010 = 110'),
    S('Verify the boundary change', 'Only the most significant bit changes from 010 to 110.', '010 XOR 110 = 100 → one changed bit')
  ], [T('Complete reflected construction: every three-bit codeword', ['Sequence position', 'Half', 'Prefix', 'Two-bit suffix in chosen order', 'Result'], [[0, 'First: forward', 0, '00', '000'], [1, 'First: forward', 0, '01', '001'], [2, 'First: forward', 0, '11', '011'], [3, 'First: forward', 0, '10', '010'], [4, 'Second: reflected', 1, '10', '110'], [5, 'Second: reflected', 1, '11', '111'], [6, 'Second: reflected', 1, '01', '101'], [7, 'Second: reflected', 1, '00', '100']])], ['The reflected construction and the independent binary-to-Gray conversion both produce next word 110.'], 'A one-bit change is necessary but does not by itself identify the next word in a particular Gray ordering. Use the standard reflection order.');
  put('gc-08', 'Compare every pair of corresponding bit positions', 'Words 0111 and 0101; Hamming distance counts differing positions.', [
    S('Align the words', 'Keep all four positions aligned; a leading zero is still a position.', '0111\n0101'),
    S('Compare the leftmost position', 'Both words contain 0, so this position contributes 0 differences.', '0 XOR 0 = 0'),
    S('Compare the second position', 'Both words contain 1, so this position contributes 0.', '1 XOR 1 = 0'),
    S('Compare the third position', 'The bits are 1 and 0, so this position contributes 1 difference.', '1 XOR 0 = 1'),
    S('Compare the rightmost position', 'Both words contain 1, so this position contributes 0.', '1 XOR 1 = 0'),
    S('Add the difference indicators', 'There is exactly one differing position.', '0 + 0 + 1 + 0 = 1'),
    S('State the distance', 'The Hamming distance is 1. It counts bit changes rather than subtracting numeric values.')
  ], [T('Every corresponding bit pair', ['Position from left', 'Bit of 0111', 'Bit of 0101', 'XOR difference indicator'], [...'0111'].map((b, i) => [i + 1, b, '0101'[i], Number(b) ^ Number('0101'[i])]))], ['The full XOR mask is 0010, containing exactly one 1.'], 'As ordinary binary values, 0111−0101 = 7−5 = 2, but that arithmetic difference is not their Hamming distance.');
  encodeSolution('gc-09', '10101');
  decodeSolution('gc-10', '10010');
  const transitions = [['0010', '0110'], ['0001', '0110'], ['0111', '0101'], ['1101', '1111']];
  put('gc-11', 'Count bit changes and verify the actual reflected-sequence positions', 'Check all four offered transitions against the standard four-bit cyclic reflected Gray sequence.', [
    S('Use the necessary one-bit condition', 'Any adjacent standard Gray transition changes exactly one bit. XOR marks changed positions with 1.'),
    ...transitions.map(([from, to]) => {
      const mask = [...from].map((b, i) => Number(b) ^ Number(to[i])).join('');
      const count = [...mask].reduce((sum, b) => sum + Number(b), 0);
      const left = parseInt(decodeGray(from), 2), right = parseInt(decodeGray(to), 2);
      return S(`Test ${from} → ${to}`, `The difference mask contains ${count} ${count === 1 ? 'one' : 'ones'}. Prefix-XOR decoding places these words at positions ${left} and ${right} in the standard sequence.`, `${from} XOR ${to} = ${mask}; distance = ${[...mask].join('+')} = ${count}`);
    }),
    S('Identify the impossible adjacency', '0001 → 0110 changes three positions, so it cannot be a one-step Gray transition.', '0001 → 0110 has Hamming distance 3'),
    S('Confirm the other listed pairs in the actual order', 'Their standard positions are 3→4, 5→6, and 9→10, respectively. These are consecutive positions in the full reflected sequence shown in the table.'),
    S('Keep the logical distinction', 'Distance 1 is necessary for adjacency, but some distance-1 pairs are not neighbors in a particular sequence. Here the full order also verifies the three remaining choices.')
  ], [T('Every candidate transition checked', ['From', 'To', 'XOR mask', 'Hamming distance', 'Decoded position of from', 'Decoded position of to', 'Adjacent here?'], transitions.map(([from, to]) => {
    const mask = [...from].map((b, i) => Number(b) ^ Number(to[i])).join('');
    const left = parseInt(decodeGray(from), 2), right = parseInt(decodeGray(to), 2);
    return [from, to, mask, [...mask].reduce((sum, b) => sum + Number(b), 0), left, right, (right - left + 16) % 16 === 1 || (left - right + 16) % 16 === 1 ? 'Yes' : 'No'];
  })), graySequence(4, 'Complete four-bit standard reflected Gray order, including all candidate positions')], ['The forbidden pair jumps from position 1 to position 4 and changes three bits.', 'The cyclic boundary joins position 15 (1000) to position 0 (0000), also a one-bit transition.'], 'Do not claim every distance-1 pair must be adjacent in the chosen ordering; verify sequence positions when that stronger conclusion is needed.');
  const positionBinary = '10111', positionGray = encodeGray(positionBinary);
  put('gc-12', 'Convert decimal position to ordinary binary, then encode that binary word as Gray', 'Unsigned decimal position 23; encoder width is five bits.', [
    S('List the five ordinary binary weights', 'A five-bit unsigned position uses weights 16,8,4,2,1.', '2⁴,2³,2²,2¹,2⁰ = 16,8,4,2,1'),
    S('Choose the 16 and 8 bits', '23 contains one 16, leaving 7. Since 7 is smaller than 8, the next bit is 0.', '23−16 = 7 → bits 1,0 so far'),
    S('Choose the remaining binary bits', 'Use 4, then 2, then 1 from the remainder.', '7−4 = 3; 3−2 = 1; 1−1 = 0 → bits 1,1,1'),
    S('Write the ordinary binary position', 'Read weights from 16 down to 1.', '23 = 16+4+2+1 = 10111₂'),
    S('Copy the first binary bit into Gray', 'The most significant bit is copied unchanged.', 'g₄ = b₄ = 1'),
    S('Compute Gray bit g₃', 'Use the first two original binary bits, 1 and 0.', 'g₃ = 1 XOR 0 = 1'),
    S('Compute Gray bit g₂', 'Use the next adjacent original binary pair, 0 and 1.', 'g₂ = 0 XOR 1 = 1'),
    S('Compute Gray bit g₁', 'Use original binary pair 1 and 1.', 'g₁ = 1 XOR 1 = 0'),
    S('Compute Gray bit g₀', 'The final original binary pair is also 1 and 1.', 'g₀ = 1 XOR 1 = 0'),
    S('Assemble and check the encoder output', 'The Gray bits are 1,1,1,0,0. The shifted-word formula gives the same result.', '10111 XOR 01011 = 11100'),
    S('Decode back to verify the position', 'Copy 1, then compute 1 XOR 1 = 0; 0 XOR 1 = 1; 1 XOR 0 = 1; 1 XOR 0 = 1. This recovers binary 10111.', '11100 Gray → 10111 binary → 16+4+2+1 = 23')
  ], [weights(positionBinary, 'Ordinary binary representation of decimal position 23'), T('Encode every Gray position', ['Gray position from left', 'Rule', 'Actual operation', 'Gray bit'], grayEncodeRows(positionBinary)), T('Independent check: decode the encoder output', ['Position from left', 'Gray input bit', 'Previous binary bit', 'Operation', 'Binary prefix so far'], grayDecodeRows(positionGray))], ['The output codeword 11100 decodes to ordinary binary 10111, whose decimal value is 23.', '11100 as an ordinary binary numeral would mean 28; here it is a Gray codeword for position 23.'], 'The encoder outputs the Gray representation. Stopping after finding ordinary binary 10111 would answer a different question.');

  const expected = ['lg', 'bc', 'ba', 'gc'].flatMap(prefix => Array.from({ length: 12 }, (_, i) => `${prefix}-${String(i + 1).padStart(2, '0')}`));
  if (written.length !== expected.length || new Set(written).size !== expected.length || expected.some(id => !written.includes(id))) {
    throw new Error('Every logic, binary-code, Boolean, and Gray question must have exactly one worked solution.');
  }
})();
