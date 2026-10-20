(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LogicEngine = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DIGITS = '0123456789ABCDEF';
  var BASES = [2, 8, 10, 16];

  function validBase(base) {
    var result = Number(base);
    if (BASES.indexOf(result) === -1) throw new Error('Choose base 2, 8, 10, or 16.');
    return result;
  }

  function textInput(value, description) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('Enter ' + description + ' as text.');
    }
    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
      throw new Error('Enter fractions and large values as text to preserve every digit.');
    }
    return String(value).trim();
  }

  function gcd(a, b) {
    while (b !== 0n) {
      var remainder = a % b;
      a = b;
      b = remainder;
    }
    return a;
  }

  function parseRational(value, base) {
    var text = textInput(value, 'a number').toUpperCase();
    if (!text.length) throw new Error('Enter a number to convert.');
    if (text.length > 100) throw new Error('Use no more than 100 characters.');
    if (!/^[+-]?(?:[0-9A-F]+(?:\.[0-9A-F]*)?|\.[0-9A-F]+)$/.test(text)) {
      throw new Error('Use digits, one optional radix point, and an optional leading + or - sign.');
    }
    var negative = text[0] === '-';
    var unsigned = text.replace(/^[+-]/, '');
    var parts = unsigned.split('.');
    var integerText = parts[0] || '0';
    var fractionText = parts[1] || '';
    var combined = integerText + fractionText;
    var numerator = 0n;
    for (var i = 0; i < combined.length; i++) {
      var digit = DIGITS.indexOf(combined[i]);
      if (digit < 0 || digit >= base) {
        throw new Error('Digit ' + combined[i] + ' is not valid in base ' + base + '. Allowed digits: ' + DIGITS.slice(0, base) + '.');
      }
      numerator = numerator * BigInt(base) + BigInt(digit);
    }
    var denominator = BigInt(base) ** BigInt(fractionText.length);
    var rawNumerator = numerator;
    var rawDenominator = denominator;
    var divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;
    if (numerator === 0n) negative = false;
    return { text: text, numerator: numerator, denominator: denominator, negative: negative, rawNumerator: rawNumerator, rawDenominator: rawDenominator, fractionPlaces: fractionText.length, sourceDigits: combined };
  }

  /** Exact source arithmetic; only the displayed target expansion can be truncated. */
  function convert(value, fromBase, toBase, precision) {
    fromBase = validBase(fromBase);
    toBase = validBase(toBase);
    if (precision === undefined) precision = 16;
    if (!Number.isInteger(precision) || precision < 1 || precision > 64) {
      throw new Error('Fractional precision must be an integer from 1 to 64.');
    }
    var parsed = parseRational(value, fromBase);
    var numerator = parsed.numerator;
    var denominator = parsed.denominator;
    var sign = parsed.negative ? '-' : '';
    var fraction = sign + numerator.toString() + (denominator === 1n ? '' : '/' + denominator.toString());
    var steps = [
      'Read ' + parsed.text + ' in base ' + fromBase + '. Each place has weight ' + fromBase + ' raised to its position; positions after the point are negative.',
      'Remove the radix point: ' + parsed.sourceDigits + ' in base ' + fromBase + ' has decimal integer value ' + parsed.rawNumerator.toString() + '. Divide by ' + fromBase + '^' + parsed.fractionPlaces + ' = ' + parsed.rawDenominator.toString() + ' to restore the point' + (parsed.negative ? ', then apply the negative sign.' : '.'),
      'The exact value in decimal rational form is ' + fraction + '.'
    ];
    var integer = numerator / denominator;
    var remainder = numerator % denominator;
    var integerDigits = [];
    if (integer === 0n) {
      integerDigits.push('0');
      steps.push('The whole-number part is 0.');
    } else {
      var current = integer;
      while (current > 0n) {
        var next = current / BigInt(toBase);
        var digit = Number(current % BigInt(toBase));
        integerDigits.push(DIGITS[digit]);
        steps.push(current.toString() + ' ÷ ' + toBase + ' = ' + next.toString() + ' remainder ' + DIGITS[digit] + '.');
        current = next;
      }
      integerDigits.reverse();
      steps.push('Read the whole-number remainders from last to first: ' + integerDigits.join('') + '.');
    }
    var fractionalDigits = [];
    while (remainder !== 0n && fractionalDigits.length < precision) {
      var previous = remainder;
      var product = previous * BigInt(toBase);
      var fractionalDigit = Number(product / denominator);
      remainder = product % denominator;
      fractionalDigits.push(DIGITS[fractionalDigit]);
      steps.push('Fraction step ' + fractionalDigits.length + ': (' + previous.toString() + '/' + denominator.toString() + ') × ' + toBase + ' = ' + fractionalDigit + ' + ' + remainder.toString() + '/' + denominator.toString() + '; write ' + DIGITS[fractionalDigit] + '.');
    }
    var exact = remainder === 0n;
    var result = sign + integerDigits.join('') + (fractionalDigits.length ? '.' + fractionalDigits.join('') : '');
    if (exact) steps.push('The remainder is 0, so ' + result + ' in base ' + toBase + ' is exact.');
    else steps.push('Stop after ' + precision + ' fractional digits. Remainder ' + remainder.toString() + '/' + denominator.toString() + ' remains: ' + result + ' in base ' + toBase + ' is truncated, not rounded.');
    return { result: result, exact: exact, steps: steps, fraction: fraction };
  }

  function bit(value, name) {
    if (value === 0 || value === false || value === '0') return 0;
    if (value === 1 || value === true || value === '1') return 1;
    throw new Error((name || 'Input') + ' must be 0 or 1.');
  }

  function gate(type, a, b) {
    if (typeof type !== 'string') throw new Error('Choose a supported logic gate.');
    type = type.toUpperCase().trim();
    a = bit(a, 'Input A');
    if (type === 'NOT') return 1 - a;
    if (type === 'BUFFER' || type === 'BUF') return a;
    if (['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'].indexOf(type) === -1) {
      throw new Error('Unknown gate. Choose AND, OR, NOT, NAND, NOR, XOR, XNOR, or BUFFER.');
    }
    b = bit(b, 'Input B');
    switch (type) {
      case 'AND': return a & b;
      case 'OR': return a | b;
      case 'NAND': return 1 - (a & b);
      case 'NOR': return 1 - (a | b);
      case 'XOR': return a ^ b;
      case 'XNOR': return 1 - (a ^ b);
    }
  }

  function tokenize(expression) {
    var tokens = [];
    for (var i = 0; i < expression.length; i++) {
      var character = expression[i];
      if (/\s/.test(character)) continue;
      if (/[A-Da-d]/.test(character)) tokens.push({ type: 'variable', value: character.toUpperCase(), pos: i });
      else if (character === '0' || character === '1') {
        if (/[0-9]/.test(expression[i + 1] || '')) throw new Error('At character ' + (i + 1) + ': Boolean constants are single 0 or 1 digits.');
        tokens.push({ type: 'constant', value: Number(character), pos: i });
      } else if ('!~¬'.indexOf(character) !== -1) tokens.push({ type: 'not', pos: i });
      else if ("'′’".indexOf(character) !== -1) tokens.push({ type: 'postfix', pos: i });
      else if ('&*·∧'.indexOf(character) !== -1) tokens.push({ type: 'and', pos: i });
      else if (character === '^' || character === '⊕') tokens.push({ type: 'xor', pos: i });
      else if ('|+∨'.indexOf(character) !== -1) tokens.push({ type: 'or', pos: i });
      else if (character === '(' || character === ')') tokens.push({ type: character, pos: i });
      else throw new Error('Unsupported character “' + character + '” at position ' + (i + 1) + '. Use A–D, 0/1, ! or apostrophe, &, ^, +, and parentheses.');
    }
    tokens.push({ type: 'end', pos: expression.length });
    return tokens;
  }

  function parseExpression(expression) {
    var tokens = tokenize(expression);
    var cursor = 0;
    function peek() { return tokens[cursor]; }
    function error(message) { throw new Error(message + ' At character ' + (peek().pos + 1) + '.'); }
    function primary() {
      var token = peek();
      var node;
      if (token.type === 'variable' || token.type === 'constant') {
        cursor++;
        node = { type: token.type, value: token.value };
      } else if (token.type === '(') {
        cursor++;
        node = orExpression();
        if (peek().type !== ')') error('A closing parenthesis is missing.');
        cursor++;
      } else error('Expected a variable, 0/1, or an opening parenthesis.');
      while (peek().type === 'postfix') {
        cursor++;
        node = { type: 'not', child: node };
      }
      return node;
    }
    function unary() {
      if (peek().type === 'not') {
        cursor++;
        return { type: 'not', child: unary() };
      }
      return primary();
    }
    function startsOperand(token) {
      return ['variable', 'constant', '(', 'not'].indexOf(token.type) !== -1;
    }
    function andExpression() {
      var node = unary();
      while (peek().type === 'and' || startsOperand(peek())) {
        if (peek().type === 'and') cursor++;
        node = { type: 'and', left: node, right: unary() };
      }
      return node;
    }
    function xorExpression() {
      var node = andExpression();
      while (peek().type === 'xor') {
        cursor++;
        node = { type: 'xor', left: node, right: andExpression() };
      }
      return node;
    }
    function orExpression() {
      var node = xorExpression();
      while (peek().type === 'or') {
        cursor++;
        node = { type: 'or', left: node, right: xorExpression() };
      }
      return node;
    }
    var ast = orExpression();
    if (peek().type !== 'end') error('Unexpected token; check operators and parentheses.');
    var variables = Array.from(new Set(tokens.filter(function (token) { return token.type === 'variable'; }).map(function (token) { return token.value; }))).sort();
    return { ast: ast, variables: variables };
  }

  function evaluate(node, inputs) {
    if (node.type === 'constant') return node.value;
    if (node.type === 'variable') return inputs[node.value];
    if (node.type === 'not') return 1 - evaluate(node.child, inputs);
    var left = evaluate(node.left, inputs);
    var right = evaluate(node.right, inputs);
    if (node.type === 'and') return left & right;
    if (node.type === 'xor') return left ^ right;
    return left | right;
  }

  /** Precedence: NOT, AND (including juxtaposition), XOR, then OR. */
  function truthTable(expression) {
    if (typeof expression !== 'string' || !expression.trim()) throw new Error('Enter a Boolean expression, such as A & (B + !C).');
    expression = expression.trim();
    if (expression.length > 300) throw new Error('Use no more than 300 characters in an expression.');
    var parsed = parseExpression(expression);
    var variables = parsed.variables;
    var rows = [];
    for (var row = 0; row < 2 ** variables.length; row++) {
      var inputs = {};
      variables.forEach(function (variable, index) {
        inputs[variable] = (row >> (variables.length - index - 1)) & 1;
      });
      rows.push({ inputs: inputs, output: evaluate(parsed.ast, inputs) });
    }
    return { variables: variables, rows: rows, expression: expression };
  }

  function binaryInput(value, description) {
    var text = textInput(value, description);
    if (!/^[01]+$/.test(text)) throw new Error('Enter a nonempty bit string using only 0 and 1.');
    if (text.length > 128) throw new Error('Use no more than 128 bits.');
    return text;
  }

  function binaryToGray(value) {
    var binary = binaryInput(value, 'binary bits');
    var result = binary[0];
    var steps = ['Copy the most significant bit: g₀ = b₀ = ' + binary[0] + '.'];
    for (var i = 1; i < binary.length; i++) {
      var grayBit = Number(binary[i - 1]) ^ Number(binary[i]);
      result += grayBit;
      steps.push('Bit ' + (i + 1) + ': XOR adjacent binary bits ' + binary[i - 1] + ' ⊕ ' + binary[i] + ' = ' + grayBit + '.');
    }
    return { result: result, steps: steps };
  }

  function grayToBinary(value) {
    var gray = binaryInput(value, 'Gray-code bits');
    var result = gray[0];
    var steps = ['Copy the most significant bit: b₀ = g₀ = ' + gray[0] + '.'];
    for (var i = 1; i < gray.length; i++) {
      var binaryBit = Number(result[i - 1]) ^ Number(gray[i]);
      result += binaryBit;
      steps.push('Bit ' + (i + 1) + ': XOR the previous binary bit with this Gray bit: ' + result[i - 1] + ' ⊕ ' + gray[i] + ' = ' + binaryBit + '.');
    }
    return { result: result, steps: steps };
  }

  function encodeDecimal(value, type) {
    var decimal = textInput(value, 'nonnegative decimal digits');
    if (!/^[0-9]+$/.test(decimal)) throw new Error('Enter nonnegative whole decimal digits only, such as 259. Leading zeros are preserved.');
    if (decimal.length > 100) throw new Error('Use no more than 100 decimal digits.');
    if (typeof type !== 'string') throw new Error('Choose BCD or Excess-3.');
    var normalized = type.toUpperCase().replace(/[\s_-]/g, '');
    var isBCD = normalized === 'BCD' || normalized === '8421BCD' || normalized === '8421';
    var isExcess = normalized === 'EXCESS3' || normalized === 'XS3';
    var isASCII = normalized === 'ASCII';
    if (!isBCD && !isExcess && !isASCII) throw new Error('Choose BCD, Excess-3, or ASCII.');
    var groups = [];
    var steps = [isASCII ? 'Encode each decimal digit as its ASCII character code, displayed in 8 bits.' : 'Encode each decimal digit separately. This is a digit code, so do not convert the entire decimal number to ordinary binary.'];
    for (var i = 0; i < decimal.length; i++) {
      var digit = Number(decimal[i]);
      var encoded = isASCII ? decimal.charCodeAt(i) : digit + (isExcess ? 3 : 0);
      var bits = encoded.toString(2).padStart(isASCII ? 8 : 4, '0');
      groups.push(bits);
      if (isExcess) steps.push('Digit ' + decimal[i] + ': add 3 → ' + encoded + '; encode ' + encoded + ' in four bits → ' + bits + '.');
      else if (isASCII) steps.push('Character “' + decimal[i] + '”: ASCII decimal ' + encoded + ' → ' + bits + '.');
      else steps.push('Digit ' + decimal[i] + ': 8421-weighted BCD → ' + bits + '.');
    }
    steps.push('Keep the digit groups in their original order: ' + groups.join(' ') + '.');
    return { result: groups.join(' '), steps: steps };
  }

  return Object.freeze({
    convert: convert,
    gate: gate,
    truthTable: truthTable,
    binaryToGray: binaryToGray,
    grayToBinary: grayToBinary,
    encodeDecimal: encodeDecimal
  });
});
