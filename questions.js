/* Independently authored practice material. Not a transcription of the lecture slides. */
window.QUESTION_BANK = [
  {
    id: 'f1-01', module: 'fractions-1', level: 'foundation', type: 'mcq',
    prompt: 'Convert the binary fraction 0.101₂ to decimal.',
    options: ['0.101', '0.625', '0.5', '0.75'], answer: '0.625',
    steps: ['To the right of a binary point, the place values are 1/2, 1/4, 1/8, and so on.', 'For 0.101₂, multiply each bit by its place value: 1×1/2 + 0×1/4 + 1×1/8.', 'Add the terms: 0.5 + 0 + 0.125 = 0.625.', 'Check: the zero in the middle still occupies the 1/4 place; do not slide the final 1 into that place.'],
    concept: 'Binary fractional place values'
  },
  {
    id: 'f1-02', module: 'fractions-1', level: 'foundation', type: 'mcq',
    prompt: 'What is the place value of the second bit to the right of a binary point?',
    options: ['1/2', '1/8', '2', '1/4'], answer: '1/4',
    steps: ['The first fractional place has weight 2⁻¹ = 1/2.', 'Moving one place farther right divides the weight by 2.', 'The second fractional place is therefore 2⁻² = 1/4.', 'Check: fractional weights decrease toward the right; they do not increase to 2.'],
    concept: 'Negative powers of the radix'
  },
  {
    id: 'f1-03', module: 'fractions-1', level: 'foundation', type: 'short',
    prompt: 'Write decimal 0.375 as an exact binary fraction. Enter the bits with a binary point, without a base suffix.',
    answer: '0.011', accept: ['0.011', '.011', '0.0110', '.0110'],
    steps: ['Multiply 0.375 by 2: 0.750. Record the integer part 0 and keep the fractional part 0.750.', 'Multiply 0.750 by 2: 1.500. Record 1 and keep 0.500.', 'Multiply 0.500 by 2: 1.000. Record 1; the remainder is now zero, so stop.', 'Read the recorded digits in the order produced: 0.011₂. Check: 1/4 + 1/8 = 0.375.'],
    concept: 'Repeated multiplication by 2'
  },
  {
    id: 'f1-04', module: 'fractions-1', level: 'foundation', type: 'mcq',
    prompt: 'A rational number is written in lowest terms. When does its fractional part have a terminating binary expansion?',
    options: ['When its denominator is a power of 2', 'When its numerator is even', 'When its denominator is a multiple of 10', 'Every rational number terminates in binary'],
    answer: 'When its denominator is a power of 2',
    steps: ['An expansion with n binary fractional places represents an integer divided by 2ⁿ.', 'After reduction, its denominator can therefore contain only factors of 2.', 'Conversely, a denominator 2ᵏ can be represented using at most k fractional bits.', 'Check: first reduce the fraction. For example, 3/12 = 1/4 terminates even though 12 itself is not a power of 2.'],
    concept: 'Termination criterion in base 2'
  },
  {
    id: 'f1-05', module: 'fractions-1', level: 'practice', type: 'short',
    prompt: 'Convert decimal 0.8125 to an exact binary fraction. Omit the base suffix.',
    answer: '0.1101', accept: ['0.1101', '.1101', '0.11010', '.11010'],
    steps: ['0.8125×2 = 1.625: record 1 and keep 0.625.', '0.625×2 = 1.25: record 1 and keep 0.25.', '0.25×2 = 0.5: record 0 and keep 0.5.', '0.5×2 = 1.0: record 1 and stop. The answer is 0.1101₂.', 'Check by place values: 1/2 + 1/4 + 1/16 = 13/16 = 0.8125. The zero keeps the 1/8 place empty.'],
    concept: 'Exact decimal-to-binary conversion'
  },
  {
    id: 'f1-06', module: 'fractions-1', level: 'practice', type: 'short',
    prompt: 'Convert 10.011₂ to decimal. Enter an exact decimal value.',
    answer: '2.375', accept: ['2.375'],
    steps: ['Separate the whole-number part 10₂ from the fractional part 0.011₂.', 'The whole-number part is 1×2 + 0×1 = 2.', 'The fractional part is 0×1/2 + 1×1/4 + 1×1/8 = 0.375.', 'Combine them: 2 + 0.375 = 2.375. Check: 10₂ means two, not decimal ten.'],
    concept: 'Mixed binary numbers'
  },
  {
    id: 'f1-07', module: 'fractions-1', level: 'practice', type: 'mcq',
    prompt: 'Truncate decimal 0.1 to exactly eight binary fractional bits. Which result is correct?',
    options: ['0.00011010₂', '0.10000000₂', '0.00011001₂', '0.00110011₂'], answer: '0.00011001₂',
    steps: ['Repeated multiplication by 2 produces the bits 0, 0, 0, 1, 1, 0, 0, 1 for the first eight places.', 'Equivalently, 0.1×2⁸ = 25.6; truncation keeps the integer 25.', 'Write 25 using eight bits: 00011001. Place the binary point before these bits.', 'The result is 25/256 = 0.09765625, slightly below 0.1. Check: 00011010 is the rounded value, not the truncated value.'],
    concept: 'Truncation and finite precision'
  },
  {
    id: 'f1-08', module: 'fractions-1', level: 'practice', type: 'short',
    prompt: 'Convert decimal 3.625 to binary. Omit the base suffix.',
    answer: '11.101', accept: ['11.101', '11.1010'],
    steps: ['Convert the integer part: 3 = 2 + 1, so 3₁₀ = 11₂.', 'For 0.625, multiply by 2: 1.25 gives bit 1; keep 0.25.', 'Then 0.25×2 = 0.5 gives bit 0, and 0.5×2 = 1 gives bit 1.', 'Join the two parts: 11.101₂. Check: 2 + 1 + 1/2 + 1/8 = 3.625.'],
    concept: 'Separate integer and fractional conversions'
  },
  {
    id: 'f1-09', module: 'fractions-1', level: 'exam', type: 'short',
    prompt: 'Convert decimal 0.6875 to an exact binary fraction. Omit the base suffix.',
    answer: '0.1011', accept: ['0.1011', '.1011', '0.10110', '.10110'],
    steps: ['Recognize 0.6875 = 11/16, so four binary fractional places are sufficient.', 'Write the numerator 11 in four bits: 1011.', 'Divide by 16 = 2⁴ by placing the binary point four places to the left: 0.1011₂.', 'Check independently: 1/2 + 0/4 + 1/8 + 1/16 = 8/16 + 2/16 + 1/16 = 11/16.'],
    concept: 'Fractions with power-of-two denominators'
  },
  {
    id: 'f1-10', module: 'fractions-1', level: 'exam', type: 'mcq',
    prompt: 'Round decimal 0.1 to the nearest value with exactly four binary fractional bits. What value and signed error (stored minus exact) result?',
    options: ['0.0001₂; error −0.0375', '0.0010₂; error +0.025', '0.0010₂; error −0.025', '0.0001₂; error +0.0375'],
    answer: '0.0010₂; error +0.025',
    steps: ['Four fractional bits give a spacing of 1/16 = 0.0625.', 'Scale 0.1 by 16: the result 1.6 rounds to the nearest integer 2.', 'The four-bit numerator 2 is 0010, so the stored value is 0.0010₂ = 2/16 = 0.125.', 'The signed error is stored minus exact: 0.125 − 0.1 = +0.025.', 'Check: truncation would choose 1/16 = 0.0625, whose error magnitude 0.0375 is larger.'],
    concept: 'Rounding and signed quantization error'
  },
  {
    id: 'f1-11', module: 'fractions-1', level: 'exam', type: 'mcq',
    prompt: 'Which binary fraction is the smallest?',
    options: ['0.101₂', '0.11₂', '0.1001₂', '0.0111₂'], answer: '0.0111₂',
    steps: ['Pad with trailing zeros to compare equal-length strings: 0.1010, 0.1100, 0.1001, and 0.0111.', 'Compare from the first fractional bit. The first three start with 1; the last starts with 0.', 'Thus 0.0111₂ is below 1/2, while the other choices are at least 1/2.', 'Check numerically: the values are 0.625, 0.75, 0.5625, and 0.4375 respectively. More digits do not necessarily mean a larger fraction.'],
    concept: 'Comparing binary fractions'
  },
  {
    id: 'f1-12', module: 'fractions-1', level: 'exam', type: 'mcq',
    prompt: 'Which exact binary expansion represents decimal 0.2? Parentheses mark the block repeated forever.',
    options: ['0.(0011)₂', '0.(01)₂', '0.0011₂', '0.(0001)₂'], answer: '0.(0011)₂',
    steps: ['Let x = 0.(0011)₂. A four-bit shift multiplies x by 16.', 'Then 16x = 11₂ + x = 3 + x, so 15x = 3.', 'Therefore x = 3/15 = 1/5 = 0.2 exactly.', 'Check: the finite value 0.0011₂ is only 3/16 = 0.1875. Repetition matters, and 1/5 cannot terminate in binary because its reduced denominator contains a factor of 5.'],
    concept: 'Repeating binary expansions'
  },
  {
    id: 'f2-01', module: 'fractions-2', level: 'foundation', type: 'mcq',
    prompt: 'Convert the octal fraction 0.4₈ to decimal.',
    options: ['0.4', '0.25', '0.5', '0.125'], answer: '0.5',
    steps: ['The first place after an octal point has weight 8⁻¹ = 1/8.', 'Multiply the digit by that weight: 4×1/8 = 4/8.', 'Reduce: 4/8 = 1/2 = 0.5.', 'Check: the base determines the place value. The written digit 4 does not make this decimal 0.4.'],
    concept: 'Octal fractional place values'
  },
  {
    id: 'f2-02', module: 'fractions-2', level: 'foundation', type: 'mcq',
    prompt: 'Convert the hexadecimal fraction 0.A₁₆ to decimal.',
    options: ['0.625', '0.1', '0.10', '0.0625'], answer: '0.625',
    steps: ['In hexadecimal, A represents decimal 10.', 'The first fractional hexadecimal place has weight 1/16.', 'Compute 10/16 = 5/8 = 0.625.', 'Check: A is a single hexadecimal digit. It does not mean the decimal fraction 0.10.'],
    concept: 'Hexadecimal digits and fractions'
  },
  {
    id: 'f2-03', module: 'fractions-2', level: 'foundation', type: 'short',
    prompt: 'Convert 0.101011₂ to octal. Omit the base suffix.',
    answer: '0.53', accept: ['0.53', '.53', '0.530', '.530'],
    steps: ['One octal digit corresponds to three binary bits because 8 = 2³.', 'Starting at the binary point, group to the right: 0.101 011₂.', 'Convert each group: 101₂ = 5 and 011₂ = 3.', 'Therefore the answer is 0.53₈. Check: groups begin at the point, not at the far-right end of the whole number.'],
    concept: 'Three-bit binary-to-octal grouping'
  },
  {
    id: 'f2-04', module: 'fractions-2', level: 'foundation', type: 'mcq',
    prompt: 'Which hexadecimal fraction equals 0.1101₂?',
    options: ['0.B₁₆', '0.13₁₆', '0.C₁₆', '0.D₁₆'], answer: '0.D₁₆',
    steps: ['One hexadecimal fractional digit corresponds to four binary fractional bits.', 'The four-bit group 1101 has integer value 8 + 4 + 0 + 1 = 13.', 'Hexadecimal represents digit value 13 by D.', 'Thus 0.1101₂ = 0.D₁₆. Check: 13/16 = 0.8125 in both bases.'],
    concept: 'Four-bit binary-to-hexadecimal grouping'
  },
  {
    id: 'f2-05', module: 'fractions-2', level: 'practice', type: 'short',
    prompt: 'Convert 12.34₈ to decimal. Enter the exact decimal result.',
    answer: '10.4375', accept: ['10.4375'],
    steps: ['Assign octal weights: 8¹, 8⁰, 8⁻¹, and 8⁻².', 'The integer part is 1×8 + 2×1 = 10.', 'The fractional part is 3/8 + 4/64 = 0.375 + 0.0625 = 0.4375.', 'Add the parts: 10.4375. Check: the second fractional digit is divided by 64, not 16.'],
    concept: 'Weighted octal expansion'
  },
  {
    id: 'f2-06', module: 'fractions-2', level: 'practice', type: 'short',
    prompt: 'Convert 2F.8₁₆ to decimal.',
    answer: '47.5', accept: ['47.5', '47.50'],
    steps: ['Replace hexadecimal F with decimal 15.', 'The integer part is 2×16 + 15×1 = 47.', 'The fraction is 8×16⁻¹ = 8/16 = 0.5.', 'The total is 47.5. Check: hexadecimal digit 8 in the first fractional place has value one-half, not eight-tenths.'],
    concept: 'Weighted hexadecimal expansion'
  },
  {
    id: 'f2-07', module: 'fractions-2', level: 'practice', type: 'short',
    prompt: 'Convert decimal 26.6875 to hexadecimal. Omit the base suffix.',
    answer: '1A.B', accept: ['1A.B', '1a.b', '1A.B0', '1a.b0'],
    steps: ['For the integer part, 26 ÷ 16 gives quotient 1 and remainder 10, written A.', 'Thus the integer part is 1A₁₆.', 'For the fraction, 0.6875×16 = 11 exactly. Digit 11 is B, and no fractional remainder remains.', 'Combine the parts: 1A.B₁₆. Check: 16 + 10 + 11/16 = 26.6875.'],
    concept: 'Decimal-to-hexadecimal conversion'
  },
  {
    id: 'f2-08', module: 'fractions-2', level: 'practice', type: 'mcq',
    prompt: 'When converting octal 0.3₈ to binary, which result preserves the fractional place values?',
    options: ['0.11₂', '0.011₂', '0.0011₂', '0.3₂'], answer: '0.011₂',
    steps: ['Each octal digit must become a full three-bit group.', 'Octal digit 3 becomes binary 011, so 0.3₈ becomes 0.011₂.', 'Verify: 3/8 = 1/4 + 1/8 = 0.375.', 'Check: removing the leading zero after the point changes 0.011₂ into 0.11₂ = 0.75. Leading zeros inside fractional groups preserve position.'],
    concept: 'Padding fractional groups correctly'
  },
  {
    id: 'f2-09', module: 'fractions-2', level: 'exam', type: 'short',
    prompt: 'Convert A.BC₁₆ to binary, retaining all four bits for each hexadecimal digit. Omit the base suffix.',
    answer: '1010.10111100', accept: ['1010.10111100'],
    steps: ['Convert A to four bits: 1010.', 'Convert B to four bits: 1011. Convert C to four bits: 1100.', 'Keep the point in place and concatenate the groups: 1010.1011 1100₂.', 'The required answer is 1010.10111100. Check: 10 + 11/16 + 12/256 = 10.734375 in either representation.'],
    concept: 'Multi-digit hexadecimal fractions'
  },
  {
    id: 'f2-10', module: 'fractions-2', level: 'exam', type: 'short',
    prompt: 'Add 0.1011₂ + 0.011₂. Give the exact binary sum without a base suffix.',
    answer: '1.0001', accept: ['1.0001', '01.0001', '1.00010'],
    steps: ['Align the points and pad the second fraction: 0.1011 + 0.0110.', 'In sixteenths, the operands are 11/16 and 6/16.', 'Their sum is 17/16 = 1 + 1/16.', 'Write that sum in binary: 1.0001₂. Check: a carry can cross the binary point into the integer part.'],
    concept: 'Binary fractional addition and carries'
  },
  {
    id: 'f2-11', module: 'fractions-2', level: 'exam', type: 'short',
    prompt: 'Subtract 0.111₂ from 1.01₂. Give the exact binary result without a base suffix.',
    answer: '0.011', accept: ['0.011', '.011', '0.0110', '.0110'],
    steps: ['Align the binary points: 1.010₂ − 0.111₂.', 'Use eighths to check the subtraction: 1.010₂ = 10/8, while 0.111₂ = 7/8.', 'Subtract: 10/8 − 7/8 = 3/8.', 'Since 3/8 = 1/4 + 1/8, the answer is 0.011₂. Check: the padded zero in 1.010 does not change its value.'],
    concept: 'Binary fractional subtraction'
  },
  {
    id: 'f2-12', module: 'fractions-2', level: 'exam', type: 'mcq',
    prompt: 'Multiply 0.1₂ by 0.11₂. Which exact result is correct?',
    options: ['0.11₂', '0.0011₂', '0.011₂', '0.111₂'], answer: '0.011₂',
    steps: ['The operands represent 1/2 and 3/4.', 'Multiply: (1/2)×(3/4) = 3/8.', 'Alternatively, multiply the digit strings 1×11 = 11₂, then allow three fractional places in total.', 'The result is 0.011₂. Check: multiplying a positive number by 1/2 halves it, so the answer must be below 0.11₂.'],
    concept: 'Binary fractional multiplication'
  },
  {
    id: 'lg-01', module: 'logic-gates', level: 'foundation', type: 'mcq',
    prompt: 'For a two-input AND gate, when is the output 1?',
    options: ['When at least one input is 1', 'Only when both inputs are 1', 'Only when the inputs differ', 'Only when both inputs are 0'],
    answer: 'Only when both inputs are 1',
    steps: ['AND means every required condition must be true.', 'Evaluate the four input pairs: 00→0, 01→0, 10→0, 11→1.', 'Only input pair 11 produces output 1.', 'Check: at least one input being 1 describes OR; different inputs describes XOR.'],
    concept: 'AND gate truth table'
  },
  {
    id: 'lg-02', module: 'logic-gates', level: 'foundation', type: 'mcq',
    prompt: 'With inputs A = 1 and B = 1, what are the outputs of OR and XOR respectively?',
    options: ['0 and 1', '1 and 1', '0 and 0', '1 and 0'], answer: '1 and 0',
    steps: ['OR produces 1 when at least one input is 1, including when both are 1.', 'XOR produces 1 when exactly one of two inputs is 1.', 'For inputs 11, OR = 1 and XOR = 0.', 'Check: the word exclusive excludes the both-true case from XOR.'],
    concept: 'Inclusive OR versus exclusive OR'
  },
  {
    id: 'lg-03', module: 'logic-gates', level: 'foundation', type: 'mcq',
    prompt: 'A two-input NAND gate receives A = 1 and B = 0. What is its output?',
    options: ['1', '0', '10', 'It cannot be determined'], answer: '1',
    steps: ['NAND means NOT of AND.', 'First evaluate AND: 1 AND 0 = 0.', 'Invert that intermediate result: NOT 0 = 1.', 'Check: NAND is 0 only for input pair 11. It does not invert each input separately and then AND them.'],
    concept: 'NAND as an inverted AND'
  },
  {
    id: 'lg-04', module: 'logic-gates', level: 'foundation', type: 'short',
    prompt: 'What single-bit output does a NOT gate produce when its input is 0?',
    answer: '1', accept: ['1'],
    steps: ['A NOT gate complements one input bit.', 'Complementing 0 produces 1; complementing 1 produces 0.', 'Therefore NOT 0 = 1.', 'Check: NOT has one logical input; AND and OR need at least two in the basic gate model.'],
    concept: 'Inversion'
  },
  {
    id: 'lg-05', module: 'logic-gates', level: 'practice', type: 'mcq',
    prompt: 'List the XOR output bits for input rows AB = 00, 01, 10, 11, in that order.',
    options: ['0001', '0111', '0110', '1001'], answer: '0110',
    steps: ['For 00, the inputs are equal, so XOR = 0.', 'For 01 and 10, the inputs differ, so each XOR output is 1.', 'For 11, the inputs are equal, so XOR = 0.', 'Read down the stated row order: 0, 1, 1, 0 → 0110. Check: 1001 is XNOR; 0111 is OR.'],
    concept: 'Truth-table row ordering'
  },
  {
    id: 'lg-06', module: 'logic-gates', level: 'practice', type: 'short',
    prompt: 'Evaluate F = (A AND B) OR (NOT C) for A = 1, B = 0, C = 0. Enter 0 or 1.',
    answer: '1', accept: ['1'],
    steps: ['Evaluate the AND branch: A AND B = 1 AND 0 = 0.', 'Evaluate the inverter branch: NOT C = NOT 0 = 1.', 'Combine the two branch outputs with OR: 0 OR 1 = 1.', 'Thus F = 1. Check: invert C before the final OR, because the NOT applies only to C.'],
    concept: 'Evaluating a multi-gate circuit'
  },
  {
    id: 'lg-07', module: 'logic-gates', level: 'practice', type: 'mcq',
    prompt: 'A two-input NAND gate feeds a NOT gate. What single gate has the same overall function?',
    options: ['AND', 'OR', 'NOR', 'XOR'], answer: 'AND',
    steps: ['The NAND stage produces NOT(A AND B).', 'The second stage inverts that result: NOT(NOT(A AND B)).', 'Two inversions cancel, leaving A AND B.', 'Check: an output bubble represents inversion. Two consecutive output inversions restore the original AND behavior.'],
    concept: 'Double inversion and gate equivalence'
  },
  {
    id: 'lg-08', module: 'logic-gates', level: 'practice', type: 'short',
    prompt: 'Apply XNOR independently to corresponding bits of 1010 and 1100. Enter the four output bits, including leading zeros if any.',
    answer: '1001', accept: ['1001'],
    steps: ['XNOR outputs 1 for equal input bits and 0 for unequal bits.', 'From left to right: (1,1)→1, (0,1)→0, (1,0)→0, (0,0)→1.', 'Join the four results: 1001.', 'Check: XOR would produce 0110; XNOR is its bitwise complement for the same inputs.'],
    concept: 'Bitwise XNOR as an equality test'
  },
  {
    id: 'lg-09', module: 'logic-gates', level: 'exam', type: 'mcq',
    prompt: 'For F = (A OR B) AND (NOT A), list the outputs for AB = 00, 01, 10, 11, in that order.',
    options: ['0110', '0010', '0111', '0100'], answer: '0100',
    steps: ['For 00: (0 OR 0) AND 1 = 0.', 'For 01: (0 OR 1) AND 1 = 1.', 'For 10 and 11, NOT A = 0, so the final AND forces F = 0 in both cases.', 'The output column is 0100. Check algebraically: (A + B)A′ = AA′ + BA′ = A′B.'],
    concept: 'Deriving a truth table from a circuit expression'
  },
  {
    id: 'lg-10', module: 'logic-gates', level: 'exam', type: 'mcq',
    prompt: 'A half-adder uses S = A XOR B and C = A AND B. For A = 1 and B = 1, what are (S, C)?',
    options: ['(1, 0)', '(0, 1)', '(1, 1)', '(0, 0)'], answer: '(0, 1)',
    steps: ['The sum output S = 1 XOR 1 = 0 because the inputs are equal.', 'The carry output C = 1 AND 1 = 1.', 'Therefore (S, C) = (0, 1).', 'Check by arithmetic: 1₂ + 1₂ = 10₂. Read the result as carry then sum, CS = 10; the question asks for the tuple in S, C order.'],
    concept: 'Half-adder sum and carry'
  },
  {
    id: 'lg-11', module: 'logic-gates', level: 'exam', type: 'mcq',
    prompt: 'How can one two-input NAND gate implement NOT A?',
    options: ['Connect one input to A and the other to 0', 'Leave one input unconnected', 'Connect both inputs to A', 'Connect both inputs to 0'],
    answer: 'Connect both inputs to A',
    steps: ['Connect A to both NAND inputs to obtain NOT(A AND A).', 'By the idempotent law, A AND A = A.', 'The output is therefore NOT A.', 'Check: tying the other input to 0 would force the NAND output to 1. A floating input is not a dependable logic value.'],
    concept: 'NAND as a universal gate'
  },
  {
    id: 'lg-12', module: 'logic-gates', level: 'exam', type: 'mcq',
    prompt: 'For F = (A AND B) OR ((NOT A) AND C), list outputs for ABC = 000, 001, 010, 011, 100, 101, 110, 111, in that order.',
    options: ['01010011', '00110101', '00011111', '10101100'], answer: '01010011',
    steps: ['When A = 0, the AB branch is 0 and the A′C branch equals C.', 'Thus rows 000, 001, 010, 011 produce 0, 1, 0, 1.', 'When A = 1, the A′C branch is 0 and AB equals B.', 'Thus rows 100, 101, 110, 111 produce 0, 0, 1, 1.', 'Concatenate the two groups: 01010011. Check: this expression behaves as a multiplexer, selecting C for A = 0 and B for A = 1.'],
    concept: 'Three-input truth tables and selection'
  },
  {
    id: 'bc-01', module: 'binary-codes', level: 'foundation', type: 'short',
    prompt: 'Encode decimal 59 in standard 8421 BCD. Enter two four-bit groups, separated by a space.',
    answer: '0101 1001', accept: ['0101 1001', '01011001'],
    steps: ['BCD encodes each decimal digit separately, using four bits per digit.', 'Decimal digit 5 becomes 0101, and decimal digit 9 becomes 1001.', 'Keep the decimal digit order: 0101 1001.', 'Check: converting the entire number 59 to ordinary binary gives 111011, which is a different representation.'],
    concept: 'Digitwise BCD encoding'
  },
  {
    id: 'bc-02', module: 'binary-codes', level: 'foundation', type: 'mcq',
    prompt: 'Which four-bit group is invalid as one standard 8421 BCD digit?',
    options: ['1001', '0101', '0000', '1010'], answer: '1010',
    steps: ['One BCD digit represents a decimal digit from 0 through 9.', 'The valid groups range from 0000 through 1001.', 'Group 1010 has binary value 10, so it cannot encode a single decimal digit.', 'Check: 1010 through 1111 are unused for individual standard BCD digits, although they are valid ordinary binary values.'],
    concept: 'Valid and unused BCD codewords'
  },
  {
    id: 'bc-03', module: 'binary-codes', level: 'foundation', type: 'mcq',
    prompt: 'Which pair correctly gives decimal 12 in ordinary binary and then in 8421 BCD?',
    options: ['1100; 0001 0010', '0001 0010; 1100', '1010; 0001 0010', '1100; 0000 1100'],
    answer: '1100; 0001 0010',
    steps: ['For ordinary binary, 12 = 8 + 4, so its bit string is 1100.', 'For BCD, encode decimal digit 1 as 0001 and digit 2 as 0010.', 'The requested pair is 1100; 0001 0010.', 'Check: BCD does not place the entire value 12 in a single four-bit digit; 1100 is not a valid BCD digit.'],
    concept: 'BCD versus positional binary'
  },
  {
    id: 'bc-04', module: 'binary-codes', level: 'foundation', type: 'mcq',
    prompt: 'What are the bit weights from left to right in a standard 8421 BCD digit?',
    options: ['1, 2, 4, 8', '8, 4, 2, 1', '8, 4, 2, 0', '16, 8, 4, 2'], answer: '8, 4, 2, 1',
    steps: ['A four-bit natural binary group uses powers 2³, 2², 2¹, and 2⁰.', 'Those powers are 8, 4, 2, and 1 from the most significant bit to the least significant bit.', 'That weighting gives the code its name: 8421 BCD.', 'Check: the restriction to decimal digits 0–9 is separate from these bit weights.'],
    concept: 'Weighted codes'
  },
  {
    id: 'bc-05', module: 'binary-codes', level: 'practice', type: 'short',
    prompt: 'Encode decimal digit 7 in Excess-3. Enter exactly four bits.',
    answer: '1010', accept: ['1010'],
    steps: ['For Excess-3, add decimal 3 to the digit before writing a four-bit binary group.', 'Compute 7 + 3 = 10.', 'Decimal 10 in four-bit binary is 1010.', 'Check: ordinary BCD for 7 is 0111; Excess-3 deliberately shifts the value by 3.'],
    concept: 'Excess-3 encoding'
  },
  {
    id: 'bc-06', module: 'binary-codes', level: 'practice', type: 'short',
    prompt: 'Decode the Excess-3 digit 0110. Enter the represented decimal digit.',
    answer: '3', accept: ['3'],
    steps: ['Read the four-bit group as ordinary binary: 0110₂ = 6.', 'Excess-3 stores the digit plus 3, so decoding subtracts 3.', 'Compute 6 − 3 = 3.', 'Check: 6 is the stored binary value, not the decimal digit being represented.'],
    concept: 'Excess-3 decoding'
  },
  {
    id: 'bc-07', module: 'binary-codes', level: 'practice', type: 'short',
    prompt: 'What parity bit must be appended to data 1011001 to make the total number of 1s odd? Enter 0 or 1.',
    answer: '1', accept: ['1'],
    steps: ['Count the data 1s: 1 + 0 + 1 + 1 + 0 + 0 + 1 = 4.', 'Four is even, but the full word must contain an odd number of 1s.', 'Append parity bit 1 to make the total 5.', 'Check: the parity bit participates in the count. Odd parity does not mean the parity bit itself is always 1.'],
    concept: 'Odd parity generation'
  },
  {
    id: 'bc-08', module: 'binary-codes', level: 'practice', type: 'short',
    prompt: 'What parity bit must be appended to data 1011011 to make the total number of 1s even? Enter 0 or 1.',
    answer: '1', accept: ['1'],
    steps: ['Count the 1s in 1011011: there are 5.', 'Five is odd, so one additional 1 makes the total even.', 'The required parity bit is 1, giving 6 total 1s.', 'Check: even parity describes the entire protected word, including the parity bit; it does not force the parity bit to be 0.'],
    concept: 'Even parity generation'
  },
  {
    id: 'bc-09', module: 'binary-codes', level: 'exam', type: 'mcq',
    prompt: 'Add the BCD digits 8 and 7. After the necessary BCD correction, what is the two-digit BCD result?',
    options: ['1111', '0001 1111', '0001 0101', '0000 1111'], answer: '0001 0101',
    steps: ['The uncorrected binary sum is 1000 + 0111 = 1111, which has value 15.', 'Because the low four-bit result exceeds 1001, add the BCD correction 0110.', '1111 + 0110 = 1 0101: carry 1 into the tens digit and keep 0101 in the ones digit.', 'Represent both decimal digits with four bits: 0001 0101, meaning decimal 15.', 'Check: 1111 is not a valid BCD digit. The correction changes the encoding, not the arithmetic value 8 + 7 = 15.'],
    concept: 'BCD addition correction'
  },
  {
    id: 'bc-10', module: 'binary-codes', level: 'exam', type: 'short',
    prompt: 'The ASCII code for uppercase A is decimal 65. Write this value as an eight-bit byte with a leading 0.',
    answer: '01000001', accept: ['01000001'],
    steps: ['Use the supplied code value 65; character codes map a symbol to a number.', 'Decompose 65 = 64 + 1 = 2⁶ + 2⁰.', 'In the eight-bit positions 128, 64, 32, 16, 8, 4, 2, 1, set only the 64 and 1 positions.', 'The byte is 01000001. Check: seven-bit ASCII needs only 1000001; the requested eight-bit representation adds a leading zero.'],
    concept: 'Character codes and byte representation'
  },
  {
    id: 'bc-11', module: 'binary-codes', level: 'exam', type: 'mcq',
    prompt: 'For a word protected by one parity bit, which statement is correct if bit flips occur anywhere in that word?',
    options: ['Every nonzero even number of bit flips is detected', 'Every odd number of bit flips is detected, but an even number can go undetected', 'The parity bit identifies which bit is wrong', 'Parity guarantees automatic correction of one flipped bit'],
    answer: 'Every odd number of bit flips is detected, but an even number can go undetected',
    steps: ['Flipping any one bit toggles the parity of the total number of 1s.', 'An odd number of flips toggles the total parity overall, so the parity check fails.', 'An even number toggles parity an even number of times, returning it to its original state; those errors are not detected by parity alone.', 'Check: a single parity check signals an inconsistency but cannot locate or correct the bad bit.'],
    concept: 'Capabilities and limits of a parity check'
  },
  {
    id: 'bc-12', module: 'binary-codes', level: 'exam', type: 'mcq',
    prompt: 'An Excess-3 digit is 0111. What decimal digit is represented by its bitwise complement?',
    options: ['8', '4', '2', '5'], answer: '5',
    steps: ['Complement each bit of 0111 to get 1000.', 'Read 1000 as binary 8, then subtract the Excess-3 bias: 8 − 3 = 5.', 'The original code 0111 represented 7 − 3 = 4.', 'Check: 5 is the 9’s complement of 4. In general, complementing an Excess-3 digit for d gives 15 − (d + 3) − 3 = 9 − d.'],
    concept: 'Self-complementing Excess-3 code'
  },
  {
    id: 'ba-01', module: 'boolean-algebra', level: 'foundation', type: 'mcq',
    prompt: 'In Boolean algebra, + means OR. Simplify A + 0.',
    options: ['0', '1', 'A', 'A′'], answer: 'A',
    steps: ['OR with 0 adds no true condition.', 'If A = 0, then 0 + 0 = 0. If A = 1, then 1 + 0 = 1.', 'The output always equals A, so A + 0 = A.', 'Check: A·0 = 0 is the AND law; do not exchange the OR and AND rules.'],
    concept: 'OR identity law'
  },
  {
    id: 'ba-02', module: 'boolean-algebra', level: 'foundation', type: 'short',
    prompt: 'In Boolean algebra, · means AND. Simplify A·A. Enter A, 0, or 1.',
    answer: 'A', accept: ['A', 'a'],
    steps: ['Evaluate both possible inputs: 0·0 = 0 and 1·1 = 1.', 'The output therefore matches A.', 'Thus A·A = A, the idempotent law.', 'Check: Boolean values are 0 and 1; repeated AND does not produce an ordinary algebraic A² term that needs to remain in the result.'],
    concept: 'AND idempotent law'
  },
  {
    id: 'ba-03', module: 'boolean-algebra', level: 'foundation', type: 'mcq',
    prompt: 'A′ means NOT A, and + means OR. Simplify A + A′.',
    options: ['1', '0', 'A', 'A′'], answer: '1',
    steps: ['If A = 0, then A′ = 1, so A + A′ = 1.', 'If A = 1, then A′ = 0, so A + A′ = 1 again.', 'The expression is always 1: this is the complement law for OR.', 'Check: the companion AND law is A·A′ = 0.'],
    concept: 'Complement laws'
  },
  {
    id: 'ba-04', module: 'boolean-algebra', level: 'foundation', type: 'mcq',
    prompt: 'Without parentheses, what is the usual evaluation precedence for Boolean NOT, AND, and OR?',
    options: ['OR, then AND, then NOT', 'AND, then OR, then NOT', 'All three always left to right', 'NOT, then AND, then OR'],
    answer: 'NOT, then AND, then OR',
    steps: ['First complement the expressions directly marked by NOT.', 'Then evaluate AND operations.', 'Finally evaluate OR operations; parentheses can override this order.', 'Check: A + BC means A OR (B AND C), not (A OR B) AND C. Explicit parentheses are useful when a notation might be ambiguous.'],
    concept: 'Boolean operator precedence'
  },
  {
    id: 'ba-05', module: 'boolean-algebra', level: 'practice', type: 'short',
    prompt: 'Simplify A + A·B to a single variable.',
    answer: 'A', accept: ['A', 'a'],
    steps: ['Factor A: A + AB = A(1 + B).', 'In Boolean algebra, 1 + B = 1.', 'Therefore A(1 + B) = A·1 = A.', 'Check by cases: A = 1 already forces the OR to 1; A = 0 makes both terms 0. The AB term adds no new true input case.'],
    concept: 'Absorption law'
  },
  {
    id: 'ba-06', module: 'boolean-algebra', level: 'practice', type: 'short',
    prompt: 'Simplify A·(A + B) to a single variable.',
    answer: 'A', accept: ['A', 'a'],
    steps: ['Distribute AND over OR: A(A + B) = AA + AB.', 'Use AA = A to get A + AB.', 'Apply absorption: A + AB = A.', 'Check: when A = 0 the first AND input forces 0; when A = 1 the parenthesized OR is 1. Thus the output always equals A.'],
    concept: 'Dual absorption law'
  },
  {
    id: 'ba-07', module: 'boolean-algebra', level: 'practice', type: 'mcq',
    prompt: 'Use De Morgan’s law to rewrite (A + B)′.',
    options: ['A′ + B′', 'A′·B′', 'A·B', 'A′ + B'], answer: 'A′·B′',
    steps: ['Complementing an OR requires both inputs to be false.', 'De Morgan’s law changes OR to AND and complements each operand.', 'Therefore (A + B)′ = A′·B′.', 'Check: both the operator and the operand complements must change. A′ + B′ is the complement of AB, not of A + B.'],
    concept: 'De Morgan’s law for OR'
  },
  {
    id: 'ba-08', module: 'boolean-algebra', level: 'practice', type: 'short',
    prompt: 'Simplify A·B + A·B′ to a single variable.',
    answer: 'A', accept: ['A', 'a'],
    steps: ['Factor the common variable A: AB + AB′ = A(B + B′).', 'Apply the complement law B + B′ = 1.', 'Apply the identity A·1 = A.', 'Check: the two terms cover both possible values of B whenever A = 1, so B does not affect the final output.'],
    concept: 'Factoring complementary terms'
  },
  {
    id: 'ba-09', module: 'boolean-algebra', level: 'exam', type: 'mcq',
    prompt: 'Simplify (A + B)·(A + B′).',
    options: ['B', 'A + B', '1', 'A'], answer: 'A',
    steps: ['Distribute to obtain AA + AB′ + AB + BB′.', 'Use AA = A and BB′ = 0, giving A + AB′ + AB.', 'Use absorption on the remaining terms: A + AB′ = A and A + AB = A.', 'Thus the expression reduces to A. Check alternatively: (X + Y)(X + Z) = X + YZ, so the result is A + BB′ = A.'],
    concept: 'Product-of-sums simplification'
  },
  {
    id: 'ba-10', module: 'boolean-algebra', level: 'exam', type: 'mcq',
    prompt: 'Which gate function equals A′·B + A·B′?',
    options: ['XOR', 'XNOR', 'AND', 'OR'], answer: 'XOR',
    steps: ['The term A′B is true only for AB = 01.', 'The term AB′ is true only for AB = 10.', 'Their OR is true exactly when the inputs differ, which is XOR.', 'Check: XNOR is true for equal inputs and has expression AB + A′B′. OR would also be true for 11.'],
    concept: 'Sum-of-products form of XOR'
  },
  {
    id: 'ba-11', module: 'boolean-algebra', level: 'exam', type: 'mcq',
    prompt: 'Let F(A,B,C) = Σm(1,3,5,7), with A the most significant bit and C the least significant bit of each minterm index. What is the simplest expression?',
    options: ['A', 'B', 'C', 'C′'], answer: 'C',
    steps: ['Write the listed indices in ABC binary: 1 = 001, 3 = 011, 5 = 101, 7 = 111.', 'Every listed row has C = 1, while A and B take all four possible pairs.', 'No row with C = 0 is listed, so F = 0 whenever C = 0.', 'Thus F = C. Check: a variable can be eliminated only because both of its values are covered without changing the output.'],
    concept: 'Minterms and variable elimination'
  },
  {
    id: 'ba-12', module: 'boolean-algebra', level: 'exam', type: 'mcq',
    prompt: 'Simplify F = A·B + A′·C + B·C using the consensus theorem.',
    options: ['A·B + B·C', 'A·B + A′·C', 'A′·C + B·C', 'B + C'], answer: 'A·B + A′·C',
    steps: ['The terms AB and A′C differ in the complemented variable A; their consensus term is BC.', 'When BC = 1, both B and C equal 1.', 'If A = 1 then AB = 1; if A = 0 then A′C = 1. Thus every case made true by BC is already covered.', 'BC is redundant, so F = AB + A′C.', 'Check: this removes the consensus term only. Removing either AB or A′C loses cases such as ABC = 110 or 001 respectively.'],
    concept: 'Consensus theorem and redundant terms'
  },
  {
    id: 'gc-01', module: 'gray-code', level: 'foundation', type: 'mcq',
    prompt: 'What is the defining adjacency property of the standard binary-reflected Gray code sequence?',
    options: ['Every codeword contains one 1', 'Every adjacent pair has the same parity', 'The codeword is always its ordinary binary value', 'Adjacent codewords differ in exactly one bit'],
    answer: 'Adjacent codewords differ in exactly one bit',
    steps: ['Compare successive positions in a binary-reflected Gray code sequence.', 'Exactly one bit changes at each step; this is Hamming distance 1.', 'This limits multi-bit transition ambiguity in applications such as position encoding.', 'Check: the number of 1s is not fixed, and Gray codewords generally differ from ordinary binary representations of the same position.'],
    concept: 'Unit-distance coding'
  },
  {
    id: 'gc-02', module: 'gray-code', level: 'foundation', type: 'short',
    prompt: 'Convert binary 1011 to standard binary-reflected Gray code. Enter exactly four bits.',
    answer: '1110', accept: ['1110'],
    steps: ['Copy the binary most significant bit: the first Gray bit is 1.', 'Each remaining Gray bit is the XOR of adjacent original binary bits.', 'Compute 1 XOR 0 = 1, 0 XOR 1 = 1, and 1 XOR 1 = 0.', 'Combine the results: 1110. Check: use adjacent binary bits, not the Gray bit you just produced.'],
    concept: 'Binary-to-Gray adjacent XOR rule'
  },
  {
    id: 'gc-03', module: 'gray-code', level: 'foundation', type: 'short',
    prompt: 'Convert Gray code 1101 to ordinary binary. Enter exactly four bits.',
    answer: '1001', accept: ['1001'],
    steps: ['Copy the most significant Gray bit: the first binary bit is 1.', 'XOR the previous binary bit with the next Gray bit: 1 XOR 1 = 0.', 'Continue with the new binary bit: 0 XOR 0 = 0, then 0 XOR 1 = 1.', 'The result is 1001. Check: Gray-to-binary uses a running XOR, not simply adjacent Gray bits.'],
    concept: 'Gray-to-binary prefix XOR rule'
  },
  {
    id: 'gc-04', module: 'gray-code', level: 'foundation', type: 'mcq',
    prompt: 'Why is standard binary-reflected Gray code called a non-weighted code?',
    options: ['Every bit has weight zero', 'Its bits do not have fixed positional weights that can simply be summed to obtain the represented value', 'It cannot represent zero', 'It uses fewer than two symbols'],
    answer: 'Its bits do not have fixed positional weights that can simply be summed to obtain the represented value',
    steps: ['Ordinary binary assigns fixed place weights such as 8, 4, 2, and 1.', 'Gray code is arranged around single-bit transitions rather than those positional weights.', 'For example, Gray 110 represents sequence position 4, while ordinary binary 110 represents 6.', 'Check: to recover the position value, convert Gray to binary first. Non-weighted does not mean that the code carries no information.'],
    concept: 'Weighted versus non-weighted codes'
  },
  {
    id: 'gc-05', module: 'gray-code', level: 'practice', type: 'short',
    prompt: 'Convert binary 0110 to four-bit standard binary-reflected Gray code. Preserve the leading zero.',
    answer: '0101', accept: ['0101'],
    steps: ['Copy the binary most significant bit 0.', 'Compute adjacent binary XORs: 0 XOR 1 = 1, 1 XOR 1 = 0, 1 XOR 0 = 1.', 'The Gray word is 0101.', 'Check with the shift formula: 0110 XOR 0011 = 0101. The right shift inserts a leading zero.'],
    concept: 'Binary-to-Gray conversion with leading zeros'
  },
  {
    id: 'gc-06', module: 'gray-code', level: 'practice', type: 'short',
    prompt: 'Convert four-bit Gray code 1010 to ordinary binary.',
    answer: '1100', accept: ['1100'],
    steps: ['Copy the first bit: b₃ = 1.', 'Then b₂ = b₃ XOR g₂ = 1 XOR 0 = 1.', 'Next b₁ = b₂ XOR g₁ = 1 XOR 1 = 0, and b₀ = b₁ XOR g₀ = 0 XOR 0 = 0.', 'The binary result is 1100. Check by re-encoding: 1100 XOR 0110 = 1010.'],
    concept: 'Running-XOR decoding'
  },
  {
    id: 'gc-07', module: 'gray-code', level: 'practice', type: 'mcq',
    prompt: 'The standard three-bit reflected Gray sequence starts 000, 001, 011, 010. Which codeword comes next?',
    options: ['110', '100', '111', '101'], answer: '110',
    steps: ['The listed four codewords correspond to binary positions 0, 1, 2, and 3.', 'The next position is 4, whose three-bit binary representation is 100.', 'Encode it: 100 XOR 010 = 110.', 'Check: the transition 010→110 changes only the most significant bit. The reflected construction starts its second half with 1 followed by the previous half in reverse.'],
    concept: 'Reflected Gray sequence construction'
  },
  {
    id: 'gc-08', module: 'gray-code', level: 'practice', type: 'mcq',
    prompt: 'What is the Hamming distance between bit strings 0111 and 0101?',
    options: ['0', '2', '3', '1'], answer: '1',
    steps: ['Hamming distance counts positions containing different bits.', 'Compare left to right: 0 = 0, 1 = 1, 1 differs from 0, and 1 = 1.', 'Only one position differs, so the distance is 1.', 'Check: Hamming distance is a count of differing positions, not the arithmetic difference between the represented integers.'],
    concept: 'Measuring bit changes'
  },
  {
    id: 'gc-09', module: 'gray-code', level: 'exam', type: 'short',
    prompt: 'Convert five-bit binary 10101 to standard binary-reflected Gray code.',
    answer: '11111', accept: ['11111'],
    steps: ['Keep the first binary bit 1 as the first Gray bit.', 'Every adjacent pair in 10101 differs: 1 XOR 0, 0 XOR 1, 1 XOR 0, and 0 XOR 1 all equal 1.', 'The Gray code is therefore 11111.', 'Check with the independent shift method: 10101 XOR 01010 = 11111. A string of Gray 1s does not represent the largest unsigned binary number.'],
    concept: 'Five-bit binary-to-Gray conversion'
  },
  {
    id: 'gc-10', module: 'gray-code', level: 'exam', type: 'short',
    prompt: 'Decode five-bit Gray code 10010 to ordinary binary.',
    answer: '11100', accept: ['11100'],
    steps: ['Copy the first bit: 1.', 'Take running XORs from left to right: 1 XOR 0 = 1; 1 XOR 0 = 1.', 'Continue: 1 XOR 1 = 0; 0 XOR 0 = 0.', 'The binary word is 11100, which is decimal 28.', 'Check by re-encoding: 11100 XOR 01110 = 10010. Using adjacent Gray bits instead would give the wrong decoder.'],
    concept: 'Five-bit Gray decoding and inverse check'
  },
  {
    id: 'gc-11', module: 'gray-code', level: 'exam', type: 'mcq',
    prompt: 'Which transition cannot occur between adjacent positions in a standard four-bit cyclic binary-reflected Gray sequence?',
    options: ['0010 → 0110', '0001 → 0110', '0111 → 0101', '1101 → 1111'],
    answer: '0001 → 0110',
    steps: ['An adjacent transition must change exactly one bit.', 'Compute XORs to locate changes: 0010 XOR 0110 = 0100; 0111 XOR 0101 = 0010; 1101 XOR 1111 = 0010. Each has one 1.', 'But 0001 XOR 0110 = 0111, which has three 1s, so that transition changes three bits.', 'Thus 0001→0110 cannot be adjacent. The other listed pairs are adjacent in the standard reflected sequence.', 'Check: one-bit distance is necessary for adjacency, but by itself does not prove adjacency for every possible pair in a particular Gray ordering.'],
    concept: 'Valid Gray transitions and Hamming distance'
  },
  {
    id: 'gc-12', module: 'gray-code', level: 'exam', type: 'mcq',
    prompt: 'A five-bit position encoder uses standard binary-reflected Gray code. What codeword represents unsigned decimal position 23?',
    options: ['10111', '11010', '11111', '11100'], answer: '11100',
    steps: ['First convert the position to ordinary binary: 23 = 16 + 4 + 2 + 1 = 10111₂.', 'Shift that binary word right by one bit with a zero fill: 01011.', 'XOR the original and shifted words: 10111 XOR 01011 = 11100.', 'The encoder codeword is 11100. Check by prefix-XOR decoding: 1, 0, 1, 1, 1 recovers 10111₂ = 23.', 'Check the representation: outputting 10111 directly would give the binary position, not its Gray encoding.'],
    concept: 'Position value to Gray encoder word'
  }
];
