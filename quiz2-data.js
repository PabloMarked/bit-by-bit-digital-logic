/* Independently authored explanations for user-provided Quiz #2. */
window.QUIZ2_DATA = {
  "version": "1.0.0",
  "title": "Quiz #2: every conversion, fully worked",
  "intro": "Learn how each answer is built. Follow one small arithmetic move at a time, see why the move works, and check the result by converting it back.",
  "sourceNote": "The 15 question statements and supplied responses were provided by you in this chat. The teaching explanations, exact arithmetic, checks, and precision notes below are independently written additions. The supplied responses are not treated as a professor-verified answer key. Original lecture slide files have not been audited here.",
  "principles": [
    "A base conversion changes how a number is written, not how much it is worth.",
    "To convert a fraction from another base to decimal, multiply every digit by its place weight and add every contribution.",
    "To convert a decimal fraction to another base, repeatedly multiply the fractional remainder by the target base and record each whole-number part.",
    "Fractional digits from repeated multiplication are read from top to bottom. Reversing them is an integer-division habit and is incorrect for this method.",
    "The radix point is essential. Digits such as E8 can mean the fractional part of 0.E8 when a quiz blank implies the point; without that context E8 is a whole numeral.",
    "Keep exact intermediate values. A zero remainder means the conversion is finished exactly; append trailing zeros only when a stated number of places requires them."
  ],
  "notation": [
    {
      "term": "Base subscript",
      "explanation": "A small number such as ₂, ₈, ₁₀, or ₁₆ tells you the base used by the digits. 0.1₂ = 1/2, while 0.1₈ = 1/8."
    },
    {
      "term": "Radix point",
      "explanation": "The point separates whole-number positions from fractional positions. Keep the leading 0 when writing a complete fraction smaller than one."
    },
    {
      "term": "Negative power",
      "explanation": "b⁻ⁿ = 1/(bⁿ). For example, 8⁻² = 1/64. The value is positive; the negative exponent means reciprocal."
    },
    {
      "term": "Whole-number part",
      "explanation": "The nonnegative integer before the point in a product. In 14.5, the whole-number part is 14; the remaining fraction is 0.5."
    },
    {
      "term": "Remainder",
      "explanation": "For fractional conversion, subtract the recorded whole-number part from the product. Feed that remaining fraction, not the whole product, into the next multiplication."
    },
    {
      "term": "Hexadecimal letters",
      "explanation": "A = 10, B = 11, C = 12, D = 13, E = 14, F = 15. Each letter is a single hexadecimal digit."
    }
  ],
  "precisionGuide": [
    "Exact means no digits or value have been discarded. The exact decimal answers are shown first.",
    "Truncating means cutting off later digits. Rounding means choosing a nearby value using a stated rule.",
    "Question 9 distinguishes truncation from rounding: 0.7109375 truncates to 0.71093, but rounds to nearest five decimal places as 0.71094.",
    "Question 13 is a tie at five decimal places: 0.703125 becomes 0.70313 under round half up, and 0.70312 under ties to even. The prompt gives no rounding rule.",
    "Questions 3, 8, 10, 12, and 15 have supplied responses containing only fractional digits. Their digits match the exact conversions if the answer field implicitly supplies 0.; the complete numerals shown here include the point."
  ],
  "questions": [
    {
      "id": 1,
      "prompt": "Convert 0.527₈ to decimal.",
      "sourceBase": 8,
      "targetBase": 10,
      "input": "0.527",
      "supplied": "0.66992",
      "answer": "0.669921875",
      "method": "place-value",
      "setup": [
        "The source is base 8, so every step to the right of the radix point divides the place weight by 8.",
        "Negative powers mean reciprocals: 8⁻¹ = 1/8; 8⁻² = 1/64; 8⁻³ = 1/512. A negative exponent does not make the value negative.",
        "Multiply each digit by its place weight. Add all the resulting values to get the decimal value.",
        "To divide a fractional contribution into decimal digits, bring down a zero by multiplying the current remainder by 10; divide by the denominator to get the next digit, then keep the new remainder. Each row includes this optional long-division trace.",
        "Keep exact intermediate values. Rounding a term early can change the final answer."
      ],
      "rows": [
        {
          "position": "Fractional place 1",
          "digit": "5",
          "digitValue": 5,
          "power": -1,
          "denominator": 8,
          "weight": "0.125",
          "term": "5 × 8^(-1) = 5/8",
          "decimal": "0.625",
          "divisionSteps": [
            "Bring down 0: 5 × 10 = 50; digit 1 is 6; remainder = 50 − 6 × 8 = 2.",
            "Bring down 0: 2 × 10 = 20; digit 2 is 2; remainder = 20 − 2 × 8 = 4.",
            "Bring down 0: 4 × 10 = 40; digit 3 is 5; remainder = 40 − 5 × 8 = 0."
          ]
        },
        {
          "position": "Fractional place 2",
          "digit": "2",
          "digitValue": 2,
          "power": -2,
          "denominator": 64,
          "weight": "0.015625",
          "term": "2 × 8^(-2) = 2/64",
          "decimal": "0.03125",
          "divisionSteps": [
            "Bring down 0: 2 × 10 = 20; digit 1 is 0; remainder = 20 − 0 × 64 = 20.",
            "Bring down 0: 20 × 10 = 200; digit 2 is 3; remainder = 200 − 3 × 64 = 8.",
            "Bring down 0: 8 × 10 = 80; digit 3 is 1; remainder = 80 − 1 × 64 = 16.",
            "Bring down 0: 16 × 10 = 160; digit 4 is 2; remainder = 160 − 2 × 64 = 32.",
            "Bring down 0: 32 × 10 = 320; digit 5 is 5; remainder = 320 − 5 × 64 = 0."
          ]
        },
        {
          "position": "Fractional place 3",
          "digit": "7",
          "digitValue": 7,
          "power": -3,
          "denominator": 512,
          "weight": "0.001953125",
          "term": "7 × 8^(-3) = 7/512",
          "decimal": "0.013671875",
          "divisionSteps": [
            "Bring down 0: 7 × 10 = 70; digit 1 is 0; remainder = 70 − 0 × 512 = 70.",
            "Bring down 0: 70 × 10 = 700; digit 2 is 1; remainder = 700 − 1 × 512 = 188.",
            "Bring down 0: 188 × 10 = 1880; digit 3 is 3; remainder = 1880 − 3 × 512 = 344.",
            "Bring down 0: 344 × 10 = 3440; digit 4 is 6; remainder = 3440 − 6 × 512 = 368.",
            "Bring down 0: 368 × 10 = 3680; digit 5 is 7; remainder = 3680 − 7 × 512 = 96.",
            "Bring down 0: 96 × 10 = 960; digit 6 is 1; remainder = 960 − 1 × 512 = 448.",
            "Bring down 0: 448 × 10 = 4480; digit 7 is 8; remainder = 4480 − 8 × 512 = 384.",
            "Bring down 0: 384 × 10 = 3840; digit 8 is 7; remainder = 3840 − 7 × 512 = 256.",
            "Bring down 0: 256 × 10 = 2560; digit 9 is 5; remainder = 2560 − 5 × 512 = 0."
          ]
        }
      ],
      "steps": [
        {
          "title": "Read the number and its base",
          "explanation": "0.527₈ uses base 8. The point separates whole-number places on the left from fractional places on the right. We will calculate what every digit contributes, then add those contributions.",
          "math": "0.527₈ → decimal"
        },
        {
          "title": "Understand the place weights",
          "explanation": "The first place to the right is 1/8; the second is 1/64; the third is 1/512. Moving right divides the weight by 8 each time. On the left, the place next to the point has weight 1 and the next has weight 8.",
          "math": "… 8¹, 8⁰ . 8⁻¹, 8⁻², 8⁻³ …"
        },
        {
          "title": "Turn negative powers into fractions",
          "explanation": "For any positive n, 8⁻ⁿ means 1/(8ⁿ). Build each denominator by multiplying by 8 again. The digit is then divided by that denominator.",
          "math": "8^(-1) = 1/(8) = 1/8\n8^(-2) = 1/(8 × 8) = 1/64\n8^(-3) = 1/(8 × 8 × 8) = 1/512"
        },
        {
          "title": "Evaluate digit 5 at power -1",
          "explanation": "The digit 5 has decimal digit value 5. It is 1 place(s) to the right of the point, so its weight is 1/8. Multiply by that weight, or equivalently divide 5 by 8. This contributes 0.625 to the answer.",
          "math": "5 × 8^(-1) = 5 × (1/8)\n= 5/8 = 0.625"
        },
        {
          "title": "Evaluate digit 2 at power -2",
          "explanation": "The digit 2 has decimal digit value 2. It is 2 place(s) to the right of the point, so its weight is 1/64. Multiply by that weight, or equivalently divide 2 by 64. This contributes 0.03125 to the answer.",
          "math": "2 × 8^(-2) = 2 × (1/64)\n= 2/64 = 0.03125"
        },
        {
          "title": "Evaluate digit 7 at power -3",
          "explanation": "The digit 7 has decimal digit value 7. It is 3 place(s) to the right of the point, so its weight is 1/512. Multiply by that weight, or equivalently divide 7 by 512. This contributes 0.013671875 to the answer.",
          "math": "7 × 8^(-3) = 7 × (1/512)\n= 7/512 = 0.013671875"
        },
        {
          "title": "Add every contribution, without rounding",
          "explanation": "Start at 0 and add the contribution from each digit. Here are all the running totals, including zero contributions. The final total is the exact decimal value.",
          "math": "0 + 0.625 = 0.625\n0.625 + 0.03125 = 0.65625\n0.65625 + 0.013671875 = 0.669921875"
        },
        {
          "title": "Verify with a common denominator",
          "explanation": "As a second check, put every contribution over 512, the denominator of the last fractional place. Then add the numerators and divide once.",
          "math": "(320 + 16 + 7)/512\n= 343/512\n= 0.669921875"
        },
        {
          "title": "Compare the supplied response and report precision",
          "explanation": "The supplied response 0.66992 shows five decimal places. The exact value is 0.669921875. At five places, truncation and rounding to nearest both give 0.66992 because the sixth decimal digit is 1. The quoted question does not state a decimal-place requirement, so the exact value is the primary answer here. The full exact decimal answer is 0.669921875. The base subscript is omitted in an ordinary decimal answer box.",
          "math": "exact answer: 0.669921875₁₀\nsupplied response: 0.66992"
        }
      ],
      "check": [
        "The contribution 0.625 equals 320/512.",
        "The contribution 0.03125 equals 16/512.",
        "The contribution 0.013671875 equals 7/512.",
        "Add numerators with the same denominator: (320 + 16 + 7)/512 = 343/512.",
        "Divide: 343 ÷ 512 = 0.669921875. This independently agrees with the place-value sum."
      ],
      "formatNote": "The full exact decimal answer is 0.669921875. The base subscript is omitted in an ordinary decimal answer box.",
      "precisionNote": "The supplied response 0.66992 shows five decimal places. The exact value is 0.669921875. At five places, truncation and rounding to nearest both give 0.66992 because the sixth decimal digit is 1. The quoted question does not state a decimal-place requirement, so the exact value is the primary answer here.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "decimal"
    },
    {
      "id": 2,
      "prompt": "Convert 0.8125₁₀ to binary. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 2,
      "input": "0.8125",
      "supplied": "0.1101",
      "answer": "0.1101",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.8125 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 2, multiply the current fractional remainder by 2.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Binary allows only 0 and 1."
      ],
      "rows": [
        {
          "current": "0.8125",
          "base": 2,
          "product": "1.625",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0.625"
        },
        {
          "current": "0.625",
          "base": 2,
          "product": "1.25",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0.25"
        },
        {
          "current": "0.25",
          "base": 2,
          "product": "0.5",
          "digitValue": 0,
          "digit": "0",
          "remainder": "0.5"
        },
        {
          "current": "0.5",
          "base": 2,
          "product": "1",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.8125 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.8125₁₀ = 0.____₂"
        },
        {
          "title": "Why multiply by 2?",
          "explanation": "In base 2, the first fractional place has weight 1/2. Multiplying by 2 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 2 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Binary allows only 0 and 1. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.____₂"
        },
        {
          "title": "Find the first digit: 1",
          "explanation": "Multiply the current remainder 0.8125 by 2. The product is 1.625. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0.625. This digit belongs in the 1/2 position.",
          "math": "0.8125 × 2 = 1.625\nwhole part = 1 → digit 1\nremainder = 1.625 − 1 = 0.625"
        },
        {
          "title": "Find the second digit: 1",
          "explanation": "Multiply the current remainder 0.625 by 2. The product is 1.25. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0.25. This digit belongs in the 1/4 position.",
          "math": "0.625 × 2 = 1.25\nwhole part = 1 → digit 1\nremainder = 1.25 − 1 = 0.25"
        },
        {
          "title": "Find the third digit: 0",
          "explanation": "Multiply the current remainder 0.25 by 2. The product is 0.5. Its whole-number part is 0, so record 0. Subtract 0 from the product; the new remainder is 0.5. This digit belongs in the 1/8 position.",
          "math": "0.25 × 2 = 0.5\nwhole part = 0 → digit 0\nremainder = 0.5 − 0 = 0.5"
        },
        {
          "title": "Find the fourth digit: 1",
          "explanation": "Multiply the current remainder 0.5 by 2. The product is 1. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0. This digit belongs in the 1/16 position.",
          "math": "0.5 × 2 = 1\nwhole part = 1 → digit 1\nremainder = 1 − 1 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are 1, 1, 0, 1. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "1 → 1 → 0 → 1 gives 0.1101₂"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.8125₁₀ = 0.1101₂ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "1/2 = 0.5\n1/4 = 0.25\n0/8 = 0\n1/16 = 0.0625\n0 + 0.5 = 0.5\n0.5 + 0.25 = 0.75\n0.75 + 0 = 0.75\n0.75 + 0.0625 = 0.8125"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.1101₂. In a digits-only answer box, omit the base subscript but keep the leading 0 and radix point unless the box already supplies them: 0.1101.",
          "math": "complete numeral: 0.1101₂\nfractional digits only: 1101"
        }
      ],
      "check": [
        "Position 1: digit 1 has value 1, and its weight is 1/2. Therefore 1/2 = 0.5.",
        "Position 2: digit 1 has value 1, and its weight is 1/4. Therefore 1/4 = 0.25.",
        "Position 3: digit 0 has value 0, and its weight is 1/8. Therefore 0/8 = 0.",
        "Position 4: digit 1 has value 1, and its weight is 1/16. Therefore 1/16 = 0.0625.",
        "Add the place values: 0 + 0.5 = 0.5; 0.5 + 0.25 = 0.75; 0.75 + 0 = 0.75; 0.75 + 0.0625 = 0.8125.",
        "This equals the original decimal value, 0.8125, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.1101₂. In a digits-only answer box, omit the base subscript but keep the leading 0 and radix point unless the box already supplies them: 0.1101.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "binary"
    },
    {
      "id": 3,
      "prompt": "9. Convert 0.90625₁₀ to 2 hexadecimal points. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 16,
      "input": "0.90625",
      "supplied": "E8",
      "answer": "0.E8",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.90625 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 16, multiply the current fractional remainder by 16.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Hexadecimal allows 0–9 and A–F; A = 10, B = 11, C = 12, D = 13, E = 14, and F = 15.",
        "The question requests 2 digits after the point. Keep that many positions, adding trailing zeros if the remainder becomes zero early."
      ],
      "rows": [
        {
          "current": "0.90625",
          "base": 16,
          "product": "14.5",
          "digitValue": 14,
          "digit": "E",
          "remainder": "0.5"
        },
        {
          "current": "0.5",
          "base": 16,
          "product": "8",
          "digitValue": 8,
          "digit": "8",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.90625 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.90625₁₀ = 0.____₁₆"
        },
        {
          "title": "Why multiply by 16?",
          "explanation": "In base 16, the first fractional place has weight 1/16. Multiplying by 16 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 16 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Hexadecimal allows 0–9 and A–F; A = 10, B = 11, C = 12, D = 13, E = 14, and F = 15. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.__₁₆"
        },
        {
          "title": "Find the first digit: E",
          "explanation": "Multiply the current remainder 0.90625 by 16. The product is 14.5. Its whole-number part is 14, so record E. In hexadecimal, the whole-number value 14 is written E. Subtract 14 from the product; the new remainder is 0.5. This digit belongs in the 1/16 position.",
          "math": "0.90625 × 16 = 14.5\nwhole part = 14 → digit E\nremainder = 14.5 − 14 = 0.5"
        },
        {
          "title": "Find the second digit: 8",
          "explanation": "Multiply the current remainder 0.5 by 16. The product is 8. Its whole-number part is 8, so record 8. Subtract 8 from the product; the new remainder is 0. This digit belongs in the 1/256 position.",
          "math": "0.5 × 16 = 8\nwhole part = 8 → digit 8\nremainder = 8 − 8 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are E, 8. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "E → 8 gives 0.E8₁₆"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.90625₁₀ = 0.E8₁₆ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "14/16 = 0.875\n8/256 = 0.03125\n0 + 0.875 = 0.875\n0.875 + 0.03125 = 0.90625"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.E8₁₆. Your supplied response “E8” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone hexadecimal number without that implied point, “E8” would mean a whole number. The wording alone does not establish how the quiz blank was formatted. Keep exactly 2 digits after the point: E8. We interpret “2 hexadecimal points” as two hexadecimal digits after the radix point.",
          "math": "complete numeral: 0.E8₁₆\nfractional digits only: E8"
        }
      ],
      "check": [
        "Position 1: digit E has value 14, and its weight is 1/16. Therefore 14/16 = 0.875.",
        "Position 2: digit 8 has value 8, and its weight is 1/256. Therefore 8/256 = 0.03125.",
        "Add the place values: 0 + 0.875 = 0.875; 0.875 + 0.03125 = 0.90625.",
        "This equals the original decimal value, 0.90625, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.E8₁₆. Your supplied response “E8” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone hexadecimal number without that implied point, “E8” would mean a whole number. The wording alone does not establish how the quiz blank was formatted. Keep exactly 2 digits after the point: E8. We interpret “2 hexadecimal points” as two hexadecimal digits after the radix point.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "hexadecimal",
      "requestedPlaces": 2
    },
    {
      "id": 4,
      "prompt": "Convert 0.71875₁₀ to 2 octal points. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 8,
      "input": "0.71875",
      "supplied": "0.56",
      "answer": "0.56",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.71875 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 8, multiply the current fractional remainder by 8.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Octal allows digits 0 through 7.",
        "The question requests 2 digits after the point. Keep that many positions, adding trailing zeros if the remainder becomes zero early."
      ],
      "rows": [
        {
          "current": "0.71875",
          "base": 8,
          "product": "5.75",
          "digitValue": 5,
          "digit": "5",
          "remainder": "0.75"
        },
        {
          "current": "0.75",
          "base": 8,
          "product": "6",
          "digitValue": 6,
          "digit": "6",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.71875 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.71875₁₀ = 0.____₈"
        },
        {
          "title": "Why multiply by 8?",
          "explanation": "In base 8, the first fractional place has weight 1/8. Multiplying by 8 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 8 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Octal allows digits 0 through 7. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.__₈"
        },
        {
          "title": "Find the first digit: 5",
          "explanation": "Multiply the current remainder 0.71875 by 8. The product is 5.75. Its whole-number part is 5, so record 5. Subtract 5 from the product; the new remainder is 0.75. This digit belongs in the 1/8 position.",
          "math": "0.71875 × 8 = 5.75\nwhole part = 5 → digit 5\nremainder = 5.75 − 5 = 0.75"
        },
        {
          "title": "Find the second digit: 6",
          "explanation": "Multiply the current remainder 0.75 by 8. The product is 6. Its whole-number part is 6, so record 6. Subtract 6 from the product; the new remainder is 0. This digit belongs in the 1/64 position.",
          "math": "0.75 × 8 = 6\nwhole part = 6 → digit 6\nremainder = 6 − 6 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are 5, 6. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "5 → 6 gives 0.56₈"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.71875₁₀ = 0.56₈ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "5/8 = 0.625\n6/64 = 0.09375\n0 + 0.625 = 0.625\n0.625 + 0.09375 = 0.71875"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.56₈. In a digits-only answer box, omit the base subscript but keep the leading 0 and radix point unless the box already supplies them: 0.56. Keep exactly 2 digits after the point: 56. We interpret “2 octal points” as two octal digits after the radix point.",
          "math": "complete numeral: 0.56₈\nfractional digits only: 56"
        }
      ],
      "check": [
        "Position 1: digit 5 has value 5, and its weight is 1/8. Therefore 5/8 = 0.625.",
        "Position 2: digit 6 has value 6, and its weight is 1/64. Therefore 6/64 = 0.09375.",
        "Add the place values: 0 + 0.625 = 0.625; 0.625 + 0.09375 = 0.71875.",
        "This equals the original decimal value, 0.71875, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.56₈. In a digits-only answer box, omit the base subscript but keep the leading 0 and radix point unless the box already supplies them: 0.56. Keep exactly 2 digits after the point: 56. We interpret “2 octal points” as two octal digits after the radix point.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "octal",
      "requestedPlaces": 2
    },
    {
      "id": 5,
      "prompt": "Convert 0.65625₁₀ to octal points, using three octal digits after the radix point. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 8,
      "input": "0.65625",
      "supplied": "0.520",
      "answer": "0.520",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.65625 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 8, multiply the current fractional remainder by 8.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Octal allows digits 0 through 7.",
        "The question requests 3 digits after the point. Keep that many positions, adding trailing zeros if the remainder becomes zero early."
      ],
      "rows": [
        {
          "current": "0.65625",
          "base": 8,
          "product": "5.25",
          "digitValue": 5,
          "digit": "5",
          "remainder": "0.25"
        },
        {
          "current": "0.25",
          "base": 8,
          "product": "2",
          "digitValue": 2,
          "digit": "2",
          "remainder": "0"
        },
        {
          "current": "0",
          "base": 8,
          "product": "0",
          "digitValue": 0,
          "digit": "0",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.65625 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.65625₁₀ = 0.____₈"
        },
        {
          "title": "Why multiply by 8?",
          "explanation": "In base 8, the first fractional place has weight 1/8. Multiplying by 8 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 8 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Octal allows digits 0 through 7. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.___₈"
        },
        {
          "title": "Find the first digit: 5",
          "explanation": "Multiply the current remainder 0.65625 by 8. The product is 5.25. Its whole-number part is 5, so record 5. Subtract 5 from the product; the new remainder is 0.25. This digit belongs in the 1/8 position.",
          "math": "0.65625 × 8 = 5.25\nwhole part = 5 → digit 5\nremainder = 5.25 − 5 = 0.25"
        },
        {
          "title": "Find the second digit: 2",
          "explanation": "Multiply the current remainder 0.25 by 8. The product is 2. Its whole-number part is 2, so record 2. Subtract 2 from the product; the new remainder is 0. This digit belongs in the 1/64 position.",
          "math": "0.25 × 8 = 2\nwhole part = 2 → digit 2\nremainder = 2 − 2 = 0"
        },
        {
          "title": "Fill the third requested position with zero",
          "explanation": "The previous remainder was already 0. Multiplying 0 by 8 gives 0, so this next digit is 0 and the remainder stays 0. This zero is padding to satisfy the requested number of digits; it does not change the value.",
          "math": "0 × 8 = 0; digit = 0; remainder = 0 − 0 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are 5, 2, 0. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "5 → 2 → 0 gives 0.520₈"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.65625₁₀ = 0.520₈ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "5/8 = 0.625\n2/64 = 0.03125\n0/512 = 0\n0 + 0.625 = 0.625\n0.625 + 0.03125 = 0.65625\n0.65625 + 0 = 0.65625"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.520₈. In a digits-only answer box, omit the base subscript but keep the leading 0 and radix point unless the box already supplies them: 0.520. Keep exactly 3 digits after the point: 520. 0.52₈ and 0.520₈ have the same value, but 0.520₈ explicitly satisfies the three-place instruction.",
          "math": "complete numeral: 0.520₈\nfractional digits only: 520"
        }
      ],
      "check": [
        "Position 1: digit 5 has value 5, and its weight is 1/8. Therefore 5/8 = 0.625.",
        "Position 2: digit 2 has value 2, and its weight is 1/64. Therefore 2/64 = 0.03125.",
        "Position 3: digit 0 has value 0, and its weight is 1/512. Therefore 0/512 = 0.",
        "Add the place values: 0 + 0.625 = 0.625; 0.625 + 0.03125 = 0.65625; 0.65625 + 0 = 0.65625.",
        "This equals the original decimal value, 0.65625, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.520₈. In a digits-only answer box, omit the base subscript but keep the leading 0 and radix point unless the box already supplies them: 0.520. Keep exactly 3 digits after the point: 520. 0.52₈ and 0.520₈ have the same value, but 0.520₈ explicitly satisfies the three-place instruction.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "octal",
      "requestedPlaces": 3
    },
    {
      "id": 6,
      "prompt": "Convert 3A.C8₁₆ to decimal. Use A = 10 and C = 12.",
      "sourceBase": 16,
      "targetBase": 10,
      "input": "3A.C8",
      "supplied": "58.78125",
      "answer": "58.78125",
      "method": "place-value",
      "setup": [
        "The source is base 16, so every step to the right of the radix point divides the place weight by 16.",
        "Negative powers mean reciprocals: 16⁻¹ = 1/16; 16⁻² = 1/256; 16⁻³ = 1/4096. A negative exponent does not make the value negative.",
        "Multiply each digit by its place weight. Add all the resulting values to get the decimal value.",
        "To divide a fractional contribution into decimal digits, bring down a zero by multiplying the current remainder by 10; divide by the denominator to get the next digit, then keep the new remainder. Each row includes this optional long-division trace.",
        "Keep exact intermediate values. Rounding a term early can change the final answer.",
        "Replace hexadecimal letters with their digit values: A = 10, C = 12."
      ],
      "rows": [
        {
          "position": "Whole-number place 1 from the left",
          "digit": "3",
          "digitValue": 3,
          "power": 1,
          "denominator": 1,
          "weight": "16",
          "term": "3 × 16^1",
          "decimal": "48"
        },
        {
          "position": "Whole-number place 2 from the left",
          "digit": "A",
          "digitValue": 10,
          "power": 0,
          "denominator": 1,
          "weight": "1",
          "term": "10 × 16^0",
          "decimal": "10"
        },
        {
          "position": "Fractional place 1",
          "digit": "C",
          "digitValue": 12,
          "power": -1,
          "denominator": 16,
          "weight": "0.0625",
          "term": "12 × 16^(-1) = 12/16",
          "decimal": "0.75",
          "divisionSteps": [
            "Bring down 0: 12 × 10 = 120; digit 1 is 7; remainder = 120 − 7 × 16 = 8.",
            "Bring down 0: 8 × 10 = 80; digit 2 is 5; remainder = 80 − 5 × 16 = 0."
          ]
        },
        {
          "position": "Fractional place 2",
          "digit": "8",
          "digitValue": 8,
          "power": -2,
          "denominator": 256,
          "weight": "0.00390625",
          "term": "8 × 16^(-2) = 8/256",
          "decimal": "0.03125",
          "divisionSteps": [
            "Bring down 0: 8 × 10 = 80; digit 1 is 0; remainder = 80 − 0 × 256 = 80.",
            "Bring down 0: 80 × 10 = 800; digit 2 is 3; remainder = 800 − 3 × 256 = 32.",
            "Bring down 0: 32 × 10 = 320; digit 3 is 1; remainder = 320 − 1 × 256 = 64.",
            "Bring down 0: 64 × 10 = 640; digit 4 is 2; remainder = 640 − 2 × 256 = 128.",
            "Bring down 0: 128 × 10 = 1280; digit 5 is 5; remainder = 1280 − 5 × 256 = 0."
          ]
        }
      ],
      "steps": [
        {
          "title": "Read the number and its base",
          "explanation": "3A.C8₁₆ uses base 16. The point separates whole-number places on the left from fractional places on the right. We will calculate what every digit contributes, then add those contributions.",
          "math": "3A.C8₁₆ → decimal"
        },
        {
          "title": "Understand the place weights",
          "explanation": "The first place to the right is 1/16; the second is 1/256; the third is 1/4096. Moving right divides the weight by 16 each time. On the left, the place next to the point has weight 1 and the next has weight 16.",
          "math": "… 16¹, 16⁰ . 16⁻¹, 16⁻², 16⁻³ …"
        },
        {
          "title": "Turn negative powers into fractions",
          "explanation": "For any positive n, 16⁻ⁿ means 1/(16ⁿ). Build each denominator by multiplying by 16 again. The digit is then divided by that denominator.",
          "math": "16^(-1) = 1/(16) = 1/16\n16^(-2) = 1/(16 × 16) = 1/256"
        },
        {
          "title": "Translate the hexadecimal letters",
          "explanation": "A hexadecimal letter is one digit, even though its decimal value can have two decimal digits. Substitute its value before calculating its contribution.",
          "math": "A = 10; C = 12"
        },
        {
          "title": "Evaluate digit 3 at power 1",
          "explanation": "The digit 3 has decimal digit value 3. Its whole-number place has weight 16^1 = 16. 16¹ equals 16. Multiply the digit value by that weight to get 48.",
          "math": "3 × 16^1 = 3 × 16 = 48"
        },
        {
          "title": "Evaluate digit A at power 0",
          "explanation": "The digit A has decimal digit value 10. Its whole-number place has weight 16^0 = 1. Any nonzero base raised to 0 equals 1. Multiply the digit value by that weight to get 10.",
          "math": "10 × 16^0 = 10 × 1 = 10"
        },
        {
          "title": "Evaluate digit C at power -1",
          "explanation": "The digit C has decimal digit value 12. It is 1 place(s) to the right of the point, so its weight is 1/16. Multiply by that weight, or equivalently divide 12 by 16. This contributes 0.75 to the answer.",
          "math": "12 × 16^(-1) = 12 × (1/16)\n= 12/16 = 0.75"
        },
        {
          "title": "Evaluate digit 8 at power -2",
          "explanation": "The digit 8 has decimal digit value 8. It is 2 place(s) to the right of the point, so its weight is 1/256. Multiply by that weight, or equivalently divide 8 by 256. This contributes 0.03125 to the answer.",
          "math": "8 × 16^(-2) = 8 × (1/256)\n= 8/256 = 0.03125"
        },
        {
          "title": "Add every contribution, without rounding",
          "explanation": "Start at 0 and add the contribution from each digit. Here are all the running totals, including zero contributions. The final total is the exact decimal value.",
          "math": "0 + 48 = 48\n48 + 10 = 58\n58 + 0.75 = 58.75\n58.75 + 0.03125 = 58.78125"
        },
        {
          "title": "Verify with a common denominator",
          "explanation": "As a second check, put every contribution over 256, the denominator of the last fractional place. Then add the numerators and divide once.",
          "math": "(12288 + 2560 + 192 + 8)/256\n= 15048/256\n= 58.78125"
        },
        {
          "title": "Compare the supplied response and report precision",
          "explanation": "The supplied response equals the exact result. All four place contributions terminate in decimal, so no rounding is required. The full exact decimal answer is 58.78125. The base subscript is omitted in an ordinary decimal answer box.",
          "math": "exact answer: 58.78125₁₀\nsupplied response: 58.78125"
        }
      ],
      "check": [
        "The contribution 48 equals 12288/256.",
        "The contribution 10 equals 2560/256.",
        "The contribution 0.75 equals 192/256.",
        "The contribution 0.03125 equals 8/256.",
        "Add numerators with the same denominator: (12288 + 2560 + 192 + 8)/256 = 15048/256.",
        "Divide: 15048 ÷ 256 = 58.78125. This independently agrees with the place-value sum."
      ],
      "formatNote": "The full exact decimal answer is 58.78125. The base subscript is omitted in an ordinary decimal answer box.",
      "precisionNote": "The supplied response equals the exact result. All four place contributions terminate in decimal, so no rounding is required.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "decimal"
    },
    {
      "id": 7,
      "prompt": "Convert 0.4375₁₀ to binary. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 2,
      "input": "0.4375",
      "supplied": "0.0111",
      "answer": "0.0111",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.4375 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 2, multiply the current fractional remainder by 2.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Binary allows only 0 and 1."
      ],
      "rows": [
        {
          "current": "0.4375",
          "base": 2,
          "product": "0.875",
          "digitValue": 0,
          "digit": "0",
          "remainder": "0.875"
        },
        {
          "current": "0.875",
          "base": 2,
          "product": "1.75",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0.75"
        },
        {
          "current": "0.75",
          "base": 2,
          "product": "1.5",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0.5"
        },
        {
          "current": "0.5",
          "base": 2,
          "product": "1",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.4375 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.4375₁₀ = 0.____₂"
        },
        {
          "title": "Why multiply by 2?",
          "explanation": "In base 2, the first fractional place has weight 1/2. Multiplying by 2 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 2 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Binary allows only 0 and 1. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.____₂"
        },
        {
          "title": "Find the first digit: 0",
          "explanation": "Multiply the current remainder 0.4375 by 2. The product is 0.875. Its whole-number part is 0, so record 0. Subtract 0 from the product; the new remainder is 0.875. This digit belongs in the 1/2 position.",
          "math": "0.4375 × 2 = 0.875\nwhole part = 0 → digit 0\nremainder = 0.875 − 0 = 0.875"
        },
        {
          "title": "Find the second digit: 1",
          "explanation": "Multiply the current remainder 0.875 by 2. The product is 1.75. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0.75. This digit belongs in the 1/4 position.",
          "math": "0.875 × 2 = 1.75\nwhole part = 1 → digit 1\nremainder = 1.75 − 1 = 0.75"
        },
        {
          "title": "Find the third digit: 1",
          "explanation": "Multiply the current remainder 0.75 by 2. The product is 1.5. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0.5. This digit belongs in the 1/8 position.",
          "math": "0.75 × 2 = 1.5\nwhole part = 1 → digit 1\nremainder = 1.5 − 1 = 0.5"
        },
        {
          "title": "Find the fourth digit: 1",
          "explanation": "Multiply the current remainder 0.5 by 2. The product is 1. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0. This digit belongs in the 1/16 position.",
          "math": "0.5 × 2 = 1\nwhole part = 1 → digit 1\nremainder = 1 − 1 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are 0, 1, 1, 1. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "0 → 1 → 1 → 1 gives 0.0111₂"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.4375₁₀ = 0.0111₂ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "0/2 = 0\n1/4 = 0.25\n1/8 = 0.125\n1/16 = 0.0625\n0 + 0 = 0\n0 + 0.25 = 0.25\n0.25 + 0.125 = 0.375\n0.375 + 0.0625 = 0.4375"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.0111₂. In a digits-only answer box, omit the base subscript but keep the leading 0 and radix point unless the box already supplies them: 0.0111. The first fractional digit is 0. Keep it: 0.0111₂ and 0.111₂ represent different values.",
          "math": "complete numeral: 0.0111₂\nfractional digits only: 0111"
        }
      ],
      "check": [
        "Position 1: digit 0 has value 0, and its weight is 1/2. Therefore 0/2 = 0.",
        "Position 2: digit 1 has value 1, and its weight is 1/4. Therefore 1/4 = 0.25.",
        "Position 3: digit 1 has value 1, and its weight is 1/8. Therefore 1/8 = 0.125.",
        "Position 4: digit 1 has value 1, and its weight is 1/16. Therefore 1/16 = 0.0625.",
        "Add the place values: 0 + 0 = 0; 0 + 0.25 = 0.25; 0.25 + 0.125 = 0.375; 0.375 + 0.0625 = 0.4375.",
        "This equals the original decimal value, 0.4375, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.0111₂. In a digits-only answer box, omit the base subscript but keep the leading 0 and radix point unless the box already supplies them: 0.0111. The first fractional digit is 0. Keep it: 0.0111₂ and 0.111₂ represent different values.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "binary"
    },
    {
      "id": 8,
      "prompt": "Convert 0.734375₁₀ to 2 hexadecimal points. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 16,
      "input": "0.734375",
      "supplied": "BC",
      "answer": "0.BC",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.734375 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 16, multiply the current fractional remainder by 16.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Hexadecimal allows 0–9 and A–F; A = 10, B = 11, C = 12, D = 13, E = 14, and F = 15.",
        "The question requests 2 digits after the point. Keep that many positions, adding trailing zeros if the remainder becomes zero early."
      ],
      "rows": [
        {
          "current": "0.734375",
          "base": 16,
          "product": "11.75",
          "digitValue": 11,
          "digit": "B",
          "remainder": "0.75"
        },
        {
          "current": "0.75",
          "base": 16,
          "product": "12",
          "digitValue": 12,
          "digit": "C",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.734375 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.734375₁₀ = 0.____₁₆"
        },
        {
          "title": "Why multiply by 16?",
          "explanation": "In base 16, the first fractional place has weight 1/16. Multiplying by 16 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 16 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Hexadecimal allows 0–9 and A–F; A = 10, B = 11, C = 12, D = 13, E = 14, and F = 15. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.__₁₆"
        },
        {
          "title": "Find the first digit: B",
          "explanation": "Multiply the current remainder 0.734375 by 16. The product is 11.75. Its whole-number part is 11, so record B. In hexadecimal, the whole-number value 11 is written B. Subtract 11 from the product; the new remainder is 0.75. This digit belongs in the 1/16 position.",
          "math": "0.734375 × 16 = 11.75\nwhole part = 11 → digit B\nremainder = 11.75 − 11 = 0.75"
        },
        {
          "title": "Find the second digit: C",
          "explanation": "Multiply the current remainder 0.75 by 16. The product is 12. Its whole-number part is 12, so record C. In hexadecimal, the whole-number value 12 is written C. Subtract 12 from the product; the new remainder is 0. This digit belongs in the 1/256 position.",
          "math": "0.75 × 16 = 12\nwhole part = 12 → digit C\nremainder = 12 − 12 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are B, C. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "B → C gives 0.BC₁₆"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.734375₁₀ = 0.BC₁₆ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "11/16 = 0.6875\n12/256 = 0.046875\n0 + 0.6875 = 0.6875\n0.6875 + 0.046875 = 0.734375"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.BC₁₆. Your supplied response “BC” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone hexadecimal number without that implied point, “BC” would mean a whole number. The wording alone does not establish how the quiz blank was formatted. Keep exactly 2 digits after the point: BC. We interpret “2 hexadecimal points” as two hexadecimal digits after the radix point.",
          "math": "complete numeral: 0.BC₁₆\nfractional digits only: BC"
        }
      ],
      "check": [
        "Position 1: digit B has value 11, and its weight is 1/16. Therefore 11/16 = 0.6875.",
        "Position 2: digit C has value 12, and its weight is 1/256. Therefore 12/256 = 0.046875.",
        "Add the place values: 0 + 0.6875 = 0.6875; 0.6875 + 0.046875 = 0.734375.",
        "This equals the original decimal value, 0.734375, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.BC₁₆. Your supplied response “BC” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone hexadecimal number without that implied point, “BC” would mean a whole number. The wording alone does not establish how the quiz blank was formatted. Keep exactly 2 digits after the point: BC. We interpret “2 hexadecimal points” as two hexadecimal digits after the radix point.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "hexadecimal",
      "requestedPlaces": 2
    },
    {
      "id": 9,
      "prompt": "Convert 0.B6₁₆ to decimal. Use B = 11.",
      "sourceBase": 16,
      "targetBase": 10,
      "input": "0.B6",
      "supplied": "0.71093",
      "answer": "0.7109375",
      "method": "place-value",
      "setup": [
        "The source is base 16, so every step to the right of the radix point divides the place weight by 16.",
        "Negative powers mean reciprocals: 16⁻¹ = 1/16; 16⁻² = 1/256; 16⁻³ = 1/4096. A negative exponent does not make the value negative.",
        "Multiply each digit by its place weight. Add all the resulting values to get the decimal value.",
        "To divide a fractional contribution into decimal digits, bring down a zero by multiplying the current remainder by 10; divide by the denominator to get the next digit, then keep the new remainder. Each row includes this optional long-division trace.",
        "Keep exact intermediate values. Rounding a term early can change the final answer.",
        "Replace hexadecimal letters with their digit values: B = 11."
      ],
      "rows": [
        {
          "position": "Fractional place 1",
          "digit": "B",
          "digitValue": 11,
          "power": -1,
          "denominator": 16,
          "weight": "0.0625",
          "term": "11 × 16^(-1) = 11/16",
          "decimal": "0.6875",
          "divisionSteps": [
            "Bring down 0: 11 × 10 = 110; digit 1 is 6; remainder = 110 − 6 × 16 = 14.",
            "Bring down 0: 14 × 10 = 140; digit 2 is 8; remainder = 140 − 8 × 16 = 12.",
            "Bring down 0: 12 × 10 = 120; digit 3 is 7; remainder = 120 − 7 × 16 = 8.",
            "Bring down 0: 8 × 10 = 80; digit 4 is 5; remainder = 80 − 5 × 16 = 0."
          ]
        },
        {
          "position": "Fractional place 2",
          "digit": "6",
          "digitValue": 6,
          "power": -2,
          "denominator": 256,
          "weight": "0.00390625",
          "term": "6 × 16^(-2) = 6/256",
          "decimal": "0.0234375",
          "divisionSteps": [
            "Bring down 0: 6 × 10 = 60; digit 1 is 0; remainder = 60 − 0 × 256 = 60.",
            "Bring down 0: 60 × 10 = 600; digit 2 is 2; remainder = 600 − 2 × 256 = 88.",
            "Bring down 0: 88 × 10 = 880; digit 3 is 3; remainder = 880 − 3 × 256 = 112.",
            "Bring down 0: 112 × 10 = 1120; digit 4 is 4; remainder = 1120 − 4 × 256 = 96.",
            "Bring down 0: 96 × 10 = 960; digit 5 is 3; remainder = 960 − 3 × 256 = 192.",
            "Bring down 0: 192 × 10 = 1920; digit 6 is 7; remainder = 1920 − 7 × 256 = 128.",
            "Bring down 0: 128 × 10 = 1280; digit 7 is 5; remainder = 1280 − 5 × 256 = 0."
          ]
        }
      ],
      "steps": [
        {
          "title": "Read the number and its base",
          "explanation": "0.B6₁₆ uses base 16. The point separates whole-number places on the left from fractional places on the right. We will calculate what every digit contributes, then add those contributions.",
          "math": "0.B6₁₆ → decimal"
        },
        {
          "title": "Understand the place weights",
          "explanation": "The first place to the right is 1/16; the second is 1/256; the third is 1/4096. Moving right divides the weight by 16 each time. On the left, the place next to the point has weight 1 and the next has weight 16.",
          "math": "… 16¹, 16⁰ . 16⁻¹, 16⁻², 16⁻³ …"
        },
        {
          "title": "Turn negative powers into fractions",
          "explanation": "For any positive n, 16⁻ⁿ means 1/(16ⁿ). Build each denominator by multiplying by 16 again. The digit is then divided by that denominator.",
          "math": "16^(-1) = 1/(16) = 1/16\n16^(-2) = 1/(16 × 16) = 1/256"
        },
        {
          "title": "Translate the hexadecimal letters",
          "explanation": "A hexadecimal letter is one digit, even though its decimal value can have two decimal digits. Substitute its value before calculating its contribution.",
          "math": "B = 11"
        },
        {
          "title": "Evaluate digit B at power -1",
          "explanation": "The digit B has decimal digit value 11. It is 1 place(s) to the right of the point, so its weight is 1/16. Multiply by that weight, or equivalently divide 11 by 16. This contributes 0.6875 to the answer.",
          "math": "11 × 16^(-1) = 11 × (1/16)\n= 11/16 = 0.6875"
        },
        {
          "title": "Evaluate digit 6 at power -2",
          "explanation": "The digit 6 has decimal digit value 6. It is 2 place(s) to the right of the point, so its weight is 1/256. Multiply by that weight, or equivalently divide 6 by 256. This contributes 0.0234375 to the answer.",
          "math": "6 × 16^(-2) = 6 × (1/256)\n= 6/256 = 0.0234375"
        },
        {
          "title": "Add every contribution, without rounding",
          "explanation": "Start at 0 and add the contribution from each digit. Here are all the running totals, including zero contributions. The final total is the exact decimal value.",
          "math": "0 + 0.6875 = 0.6875\n0.6875 + 0.0234375 = 0.7109375"
        },
        {
          "title": "Verify with a common denominator",
          "explanation": "As a second check, put every contribution over 256, the denominator of the last fractional place. Then add the numerators and divide once.",
          "math": "(176 + 6)/256\n= 182/256\n= 0.7109375"
        },
        {
          "title": "Compare the supplied response and report precision",
          "explanation": "The supplied response 0.71093 is the exact value truncated after five decimal places. It is not the usual nearest rounding to five places: the sixth digit is 7, so rounding to nearest gives 0.71094. The question does not specify a precision or truncation rule. Keep the exact value 0.7109375 rather than treating the shorter response as an established answer key. The full exact decimal answer is 0.7109375. The base subscript is omitted in an ordinary decimal answer box.",
          "math": "exact answer: 0.7109375₁₀\nsupplied response: 0.71093"
        }
      ],
      "check": [
        "The contribution 0.6875 equals 176/256.",
        "The contribution 0.0234375 equals 6/256.",
        "Add numerators with the same denominator: (176 + 6)/256 = 182/256.",
        "Divide: 182 ÷ 256 = 0.7109375. This independently agrees with the place-value sum."
      ],
      "formatNote": "The full exact decimal answer is 0.7109375. The base subscript is omitted in an ordinary decimal answer box.",
      "precisionNote": "The supplied response 0.71093 is the exact value truncated after five decimal places. It is not the usual nearest rounding to five places: the sixth digit is 7, so rounding to nearest gives 0.71094. The question does not specify a precision or truncation rule. Keep the exact value 0.7109375 rather than treating the shorter response as an established answer key.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "decimal"
    },
    {
      "id": 10,
      "prompt": "Convert 0.59375₁₀ to 2 octal points. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 8,
      "input": "0.59375",
      "supplied": "46",
      "answer": "0.46",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.59375 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 8, multiply the current fractional remainder by 8.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Octal allows digits 0 through 7.",
        "The question requests 2 digits after the point. Keep that many positions, adding trailing zeros if the remainder becomes zero early."
      ],
      "rows": [
        {
          "current": "0.59375",
          "base": 8,
          "product": "4.75",
          "digitValue": 4,
          "digit": "4",
          "remainder": "0.75"
        },
        {
          "current": "0.75",
          "base": 8,
          "product": "6",
          "digitValue": 6,
          "digit": "6",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.59375 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.59375₁₀ = 0.____₈"
        },
        {
          "title": "Why multiply by 8?",
          "explanation": "In base 8, the first fractional place has weight 1/8. Multiplying by 8 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 8 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Octal allows digits 0 through 7. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.__₈"
        },
        {
          "title": "Find the first digit: 4",
          "explanation": "Multiply the current remainder 0.59375 by 8. The product is 4.75. Its whole-number part is 4, so record 4. Subtract 4 from the product; the new remainder is 0.75. This digit belongs in the 1/8 position.",
          "math": "0.59375 × 8 = 4.75\nwhole part = 4 → digit 4\nremainder = 4.75 − 4 = 0.75"
        },
        {
          "title": "Find the second digit: 6",
          "explanation": "Multiply the current remainder 0.75 by 8. The product is 6. Its whole-number part is 6, so record 6. Subtract 6 from the product; the new remainder is 0. This digit belongs in the 1/64 position.",
          "math": "0.75 × 8 = 6\nwhole part = 6 → digit 6\nremainder = 6 − 6 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are 4, 6. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "4 → 6 gives 0.46₈"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.59375₁₀ = 0.46₈ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "4/8 = 0.5\n6/64 = 0.09375\n0 + 0.5 = 0.5\n0.5 + 0.09375 = 0.59375"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.46₈. Your supplied response “46” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone octal number without that implied point, “46” would mean a whole number. The wording alone does not establish how the quiz blank was formatted. Keep exactly 2 digits after the point: 46. We interpret “2 octal points” as two octal digits after the radix point.",
          "math": "complete numeral: 0.46₈\nfractional digits only: 46"
        }
      ],
      "check": [
        "Position 1: digit 4 has value 4, and its weight is 1/8. Therefore 4/8 = 0.5.",
        "Position 2: digit 6 has value 6, and its weight is 1/64. Therefore 6/64 = 0.09375.",
        "Add the place values: 0 + 0.5 = 0.5; 0.5 + 0.09375 = 0.59375.",
        "This equals the original decimal value, 0.59375, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.46₈. Your supplied response “46” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone octal number without that implied point, “46” would mean a whole number. The wording alone does not establish how the quiz blank was formatted. Keep exactly 2 digits after the point: 46. We interpret “2 octal points” as two octal digits after the radix point.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "octal",
      "requestedPlaces": 2
    },
    {
      "id": 11,
      "prompt": "Convert 0.364₈ to decimal.",
      "sourceBase": 8,
      "targetBase": 10,
      "input": "0.364",
      "supplied": "0.47656",
      "answer": "0.4765625",
      "method": "place-value",
      "setup": [
        "The source is base 8, so every step to the right of the radix point divides the place weight by 8.",
        "Negative powers mean reciprocals: 8⁻¹ = 1/8; 8⁻² = 1/64; 8⁻³ = 1/512. A negative exponent does not make the value negative.",
        "Multiply each digit by its place weight. Add all the resulting values to get the decimal value.",
        "To divide a fractional contribution into decimal digits, bring down a zero by multiplying the current remainder by 10; divide by the denominator to get the next digit, then keep the new remainder. Each row includes this optional long-division trace.",
        "Keep exact intermediate values. Rounding a term early can change the final answer."
      ],
      "rows": [
        {
          "position": "Fractional place 1",
          "digit": "3",
          "digitValue": 3,
          "power": -1,
          "denominator": 8,
          "weight": "0.125",
          "term": "3 × 8^(-1) = 3/8",
          "decimal": "0.375",
          "divisionSteps": [
            "Bring down 0: 3 × 10 = 30; digit 1 is 3; remainder = 30 − 3 × 8 = 6.",
            "Bring down 0: 6 × 10 = 60; digit 2 is 7; remainder = 60 − 7 × 8 = 4.",
            "Bring down 0: 4 × 10 = 40; digit 3 is 5; remainder = 40 − 5 × 8 = 0."
          ]
        },
        {
          "position": "Fractional place 2",
          "digit": "6",
          "digitValue": 6,
          "power": -2,
          "denominator": 64,
          "weight": "0.015625",
          "term": "6 × 8^(-2) = 6/64",
          "decimal": "0.09375",
          "divisionSteps": [
            "Bring down 0: 6 × 10 = 60; digit 1 is 0; remainder = 60 − 0 × 64 = 60.",
            "Bring down 0: 60 × 10 = 600; digit 2 is 9; remainder = 600 − 9 × 64 = 24.",
            "Bring down 0: 24 × 10 = 240; digit 3 is 3; remainder = 240 − 3 × 64 = 48.",
            "Bring down 0: 48 × 10 = 480; digit 4 is 7; remainder = 480 − 7 × 64 = 32.",
            "Bring down 0: 32 × 10 = 320; digit 5 is 5; remainder = 320 − 5 × 64 = 0."
          ]
        },
        {
          "position": "Fractional place 3",
          "digit": "4",
          "digitValue": 4,
          "power": -3,
          "denominator": 512,
          "weight": "0.001953125",
          "term": "4 × 8^(-3) = 4/512",
          "decimal": "0.0078125",
          "divisionSteps": [
            "Bring down 0: 4 × 10 = 40; digit 1 is 0; remainder = 40 − 0 × 512 = 40.",
            "Bring down 0: 40 × 10 = 400; digit 2 is 0; remainder = 400 − 0 × 512 = 400.",
            "Bring down 0: 400 × 10 = 4000; digit 3 is 7; remainder = 4000 − 7 × 512 = 416.",
            "Bring down 0: 416 × 10 = 4160; digit 4 is 8; remainder = 4160 − 8 × 512 = 64.",
            "Bring down 0: 64 × 10 = 640; digit 5 is 1; remainder = 640 − 1 × 512 = 128.",
            "Bring down 0: 128 × 10 = 1280; digit 6 is 2; remainder = 1280 − 2 × 512 = 256.",
            "Bring down 0: 256 × 10 = 2560; digit 7 is 5; remainder = 2560 − 5 × 512 = 0."
          ]
        }
      ],
      "steps": [
        {
          "title": "Read the number and its base",
          "explanation": "0.364₈ uses base 8. The point separates whole-number places on the left from fractional places on the right. We will calculate what every digit contributes, then add those contributions.",
          "math": "0.364₈ → decimal"
        },
        {
          "title": "Understand the place weights",
          "explanation": "The first place to the right is 1/8; the second is 1/64; the third is 1/512. Moving right divides the weight by 8 each time. On the left, the place next to the point has weight 1 and the next has weight 8.",
          "math": "… 8¹, 8⁰ . 8⁻¹, 8⁻², 8⁻³ …"
        },
        {
          "title": "Turn negative powers into fractions",
          "explanation": "For any positive n, 8⁻ⁿ means 1/(8ⁿ). Build each denominator by multiplying by 8 again. The digit is then divided by that denominator.",
          "math": "8^(-1) = 1/(8) = 1/8\n8^(-2) = 1/(8 × 8) = 1/64\n8^(-3) = 1/(8 × 8 × 8) = 1/512"
        },
        {
          "title": "Evaluate digit 3 at power -1",
          "explanation": "The digit 3 has decimal digit value 3. It is 1 place(s) to the right of the point, so its weight is 1/8. Multiply by that weight, or equivalently divide 3 by 8. This contributes 0.375 to the answer.",
          "math": "3 × 8^(-1) = 3 × (1/8)\n= 3/8 = 0.375"
        },
        {
          "title": "Evaluate digit 6 at power -2",
          "explanation": "The digit 6 has decimal digit value 6. It is 2 place(s) to the right of the point, so its weight is 1/64. Multiply by that weight, or equivalently divide 6 by 64. This contributes 0.09375 to the answer.",
          "math": "6 × 8^(-2) = 6 × (1/64)\n= 6/64 = 0.09375"
        },
        {
          "title": "Evaluate digit 4 at power -3",
          "explanation": "The digit 4 has decimal digit value 4. It is 3 place(s) to the right of the point, so its weight is 1/512. Multiply by that weight, or equivalently divide 4 by 512. This contributes 0.0078125 to the answer.",
          "math": "4 × 8^(-3) = 4 × (1/512)\n= 4/512 = 0.0078125"
        },
        {
          "title": "Add every contribution, without rounding",
          "explanation": "Start at 0 and add the contribution from each digit. Here are all the running totals, including zero contributions. The final total is the exact decimal value.",
          "math": "0 + 0.375 = 0.375\n0.375 + 0.09375 = 0.46875\n0.46875 + 0.0078125 = 0.4765625"
        },
        {
          "title": "Verify with a common denominator",
          "explanation": "As a second check, put every contribution over 512, the denominator of the last fractional place. Then add the numerators and divide once.",
          "math": "(192 + 48 + 4)/512\n= 244/512\n= 0.4765625"
        },
        {
          "title": "Compare the supplied response and report precision",
          "explanation": "The supplied response 0.47656 shows five decimal places. The exact value is 0.4765625. Truncation and nearest rounding to five places both give 0.47656 because the sixth digit is 2. No precision requirement appears in the quoted question. The full exact decimal answer is 0.4765625. The base subscript is omitted in an ordinary decimal answer box.",
          "math": "exact answer: 0.4765625₁₀\nsupplied response: 0.47656"
        }
      ],
      "check": [
        "The contribution 0.375 equals 192/512.",
        "The contribution 0.09375 equals 48/512.",
        "The contribution 0.0078125 equals 4/512.",
        "Add numerators with the same denominator: (192 + 48 + 4)/512 = 244/512.",
        "Divide: 244 ÷ 512 = 0.4765625. This independently agrees with the place-value sum."
      ],
      "formatNote": "The full exact decimal answer is 0.4765625. The base subscript is omitted in an ordinary decimal answer box.",
      "precisionNote": "The supplied response 0.47656 shows five decimal places. The exact value is 0.4765625. Truncation and nearest rounding to five places both give 0.47656 because the sixth digit is 2. No precision requirement appears in the quoted question.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "decimal"
    },
    {
      "id": 12,
      "prompt": "Convert 0.6875₁₀ to binary. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 2,
      "input": "0.6875",
      "supplied": "1011",
      "answer": "0.1011",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.6875 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 2, multiply the current fractional remainder by 2.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Binary allows only 0 and 1."
      ],
      "rows": [
        {
          "current": "0.6875",
          "base": 2,
          "product": "1.375",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0.375"
        },
        {
          "current": "0.375",
          "base": 2,
          "product": "0.75",
          "digitValue": 0,
          "digit": "0",
          "remainder": "0.75"
        },
        {
          "current": "0.75",
          "base": 2,
          "product": "1.5",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0.5"
        },
        {
          "current": "0.5",
          "base": 2,
          "product": "1",
          "digitValue": 1,
          "digit": "1",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.6875 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.6875₁₀ = 0.____₂"
        },
        {
          "title": "Why multiply by 2?",
          "explanation": "In base 2, the first fractional place has weight 1/2. Multiplying by 2 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 2 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Binary allows only 0 and 1. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.____₂"
        },
        {
          "title": "Find the first digit: 1",
          "explanation": "Multiply the current remainder 0.6875 by 2. The product is 1.375. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0.375. This digit belongs in the 1/2 position.",
          "math": "0.6875 × 2 = 1.375\nwhole part = 1 → digit 1\nremainder = 1.375 − 1 = 0.375"
        },
        {
          "title": "Find the second digit: 0",
          "explanation": "Multiply the current remainder 0.375 by 2. The product is 0.75. Its whole-number part is 0, so record 0. Subtract 0 from the product; the new remainder is 0.75. This digit belongs in the 1/4 position.",
          "math": "0.375 × 2 = 0.75\nwhole part = 0 → digit 0\nremainder = 0.75 − 0 = 0.75"
        },
        {
          "title": "Find the third digit: 1",
          "explanation": "Multiply the current remainder 0.75 by 2. The product is 1.5. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0.5. This digit belongs in the 1/8 position.",
          "math": "0.75 × 2 = 1.5\nwhole part = 1 → digit 1\nremainder = 1.5 − 1 = 0.5"
        },
        {
          "title": "Find the fourth digit: 1",
          "explanation": "Multiply the current remainder 0.5 by 2. The product is 1. Its whole-number part is 1, so record 1. Subtract 1 from the product; the new remainder is 0. This digit belongs in the 1/16 position.",
          "math": "0.5 × 2 = 1\nwhole part = 1 → digit 1\nremainder = 1 − 1 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are 1, 0, 1, 1. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "1 → 0 → 1 → 1 gives 0.1011₂"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.6875₁₀ = 0.1011₂ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "1/2 = 0.5\n0/4 = 0\n1/8 = 0.125\n1/16 = 0.0625\n0 + 0.5 = 0.5\n0.5 + 0 = 0.5\n0.5 + 0.125 = 0.625\n0.625 + 0.0625 = 0.6875"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.1011₂. Your supplied response “1011” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone binary number without that implied point, “1011” would mean a whole number. The wording alone does not establish how the quiz blank was formatted. The zero in the second fractional position is necessary: it contributes 0/4 while keeping the following digits in the 1/8 and 1/16 places.",
          "math": "complete numeral: 0.1011₂\nfractional digits only: 1011"
        }
      ],
      "check": [
        "Position 1: digit 1 has value 1, and its weight is 1/2. Therefore 1/2 = 0.5.",
        "Position 2: digit 0 has value 0, and its weight is 1/4. Therefore 0/4 = 0.",
        "Position 3: digit 1 has value 1, and its weight is 1/8. Therefore 1/8 = 0.125.",
        "Position 4: digit 1 has value 1, and its weight is 1/16. Therefore 1/16 = 0.0625.",
        "Add the place values: 0 + 0.5 = 0.5; 0.5 + 0 = 0.5; 0.5 + 0.125 = 0.625; 0.625 + 0.0625 = 0.6875.",
        "This equals the original decimal value, 0.6875, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.1011₂. Your supplied response “1011” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone binary number without that implied point, “1011” would mean a whole number. The wording alone does not establish how the quiz blank was formatted. The zero in the second fractional position is necessary: it contributes 0/4 while keeping the following digits in the 1/8 and 1/16 places.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "binary"
    },
    {
      "id": 13,
      "prompt": "Convert 0.101101₂ to decimal.",
      "sourceBase": 2,
      "targetBase": 10,
      "input": "0.101101",
      "supplied": "0.70312",
      "answer": "0.703125",
      "method": "place-value",
      "setup": [
        "The source is base 2, so every step to the right of the radix point divides the place weight by 2.",
        "Negative powers mean reciprocals: 2⁻¹ = 1/2; 2⁻² = 1/4; 2⁻³ = 1/8. A negative exponent does not make the value negative.",
        "Multiply each digit by its place weight. Add all the resulting values to get the decimal value.",
        "To divide a fractional contribution into decimal digits, bring down a zero by multiplying the current remainder by 10; divide by the denominator to get the next digit, then keep the new remainder. Each row includes this optional long-division trace.",
        "Keep exact intermediate values. Rounding a term early can change the final answer."
      ],
      "rows": [
        {
          "position": "Fractional place 1",
          "digit": "1",
          "digitValue": 1,
          "power": -1,
          "denominator": 2,
          "weight": "0.5",
          "term": "1 × 2^(-1) = 1/2",
          "decimal": "0.5",
          "divisionSteps": [
            "Bring down 0: 1 × 10 = 10; digit 1 is 5; remainder = 10 − 5 × 2 = 0."
          ]
        },
        {
          "position": "Fractional place 2",
          "digit": "0",
          "digitValue": 0,
          "power": -2,
          "denominator": 4,
          "weight": "0.25",
          "term": "0 × 2^(-2) = 0/4",
          "decimal": "0",
          "divisionSteps": [
            "0 ÷ 4 = 0."
          ]
        },
        {
          "position": "Fractional place 3",
          "digit": "1",
          "digitValue": 1,
          "power": -3,
          "denominator": 8,
          "weight": "0.125",
          "term": "1 × 2^(-3) = 1/8",
          "decimal": "0.125",
          "divisionSteps": [
            "Bring down 0: 1 × 10 = 10; digit 1 is 1; remainder = 10 − 1 × 8 = 2.",
            "Bring down 0: 2 × 10 = 20; digit 2 is 2; remainder = 20 − 2 × 8 = 4.",
            "Bring down 0: 4 × 10 = 40; digit 3 is 5; remainder = 40 − 5 × 8 = 0."
          ]
        },
        {
          "position": "Fractional place 4",
          "digit": "1",
          "digitValue": 1,
          "power": -4,
          "denominator": 16,
          "weight": "0.0625",
          "term": "1 × 2^(-4) = 1/16",
          "decimal": "0.0625",
          "divisionSteps": [
            "Bring down 0: 1 × 10 = 10; digit 1 is 0; remainder = 10 − 0 × 16 = 10.",
            "Bring down 0: 10 × 10 = 100; digit 2 is 6; remainder = 100 − 6 × 16 = 4.",
            "Bring down 0: 4 × 10 = 40; digit 3 is 2; remainder = 40 − 2 × 16 = 8.",
            "Bring down 0: 8 × 10 = 80; digit 4 is 5; remainder = 80 − 5 × 16 = 0."
          ]
        },
        {
          "position": "Fractional place 5",
          "digit": "0",
          "digitValue": 0,
          "power": -5,
          "denominator": 32,
          "weight": "0.03125",
          "term": "0 × 2^(-5) = 0/32",
          "decimal": "0",
          "divisionSteps": [
            "0 ÷ 32 = 0."
          ]
        },
        {
          "position": "Fractional place 6",
          "digit": "1",
          "digitValue": 1,
          "power": -6,
          "denominator": 64,
          "weight": "0.015625",
          "term": "1 × 2^(-6) = 1/64",
          "decimal": "0.015625",
          "divisionSteps": [
            "Bring down 0: 1 × 10 = 10; digit 1 is 0; remainder = 10 − 0 × 64 = 10.",
            "Bring down 0: 10 × 10 = 100; digit 2 is 1; remainder = 100 − 1 × 64 = 36.",
            "Bring down 0: 36 × 10 = 360; digit 3 is 5; remainder = 360 − 5 × 64 = 40.",
            "Bring down 0: 40 × 10 = 400; digit 4 is 6; remainder = 400 − 6 × 64 = 16.",
            "Bring down 0: 16 × 10 = 160; digit 5 is 2; remainder = 160 − 2 × 64 = 32.",
            "Bring down 0: 32 × 10 = 320; digit 6 is 5; remainder = 320 − 5 × 64 = 0."
          ]
        }
      ],
      "steps": [
        {
          "title": "Read the number and its base",
          "explanation": "0.101101₂ uses base 2. The point separates whole-number places on the left from fractional places on the right. We will calculate what every digit contributes, then add those contributions.",
          "math": "0.101101₂ → decimal"
        },
        {
          "title": "Understand the place weights",
          "explanation": "The first place to the right is 1/2; the second is 1/4; the third is 1/8. Moving right divides the weight by 2 each time. On the left, the place next to the point has weight 1 and the next has weight 2.",
          "math": "… 2¹, 2⁰ . 2⁻¹, 2⁻², 2⁻³ …"
        },
        {
          "title": "Turn negative powers into fractions",
          "explanation": "For any positive n, 2⁻ⁿ means 1/(2ⁿ). Build each denominator by multiplying by 2 again. The digit is then divided by that denominator.",
          "math": "2^(-1) = 1/(2) = 1/2\n2^(-2) = 1/(2 × 2) = 1/4\n2^(-3) = 1/(2 × 2 × 2) = 1/8\n2^(-4) = 1/(2 × 2 × 2 × 2) = 1/16\n2^(-5) = 1/(2 × 2 × 2 × 2 × 2) = 1/32\n2^(-6) = 1/(2 × 2 × 2 × 2 × 2 × 2) = 1/64"
        },
        {
          "title": "Evaluate digit 1 at power -1",
          "explanation": "The digit 1 has decimal digit value 1. It is 1 place(s) to the right of the point, so its weight is 1/2. Multiply by that weight, or equivalently divide 1 by 2. This contributes 0.5 to the answer.",
          "math": "1 × 2^(-1) = 1 × (1/2)\n= 1/2 = 0.5"
        },
        {
          "title": "Evaluate digit 0 at power -2",
          "explanation": "The digit 0 has decimal digit value 0. It is 2 place(s) to the right of the point, so its weight is 1/4. Multiply by that weight, or equivalently divide 0 by 4. This contributes 0 to the answer. A zero digit contributes zero, but its position must still be counted; do not slide later digits into its place.",
          "math": "0 × 2^(-2) = 0 × (1/4)\n= 0/4 = 0"
        },
        {
          "title": "Evaluate digit 1 at power -3",
          "explanation": "The digit 1 has decimal digit value 1. It is 3 place(s) to the right of the point, so its weight is 1/8. Multiply by that weight, or equivalently divide 1 by 8. This contributes 0.125 to the answer.",
          "math": "1 × 2^(-3) = 1 × (1/8)\n= 1/8 = 0.125"
        },
        {
          "title": "Evaluate digit 1 at power -4",
          "explanation": "The digit 1 has decimal digit value 1. It is 4 place(s) to the right of the point, so its weight is 1/16. Multiply by that weight, or equivalently divide 1 by 16. This contributes 0.0625 to the answer.",
          "math": "1 × 2^(-4) = 1 × (1/16)\n= 1/16 = 0.0625"
        },
        {
          "title": "Evaluate digit 0 at power -5",
          "explanation": "The digit 0 has decimal digit value 0. It is 5 place(s) to the right of the point, so its weight is 1/32. Multiply by that weight, or equivalently divide 0 by 32. This contributes 0 to the answer. A zero digit contributes zero, but its position must still be counted; do not slide later digits into its place.",
          "math": "0 × 2^(-5) = 0 × (1/32)\n= 0/32 = 0"
        },
        {
          "title": "Evaluate digit 1 at power -6",
          "explanation": "The digit 1 has decimal digit value 1. It is 6 place(s) to the right of the point, so its weight is 1/64. Multiply by that weight, or equivalently divide 1 by 64. This contributes 0.015625 to the answer.",
          "math": "1 × 2^(-6) = 1 × (1/64)\n= 1/64 = 0.015625"
        },
        {
          "title": "Add every contribution, without rounding",
          "explanation": "Start at 0 and add the contribution from each digit. Here are all the running totals, including zero contributions. The final total is the exact decimal value.",
          "math": "0 + 0.5 = 0.5\n0.5 + 0 = 0.5\n0.5 + 0.125 = 0.625\n0.625 + 0.0625 = 0.6875\n0.6875 + 0 = 0.6875\n0.6875 + 0.015625 = 0.703125"
        },
        {
          "title": "Verify with a common denominator",
          "explanation": "As a second check, put every contribution over 64, the denominator of the last fractional place. Then add the numerators and divide once.",
          "math": "(32 + 0 + 8 + 4 + 0 + 1)/64\n= 45/64\n= 0.703125"
        },
        {
          "title": "Compare the supplied response and report precision",
          "explanation": "The supplied response 0.70312 has five decimal places; the exact value is 0.703125. This is exactly halfway between 0.70312 and 0.70313. Truncation gives 0.70312. Round half up gives 0.70313. Round ties to even gives 0.70312 because the retained last digit, 2, is even. The quoted question specifies no rounding rule, so neither rounding convention should be assumed; report the exact value. The full exact decimal answer is 0.703125. The base subscript is omitted in an ordinary decimal answer box.",
          "math": "exact answer: 0.703125₁₀\nsupplied response: 0.70312"
        }
      ],
      "check": [
        "The contribution 0.5 equals 32/64.",
        "The contribution 0 equals 0/64.",
        "The contribution 0.125 equals 8/64.",
        "The contribution 0.0625 equals 4/64.",
        "The contribution 0 equals 0/64.",
        "The contribution 0.015625 equals 1/64.",
        "Add numerators with the same denominator: (32 + 0 + 8 + 4 + 0 + 1)/64 = 45/64.",
        "Divide: 45 ÷ 64 = 0.703125. This independently agrees with the place-value sum."
      ],
      "formatNote": "The full exact decimal answer is 0.703125. The base subscript is omitted in an ordinary decimal answer box.",
      "precisionNote": "The supplied response 0.70312 has five decimal places; the exact value is 0.703125. This is exactly halfway between 0.70312 and 0.70313. Truncation gives 0.70312. Round half up gives 0.70313. Round ties to even gives 0.70312 because the retained last digit, 2, is even. The quoted question specifies no rounding rule, so neither rounding convention should be assumed; report the exact value.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "decimal"
    },
    {
      "id": 14,
      "prompt": "Convert 0.11011₂ to decimal.",
      "sourceBase": 2,
      "targetBase": 10,
      "input": "0.11011",
      "supplied": "0.84375",
      "answer": "0.84375",
      "method": "place-value",
      "setup": [
        "The source is base 2, so every step to the right of the radix point divides the place weight by 2.",
        "Negative powers mean reciprocals: 2⁻¹ = 1/2; 2⁻² = 1/4; 2⁻³ = 1/8. A negative exponent does not make the value negative.",
        "Multiply each digit by its place weight. Add all the resulting values to get the decimal value.",
        "To divide a fractional contribution into decimal digits, bring down a zero by multiplying the current remainder by 10; divide by the denominator to get the next digit, then keep the new remainder. Each row includes this optional long-division trace.",
        "Keep exact intermediate values. Rounding a term early can change the final answer."
      ],
      "rows": [
        {
          "position": "Fractional place 1",
          "digit": "1",
          "digitValue": 1,
          "power": -1,
          "denominator": 2,
          "weight": "0.5",
          "term": "1 × 2^(-1) = 1/2",
          "decimal": "0.5",
          "divisionSteps": [
            "Bring down 0: 1 × 10 = 10; digit 1 is 5; remainder = 10 − 5 × 2 = 0."
          ]
        },
        {
          "position": "Fractional place 2",
          "digit": "1",
          "digitValue": 1,
          "power": -2,
          "denominator": 4,
          "weight": "0.25",
          "term": "1 × 2^(-2) = 1/4",
          "decimal": "0.25",
          "divisionSteps": [
            "Bring down 0: 1 × 10 = 10; digit 1 is 2; remainder = 10 − 2 × 4 = 2.",
            "Bring down 0: 2 × 10 = 20; digit 2 is 5; remainder = 20 − 5 × 4 = 0."
          ]
        },
        {
          "position": "Fractional place 3",
          "digit": "0",
          "digitValue": 0,
          "power": -3,
          "denominator": 8,
          "weight": "0.125",
          "term": "0 × 2^(-3) = 0/8",
          "decimal": "0",
          "divisionSteps": [
            "0 ÷ 8 = 0."
          ]
        },
        {
          "position": "Fractional place 4",
          "digit": "1",
          "digitValue": 1,
          "power": -4,
          "denominator": 16,
          "weight": "0.0625",
          "term": "1 × 2^(-4) = 1/16",
          "decimal": "0.0625",
          "divisionSteps": [
            "Bring down 0: 1 × 10 = 10; digit 1 is 0; remainder = 10 − 0 × 16 = 10.",
            "Bring down 0: 10 × 10 = 100; digit 2 is 6; remainder = 100 − 6 × 16 = 4.",
            "Bring down 0: 4 × 10 = 40; digit 3 is 2; remainder = 40 − 2 × 16 = 8.",
            "Bring down 0: 8 × 10 = 80; digit 4 is 5; remainder = 80 − 5 × 16 = 0."
          ]
        },
        {
          "position": "Fractional place 5",
          "digit": "1",
          "digitValue": 1,
          "power": -5,
          "denominator": 32,
          "weight": "0.03125",
          "term": "1 × 2^(-5) = 1/32",
          "decimal": "0.03125",
          "divisionSteps": [
            "Bring down 0: 1 × 10 = 10; digit 1 is 0; remainder = 10 − 0 × 32 = 10.",
            "Bring down 0: 10 × 10 = 100; digit 2 is 3; remainder = 100 − 3 × 32 = 4.",
            "Bring down 0: 4 × 10 = 40; digit 3 is 1; remainder = 40 − 1 × 32 = 8.",
            "Bring down 0: 8 × 10 = 80; digit 4 is 2; remainder = 80 − 2 × 32 = 16.",
            "Bring down 0: 16 × 10 = 160; digit 5 is 5; remainder = 160 − 5 × 32 = 0."
          ]
        }
      ],
      "steps": [
        {
          "title": "Read the number and its base",
          "explanation": "0.11011₂ uses base 2. The point separates whole-number places on the left from fractional places on the right. We will calculate what every digit contributes, then add those contributions.",
          "math": "0.11011₂ → decimal"
        },
        {
          "title": "Understand the place weights",
          "explanation": "The first place to the right is 1/2; the second is 1/4; the third is 1/8. Moving right divides the weight by 2 each time. On the left, the place next to the point has weight 1 and the next has weight 2.",
          "math": "… 2¹, 2⁰ . 2⁻¹, 2⁻², 2⁻³ …"
        },
        {
          "title": "Turn negative powers into fractions",
          "explanation": "For any positive n, 2⁻ⁿ means 1/(2ⁿ). Build each denominator by multiplying by 2 again. The digit is then divided by that denominator.",
          "math": "2^(-1) = 1/(2) = 1/2\n2^(-2) = 1/(2 × 2) = 1/4\n2^(-3) = 1/(2 × 2 × 2) = 1/8\n2^(-4) = 1/(2 × 2 × 2 × 2) = 1/16\n2^(-5) = 1/(2 × 2 × 2 × 2 × 2) = 1/32"
        },
        {
          "title": "Evaluate digit 1 at power -1",
          "explanation": "The digit 1 has decimal digit value 1. It is 1 place(s) to the right of the point, so its weight is 1/2. Multiply by that weight, or equivalently divide 1 by 2. This contributes 0.5 to the answer.",
          "math": "1 × 2^(-1) = 1 × (1/2)\n= 1/2 = 0.5"
        },
        {
          "title": "Evaluate digit 1 at power -2",
          "explanation": "The digit 1 has decimal digit value 1. It is 2 place(s) to the right of the point, so its weight is 1/4. Multiply by that weight, or equivalently divide 1 by 4. This contributes 0.25 to the answer.",
          "math": "1 × 2^(-2) = 1 × (1/4)\n= 1/4 = 0.25"
        },
        {
          "title": "Evaluate digit 0 at power -3",
          "explanation": "The digit 0 has decimal digit value 0. It is 3 place(s) to the right of the point, so its weight is 1/8. Multiply by that weight, or equivalently divide 0 by 8. This contributes 0 to the answer. A zero digit contributes zero, but its position must still be counted; do not slide later digits into its place.",
          "math": "0 × 2^(-3) = 0 × (1/8)\n= 0/8 = 0"
        },
        {
          "title": "Evaluate digit 1 at power -4",
          "explanation": "The digit 1 has decimal digit value 1. It is 4 place(s) to the right of the point, so its weight is 1/16. Multiply by that weight, or equivalently divide 1 by 16. This contributes 0.0625 to the answer.",
          "math": "1 × 2^(-4) = 1 × (1/16)\n= 1/16 = 0.0625"
        },
        {
          "title": "Evaluate digit 1 at power -5",
          "explanation": "The digit 1 has decimal digit value 1. It is 5 place(s) to the right of the point, so its weight is 1/32. Multiply by that weight, or equivalently divide 1 by 32. This contributes 0.03125 to the answer.",
          "math": "1 × 2^(-5) = 1 × (1/32)\n= 1/32 = 0.03125"
        },
        {
          "title": "Add every contribution, without rounding",
          "explanation": "Start at 0 and add the contribution from each digit. Here are all the running totals, including zero contributions. The final total is the exact decimal value.",
          "math": "0 + 0.5 = 0.5\n0.5 + 0.25 = 0.75\n0.75 + 0 = 0.75\n0.75 + 0.0625 = 0.8125\n0.8125 + 0.03125 = 0.84375"
        },
        {
          "title": "Verify with a common denominator",
          "explanation": "As a second check, put every contribution over 32, the denominator of the last fractional place. Then add the numerators and divide once.",
          "math": "(16 + 8 + 0 + 2 + 1)/32\n= 27/32\n= 0.84375"
        },
        {
          "title": "Compare the supplied response and report precision",
          "explanation": "The supplied response equals the exact result. Five decimal places happen to be enough to write this terminating decimal exactly; no rounding is required. The full exact decimal answer is 0.84375. The base subscript is omitted in an ordinary decimal answer box.",
          "math": "exact answer: 0.84375₁₀\nsupplied response: 0.84375"
        }
      ],
      "check": [
        "The contribution 0.5 equals 16/32.",
        "The contribution 0.25 equals 8/32.",
        "The contribution 0 equals 0/32.",
        "The contribution 0.0625 equals 2/32.",
        "The contribution 0.03125 equals 1/32.",
        "Add numerators with the same denominator: (16 + 8 + 0 + 2 + 1)/32 = 27/32.",
        "Divide: 27 ÷ 32 = 0.84375. This independently agrees with the place-value sum."
      ],
      "formatNote": "The full exact decimal answer is 0.84375. The base subscript is omitted in an ordinary decimal answer box.",
      "precisionNote": "The supplied response equals the exact result. Five decimal places happen to be enough to write this terminating decimal exactly; no rounding is required.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "decimal"
    },
    {
      "id": 15,
      "prompt": "Convert 0.453125₁₀ to hexadecimal. (Type the digits only; do not include the base subscript.)",
      "sourceBase": 10,
      "targetBase": 16,
      "input": "0.453125",
      "supplied": "74",
      "answer": "0.74",
      "method": "repeated-multiply",
      "setup": [
        "The starting number 0.453125 is in base ten. It is less than 1, so its whole-number part stays 0.",
        "To find digits after the point in base 16, multiply the current fractional remainder by 16.",
        "Record the whole-number part of each product as the next digit. Subtract that whole-number part to get the next remainder. Use only the remainder in the next row.",
        "Read the recorded digits from the first row down to the last row. Do not reverse their order.",
        "Hexadecimal allows 0–9 and A–F; A = 10, B = 11, C = 12, D = 13, E = 14, and F = 15."
      ],
      "rows": [
        {
          "current": "0.453125",
          "base": 16,
          "product": "7.25",
          "digitValue": 7,
          "digit": "7",
          "remainder": "0.25"
        },
        {
          "current": "0.25",
          "base": 16,
          "product": "4",
          "digitValue": 4,
          "digit": "4",
          "remainder": "0"
        }
      ],
      "steps": [
        {
          "title": "Read the starting value",
          "explanation": "0.453125 means a fraction of one whole. We are changing its written base, while keeping its value the same. Because it is smaller than 1, the final answer begins with 0.",
          "math": "0.453125₁₀ = 0.____₁₆"
        },
        {
          "title": "Why multiply by 16?",
          "explanation": "In base 16, the first fractional place has weight 1/16. Multiplying by 16 shifts that first digit into the whole-number position, where we can read it. The part left after the point still contains the later digits.",
          "math": "current fraction × 16 = next digit + next fraction"
        },
        {
          "title": "Prepare the digit positions",
          "explanation": "We will fill the positions immediately after the radix point, from left to right. Hexadecimal allows 0–9 and A–F; A = 10, B = 11, C = 12, D = 13, E = 14, and F = 15. The radix point is the same separator often called the decimal point; its name does not change the base.",
          "math": "0.__₁₆"
        },
        {
          "title": "Find the first digit: 7",
          "explanation": "Multiply the current remainder 0.453125 by 16. The product is 7.25. Its whole-number part is 7, so record 7. Subtract 7 from the product; the new remainder is 0.25. This digit belongs in the 1/16 position.",
          "math": "0.453125 × 16 = 7.25\nwhole part = 7 → digit 7\nremainder = 7.25 − 7 = 0.25"
        },
        {
          "title": "Find the second digit: 4",
          "explanation": "Multiply the current remainder 0.25 by 16. The product is 4. Its whole-number part is 4, so record 4. Subtract 4 from the product; the new remainder is 0. This digit belongs in the 1/256 position.",
          "math": "0.25 × 16 = 4\nwhole part = 4 → digit 4\nremainder = 4 − 4 = 0"
        },
        {
          "title": "Read the digits in the order found",
          "explanation": "The recorded digits are 7, 4. They were found from the first fractional position to the last, so join them in that same order and put them after the point.",
          "math": "7 → 4 gives 0.74₁₆"
        },
        {
          "title": "Know why this answer is exact",
          "explanation": "The final remainder is 0. There is no fractional value left to convert, so every later digit would also be 0. This conversion terminates exactly; no rounding is needed.",
          "math": "final remainder = 0 ⇒ 0.453125₁₀ = 0.74₁₆ exactly"
        },
        {
          "title": "Check by converting back to decimal",
          "explanation": "Each digit after the point contributes its digit value divided by a power of the new base. Evaluate every contribution, then add. The result must be the original number.",
          "math": "7/16 = 0.4375\n4/256 = 0.015625\n0 + 0.4375 = 0.4375\n0.4375 + 0.015625 = 0.453125"
        },
        {
          "title": "Write the answer in the required format",
          "explanation": "The complete numeral is 0.74₁₆. Your supplied response “74” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone hexadecimal number without that implied point, “74” would mean a whole number. The wording alone does not establish how the quiz blank was formatted.",
          "math": "complete numeral: 0.74₁₆\nfractional digits only: 74"
        }
      ],
      "check": [
        "Position 1: digit 7 has value 7, and its weight is 1/16. Therefore 7/16 = 0.4375.",
        "Position 2: digit 4 has value 4, and its weight is 1/256. Therefore 4/256 = 0.015625.",
        "Add the place values: 0 + 0.4375 = 0.4375; 0.4375 + 0.015625 = 0.453125.",
        "This equals the original decimal value, 0.453125, so the conversion checks."
      ],
      "formatNote": "The complete numeral is 0.74₁₆. Your supplied response “74” contains the correct fractional digits if the quiz blank already implies “0.” or asks for the digits after the point. Written as a complete standalone hexadecimal number without that implied point, “74” would mean a whole number. The wording alone does not establish how the quiz blank was formatted.",
      "precisionNote": "The remainder reaches zero, so the displayed answer is exact. No rounding is needed.",
      "sourceLabel": "User-provided Quiz #2 question and supplied response",
      "targetLabel": "hexadecimal"
    }
  ]
};
