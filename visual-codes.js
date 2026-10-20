(function () {
  'use strict';
  var W = window.VisualWalkthroughs;
  var AIKEN = ['0000', '0001', '0010', '0011', '0100', '1011', '1100', '1101', '1110', '1111'];
  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function bits(value, size) { return Number(value).toString(2).padStart(size, '0'); }
  function bitInput(value, limit) {
    var s = String(value === undefined ? '' : value).trim();
    if (!/^[01]+$/.test(s) || s.length > limit) throw new Error('Enter 1–' + limit + ' bits using only 0 and 1. Leading zeros are kept.');
    return s;
  }
  function gray(s) { return s[0] + s.slice(1).split('').map(function (b, i) { return Number(s[i]) ^ Number(b); }).join(''); }
  function count(s) { return s.split('').reduce(function (n, b) { return n + Number(b); }, 0); }
  function distance(a, b) { return a.split('').reduce(function (n, bit, i) { return n + (bit !== b[i] ? 1 : 0); }, 0); }
  function packet(s, options) {
    options = options || {};
    return '<div class="vc-packet" role="group" aria-label="' + esc(options.label || s) + '">' + s.split('').map(function (b, i) {
      var changed = options.mask && options.mask[i] === '1';
      var parity = options.parity && i === s.length - 1;
      return '<div class="vc-packet-cell' + (changed ? ' vc-flipped' : '') + (parity ? ' vc-parity' : '') + '"><small>' + (parity ? 'Parity' : 'Bit ' + (i + 1)) + '</small><span class="vw-bit' + (options.active === i ? ' vw-active' : '') + '">' + esc(b) + '</span>' + (changed ? '<small>Flipped</small>' : '') + '</div>';
    }).join('') + '</div>';
  }
  function svgOpen(width, height, label) { return '<svg class="vc-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + esc(label) + '" xmlns="http://www.w3.org/2000/svg"><title>' + esc(label) + '</title>'; }
  function text(x, y, value, color, size, anchor) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" fill="' + (color || '#142743') + '" font-size="' + (size || 16) + '" font-family="Segoe UI,Arial,sans-serif">' + esc(value) + '</text>'; }
  function tile(x, y, value, active, muted) { return '<rect x="' + (x - 22) + '" y="' + y + '" width="44" height="42" rx="8" fill="' + (active ? '#164ad1' : muted ? '#edf1f7' : '#fff') + '" stroke="' + (active ? '#164ad1' : '#b7c8e2') + '" stroke-width="2"/>' + text(x, y + 28, value, active ? '#fff' : muted ? '#667892' : '#142743', 23); }
  function wire(path, active) { return '<path d="' + path + '" fill="none" stroke="' + (active ? '#164ad1' : '#c2cfe0') + '" stroke-width="' + (active ? 3 : 2) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }

  function digitDiagram(digits, scheme) {
    var title = ({ bcd: '8421 BCD', excess: 'Excess-3', aiken: 'Aiken 2421', ascii: 'ASCII character' })[scheme];
    return '<div class="vc-digit-grid">' + digits.split('').map(function (d) {
      var n = Number(d), output, operation;
      if (scheme === 'bcd') { output = bits(n, 4); operation = n + ' = ' + [8, 4, 2, 1].filter(function (weight, i) { return output[i] === '1'; }).join(' + '); if (n === 0) operation = '0 = no weights selected'; }
      if (scheme === 'excess') { output = bits(n + 3, 4); operation = n + ' + 3 = ' + (n + 3); }
      if (scheme === 'aiken') { output = AIKEN[n]; operation = '2·' + output[0] + ' + 4·' + output[1] + ' + 2·' + output[2] + ' + 1·' + output[3] + ' = ' + n; }
      if (scheme === 'ascii') { output = bits(d.charCodeAt(0), 8); operation = 'Character “' + d + '” → code ' + d.charCodeAt(0); }
      return '<div class="vc-digit-branch"><div class="vc-decimal-digit">' + d + '</div><div class="vc-flow-arrow" aria-hidden="true">↓</div><div class="vc-transform">' + esc(operation) + '</div><div class="vc-flow-arrow" aria-hidden="true">↓</div><div class="vc-code-output" data-code="' + scheme + '" data-digit="' + d + '" data-bits="' + output + '"><small>' + title + '</small><strong>' + output + '</strong></div></div>';
    }).join('') + '</div>';
  }

  W.register({
    id: 'digit-encoding', title: 'One digit, four different codes', lead: 'Follow decimal digits through BCD, Excess-3, Aiken 2421, and ASCII. See why the same digit gets different bit patterns.',
    inputs: [{ key: 'digits', label: 'Decimal digits', type: 'text', value: '59', maxLength: 4, hint: 'Use 1–4 digits. Each digit gets its own code group.' }],
    presets: [{ label: '59: watch the 5 change', values: { digits: '59' } }, { label: 'All boundary digits', values: { digits: '0459' } }, { label: 'Leading zero', values: { digits: '07' } }],
    build: function (v) {
      var digits = String(v.digits === undefined ? '' : v.digits).trim();
      if (!/^[0-9]{1,4}$/.test(digits)) throw new Error('Enter 1–4 whole decimal digits, such as 59 or 007.');
      var results = {
        bcd: digits.split('').map(function (d) { return bits(Number(d), 4); }).join(' '),
        excess: digits.split('').map(function (d) { return bits(Number(d) + 3, 4); }).join(' '),
        aiken: digits.split('').map(function (d) { return AIKEN[Number(d)]; }).join(' '),
        ascii: digits.split('').map(function (d) { return bits(d.charCodeAt(0), 8); }).join(' ')
      };
      return { frames: [
        { title: 'Split the number into decimal digits', explain: 'Digit codes encode each character separately. Keep every group, including a leading zero.', html: '<div class="vc-split-source"><strong>' + digits + '</strong><span aria-hidden="true">↓</span><div class="vc-digit-source">' + digits.split('').map(function (d) { return '<span class="vc-decimal-digit">' + d + '</span>'; }).join('') + '</div></div><p class="vc-caption">These are separate decimal digits. Ordinary whole-number binary would instead be ' + Number(digits).toString(2) + '₂.</p>' },
        { title: 'BCD: give each digit the weights 8, 4, 2, 1', explain: 'Turn on the weights that sum to the digit. Each decimal digit uses exactly four bits.', html: digitDiagram(digits, 'bcd') },
        { title: 'Excess-3: add three before encoding', explain: 'Add 3 to each decimal digit, then write that result in four-bit binary. Do not add three to the complete number.', html: digitDiagram(digits, 'excess') },
        { title: 'Aiken 2421: use its assigned codewords', explain: 'Use the standard Aiken table. Digits 0–4 use 0000–0100; digits 5–9 use their complementary partners. The weights alone do not pick a unique codeword.', html: digitDiagram(digits, 'aiken') },
        { title: 'ASCII: encode a character, not its numeric value', explain: 'The character “0” has ASCII code 48. A digit character has code 48 plus its value. ASCII is seven bits; an eight-bit storage group is shown here with a leading zero.', html: digitDiagram(digits, 'ascii') },
        { title: 'Keep the groups in their original order', explain: 'The meaning comes from the code you agreed to use. The same decimal digits have four different representations.', html: '<div class="vc-code-summary">' + [['8421 BCD', 'bcd'], ['Excess-3', 'excess'], ['Aiken 2421', 'aiken'], ['ASCII, 8-bit storage', 'ascii']].map(function (pair) { return '<div><span>' + pair[0] + '</span><strong data-result="' + pair[1] + '">' + results[pair[1]] + '</strong></div>'; }).join('') + '</div>' }
      ], takeaway: 'A code group belongs to one decimal digit. BCD and Aiken are weighted codes; Excess-3 adds a bias; ASCII represents text characters.' };
    }
  });

  W.register({
    id: 'parity-check', title: 'Send bits through an error detector', lead: 'Attach a parity bit, flip bits during transmission, and watch the receiver decide whether the packet passes.',
    inputs: [
      { key: 'data', label: 'Data bits', type: 'text', value: '1011', maxLength: 8, hint: 'Use 1–8 bits. The parity bit is appended on the right.' },
      { key: 'mode', label: 'Parity rule', type: 'select', value: 'even', options: [{ value: 'even', label: 'Even parity' }, { value: 'odd', label: 'Odd parity' }] },
      { key: 'error', label: 'Transmission error', type: 'select', value: 'single', options: [{ value: 'none', label: 'No flipped bits' }, { value: 'single', label: 'Flip the first data bit' }, { value: 'parity', label: 'Flip only the parity bit' }, { value: 'double', label: 'Flip first data bit + parity bit' }] }
    ],
    presets: [{ label: 'One error: caught', values: { data: '1011', mode: 'even', error: 'single' } }, { label: 'Two errors: missed', values: { data: '1011', mode: 'even', error: 'double' } }, { label: 'Odd parity', values: { data: '0110', mode: 'odd', error: 'none' } }],
    build: function (v) {
      var data = bitInput(v.data, 8), mode = String(v.mode), error = String(v.error);
      if (['even', 'odd'].indexOf(mode) < 0) throw new Error('Choose even or odd parity.');
      if (['none', 'single', 'parity', 'double'].indexOf(error) < 0) throw new Error('Choose one of the listed transmission errors.');
      var wanted = mode === 'odd' ? 1 : 0, ones = count(data), parity = wanted ^ (ones % 2), sent = data + parity;
      var mask = sent.split('').map(function (_, i) { return ((error === 'single' || error === 'double') && i === 0) || ((error === 'parity' || error === 'double') && i === sent.length - 1) ? '1' : '0'; }).join('');
      var received = sent.split('').map(function (b, i) { return Number(b) ^ Number(mask[i]); }).join(''), receivedOnes = count(received), passed = receivedOnes % 2 === wanted, flips = count(mask);
      function maskDiagram() { return '<div class="vc-transmission"><div><small>Sent packet</small><strong>' + sent + '</strong></div><span>⊕</span><div><small>Error mask</small><strong>' + mask + '</strong></div><span>=</span><div><small>Received packet</small><strong data-received="' + received + '">' + received + '</strong></div></div><p class="vc-caption">A 1 in the mask flips that bit. A 0 keeps it.</p>'; }
      return { frames: [
        { title: 'Count the 1s in the data', explain: 'Only 1s affect parity. This data contains ' + ones + ' one' + (ones === 1 ? '' : 's') + '.', html: packet(data, { label: 'Data ' + data + ', containing ' + ones + ' ones' }) + '<div class="vc-count"><strong>' + ones + '</strong><span>1s in the data</span></div>' },
        { title: 'Choose a parity bit that makes the total ' + mode, explain: ones + ' data 1s + ' + parity + ' parity 1 = ' + (ones + parity) + ' total 1s. The full packet now obeys the ' + mode + ' rule.', html: packet(sent, { parity: true, active: sent.length - 1, label: 'Transmitted packet ' + sent + '; appended parity bit ' + parity }) + '<div class="vw-equation" data-parity="' + parity + '">' + ones + ' + ' + parity + ' = ' + (ones + parity) + ' (' + mode + ')</div>' },
        { title: 'Move the packet through the channel', explain: 'This selected error pattern flips ' + flips + ' bit' + (flips === 1 ? '' : 's') + '. A flipped parity bit matters just like a flipped data bit.', html: maskDiagram() + packet(received, { parity: true, mask: mask, label: 'Received packet ' + received + ', ' + flips + ' bits flipped' }) },
        { title: 'The receiver counts all 1s again', explain: 'Count the data bits and the parity bit together. The receiver sees ' + receivedOnes + ' ones, which is ' + (receivedOnes % 2 ? 'odd' : 'even') + '.', html: packet(received, { parity: true, mask: mask }) + '<div class="vc-count"><strong>' + receivedOnes + '</strong><span>1s in the received packet</span></div>' },
        { title: passed ? 'The parity check passes' : 'The parity check catches an error', explain: passed ? (flips ? 'Two flips preserve the original parity. The packet changed, but this check cannot tell: a pass does not prove the data is correct.' : 'The received packet satisfies the rule. With no selected error, it also matches the transmitted packet.') : 'The received parity breaks the agreed rule. An error is detected, but this one parity bit cannot identify or repair its location.', html: '<div class="vc-verdict ' + (passed ? 'vc-pass' : 'vc-fail') + '" data-status="' + (passed ? 'pass' : 'fail') + '"><strong>' + (passed ? 'Rule satisfied' : 'Error detected') + '</strong><span>' + receivedOnes + ' is ' + (receivedOnes % 2 ? 'odd' : 'even') + ' · expected ' + mode + '</span></div>' + maskDiagram() },
        { title: 'Why one flip is caught and two can hide', explain: 'Every flip toggles the parity. An odd number of flipped bits is detected; any even number preserves the parity. Parity detects errors; it does not correct them.', html: '<div class="vc-toggle-path"><div>Original rule</div><span aria-hidden="true">→</span><div class="vc-flipped">1 flip<br><strong>Rule broken</strong></div><span aria-hidden="true">→</span><div>2 flips<br><strong>Rule restored</strong></div></div>' }
      ], takeaway: 'Count 1s across the entire received packet. A single parity bit detects every odd number of bit flips, but misses every even number of flips.' };
    }
  });

  function xorDiagram(source, output, toGray, active) {
    var n = source.length, width = Math.max(360, 145 + n * 75), left = 105, gap = 75;
    var s = svgOpen(width, 290, (toGray ? 'Binary to Gray' : 'Gray to binary') + ' XOR diagram. Input ' + source + '. ' + (active >= 0 && active < n ? 'Calculating bit ' + (active + 1) + '.' : 'Result ' + output + '.'));
    s += text(14, 39, toGray ? 'Binary' : 'Gray', '#53647c', 16, 'start') + text(14, 246, toGray ? 'Gray' : 'Binary', '#53647c', 16, 'start');
    for (var i = 0; i < n; i++) {
      var x = left + gap * i, selected = active === i;
      s += text(x, 15, 'Bit ' + (i + 1), '#53647c', 12);
      if (i === 0) s += wire('M' + x + ' 66 V211', selected) + text(x + 26, 141, 'copy', selected ? '#164ad1' : '#53647c', 12, 'start');
      else {
        s += wire('M' + x + ' 66 V127', selected);
        if (toGray) s += wire('M' + (x - gap) + ' 66 V98 H' + (x - 27) + ' V147 H' + (x - 20), selected);
        else s += wire('M' + (x - gap) + ' 211 V186 H' + (x - 27) + ' V147 H' + (x - 20), selected);
        s += '<circle cx="' + x + '" cy="147" r="20" fill="' + (selected ? '#e7efff' : '#fff') + '" stroke="' + (selected ? '#164ad1' : '#b7c8e2') + '" stroke-width="2"/>' + text(x, 155, '⊕', selected ? '#164ad1' : '#53647c', 28);
        s += wire('M' + x + ' 167 V211', selected);
      }
      s += tile(x, 25, source[i], selected || (toGray && active === i + 1), false);
      s += tile(x, 211, i <= active ? output[i] : '?', selected, i > active);
    }
    return '<div class="vc-scroll" tabindex="0" role="region" aria-label="Gray conversion wiring. Scroll to inspect all bits.">' + s + '</svg></div><p class="vc-caption">⊕ is XOR: equal bits give 0; different bits give 1. Read from left to right.</p>';
  }
  W.register({
    id: 'binary-gray', title: 'See each XOR in a Gray conversion', lead: 'Trace the wires one bit at a time. Binary → Gray uses original neighbors; Gray → binary carries the converted result forward.',
    inputs: [{ key: 'bits', label: 'Input bits', type: 'text', value: '1011', maxLength: 8, hint: 'Use 1–8 bits. Leading zeros and bit width are preserved.' }, { key: 'direction', label: 'Direction', type: 'select', value: 'binary-gray', options: [{ value: 'binary-gray', label: 'Binary → Gray' }, { value: 'gray-binary', label: 'Gray → binary' }] }],
    presets: [{ label: '1011 binary → Gray', values: { bits: '1011', direction: 'binary-gray' } }, { label: '1110 Gray → binary', values: { bits: '1110', direction: 'gray-binary' } }, { label: 'Keep leading zeros', values: { bits: '00101', direction: 'binary-gray' } }],
    build: function (v) {
      var source = bitInput(v.bits, 8), toGray = v.direction === 'binary-gray';
      if (!toGray && v.direction !== 'gray-binary') throw new Error('Choose Binary → Gray or Gray → binary.');
      var output = source[0];
      for (var i = 1; i < source.length; i++) output += Number(toGray ? source[i - 1] : output[i - 1]) ^ Number(source[i]);
      var frames = [{ title: 'Start at the most significant bit', explain: 'Keep the width at ' + source.length + ' bit' + (source.length === 1 ? '' : 's') + '. Each output bit has a wire showing exactly where its input comes from.', html: xorDiagram(source, output, toGray, -1) }];
      for (var j = 0; j < source.length; j++) {
        var previous = j ? (toGray ? source[j - 1] : output[j - 1]) : '';
        frames.push({ title: j === 0 ? 'Copy the first bit unchanged' : 'Calculate bit ' + (j + 1), explain: j === 0 ? 'The first ' + (toGray ? 'Gray' : 'binary') + ' bit equals the first input bit: ' + source[0] + '.' : (toGray ? 'Use the previous ORIGINAL binary bit and the current binary bit.' : 'Use the previous CONVERTED binary bit and the current Gray bit.'), html: xorDiagram(source, output, toGray, j) + '<div class="vw-equation">' + (j === 0 ? 'Copy ' + source[0] : previous + ' ⊕ ' + source[j] + ' = ' + output[j]) + '</div>' });
      }
      frames.push({ title: 'Read the completed output', explain: source + (toGray ? ' binary = ' : ' Gray = ') + output + (toGray ? ' Gray.' : ' binary.') + ' Gray code labels positions; it is not a positional number system to add using binary place weights.', html: xorDiagram(source, output, toGray, source.length) + '<div class="vw-equation" data-result="' + output + '">' + source + ' → ' + output + '</div>' });
      return { frames: frames, takeaway: toGray ? 'Copy the first bit, then XOR each pair of adjacent original binary bits.' : 'Copy the first bit, then XOR each Gray bit with the binary bit you just produced.' };
    }
  });

  function reflectionDiagram(sequence, prefix, mirrorOnly) {
    var reverse = sequence.slice().reverse(), width = 540, row = 43, h = 72 + row * sequence.length;
    var label = prefix ? 'Prefix 0 to the forward list and 1 to its reflected list.' : 'Mirror the list by reading its codewords from bottom to top.';
    var s = svgOpen(width, h, label);
    s += text(134, 23, prefix ? '0 + original' : 'Original order', '#164ad1', 16) + text(403, 23, prefix ? '1 + reflected' : 'Reflected order', '#126143', 16);
    sequence.forEach(function (code, i) {
      var y = 39 + row * i;
      s += '<rect x="55" y="' + y + '" width="158" height="34" rx="6" fill="#e7efff"/>' + text(134, y + 24, (prefix ? '0' : '') + code, '#14338c', 21);
      s += '<rect x="324" y="' + y + '" width="158" height="34" rx="6" fill="#d9f4e7"/>' + text(403, y + 24, (prefix ? '1' : '') + reverse[i], '#126143', 21);
      if (!prefix) s += wire('M217 ' + (y + 17) + ' L320 ' + (39 + row * (sequence.length - 1 - i) + 17), false);
    });
    if (prefix) s += '<path d="M233 49 V' + (h - 36) + ' H304 V49" fill="none" stroke="#53647c" stroke-width="2"/>' + text(269, h - 8, 'join ↓ then ↓', '#53647c', 13);
    return '<div class="vc-scroll vc-reflection" tabindex="0" role="region" aria-label="Gray reflection diagram">' + s + '</svg></div>';
  }
  function sequenceDiagram(sequence) {
    return '<div class="vc-gray-sequence" role="list" aria-label="Reflected Gray code sequence">' + sequence.map(function (code, i) { return '<div role="listitem"><small>Position ' + i + '</small><strong data-gray="' + code + '">' + code + '</strong>' + (i ? '<span>1 bit changed</span>' : '<span>Start</span>') + '</div>'; }).join('') + '</div>';
  }
  W.register({
    id: 'gray-reflection', title: 'Build Gray code by folding a list', lead: 'Grow a one-bit sequence into eight three-bit positions using reflection and prefixes. No formula memorization needed.',
    inputs: [],
    build: function () {
      var one = ['0', '1'], two = ['00', '01', '11', '10'], three = ['000', '001', '011', '010', '110', '111', '101', '100'];
      return { frames: [
        { title: 'Begin with one bit', explain: 'The simplest sequence is 0, 1. Moving between them changes one bit.', html: sequenceDiagram(one) },
        { title: 'Reflect the whole list', explain: 'Copy the list in reverse order. Reverse the order of the rows; do not reverse the digits inside a row.', html: reflectionDiagram(one, false) },
        { title: 'Prefix the forward half with 0, the reflected half with 1', explain: 'Read the complete left column from top to bottom, then the right column. At the join, 01 → 11 changes only the new prefix.', html: reflectionDiagram(one, true) },
        { title: 'The result is a two-bit Gray sequence', explain: 'There are four positions. Every pair of adjacent codewords differs in exactly one bit.', html: sequenceDiagram(two) },
        { title: 'Reflect the two-bit sequence', explain: 'Keep each codeword intact. The reflected half is 10, 11, 01, 00.', html: reflectionDiagram(two, false) },
        { title: 'Add prefixes again', explain: 'Add 0 to each original row and 1 to each reflected row. The join is 010 → 110: only the first bit changes.', html: reflectionDiagram(two, true) },
        { title: 'Eight positions, one change per move', explain: 'The last codeword 100 also differs from the first 000 by one bit, so the sequence can wrap around on an encoder wheel.', html: sequenceDiagram(three) + '<div class="vw-equation">100 → 000: only the first bit changes</div>' }
      ], takeaway: 'Reflect the existing list, prefix 0 to the original and 1 to the reflection, then join them. Each extra bit doubles the number of positions.' };
    }
  });

  function trackDiagram(width, position, next, type) {
    var total = 1 << width, cw = 43, x0 = 75, w = x0 + total * cw + 16, y0 = 55, row = 42, h = y0 + width * row + 53;
    var s = svgOpen(w, h, width + '-track ' + type + ' encoder strip. Current position ' + position + ', next position ' + next + '. Dark cells are 1; pale cells are 0.');
    for (var p = 0; p < total; p++) s += text(x0 + p * cw + cw / 2, 24, p, p === position ? '#164ad1' : p === next ? '#965100' : '#53647c', 13);
    for (var r = 0; r < width; r++) {
      s += text(8, y0 + r * row + 24, (type === 'Gray' ? 'g' : 'b') + (width - 1 - r), '#53647c', 14, 'start');
      for (var c = 0; c < total; c++) {
        var value = (type === 'Gray' ? gray(bits(c, width)) : bits(c, width))[r];
        s += '<rect x="' + (x0 + c * cw) + '" y="' + (y0 + r * row) + '" width="' + (cw - 2) + '" height="' + (row - 3) + '" rx="3" fill="' + (value === '1' ? '#234b84' : '#e8eef6') + '"/>' + text(x0 + c * cw + (cw - 2) / 2, y0 + r * row + 25, value, value === '1' ? '#fff' : '#142743', 16);
      }
    }
    s += '<rect x="' + (x0 + position * cw - 2) + '" y="' + (y0 - 8) + '" width="' + (cw + 2) + '" height="' + (width * row + 9) + '" rx="5" fill="none" stroke="#164ad1" stroke-width="4"/>';
    s += '<rect x="' + (x0 + next * cw + 2) + '" y="' + (y0 - 5) + '" width="' + (cw - 6) + '" height="' + (width * row + 3) + '" rx="3" fill="none" stroke="#b16b00" stroke-width="3" stroke-dasharray="5 3"/>';
    s += text(x0, h - 13, 'Blue outline: now ' + position + '     Dashed amber: next ' + next, '#53647c', 14, 'start');
    return '<div class="vc-scroll vc-track" tabindex="0" role="region" aria-label="Position encoder sensor tracks. Scroll to inspect all positions.">' + s + '</svg></div><p class="vc-caption">Each horizontal row is a sensor track. Read a vertical column from top to bottom. Dark = 1; pale = 0.</p>';
  }
  function transition(old, next, name) {
    var changes = distance(old, next);
    return '<div class="vc-transition"><strong class="vc-transition-heading">' + name + ': ' + changes + ' bit' + (changes === 1 ? '' : 's') + ' change' + (changes === 1 ? 's' : '') + '</strong><div class="vc-transition-bits">' + old.split('').map(function (b, i) { return '<div class="' + (b !== next[i] ? 'vc-flipped' : '') + '"><small>Bit ' + (i + 1) + '</small><strong>' + b + ' → ' + next[i] + '</strong><span>' + (b !== next[i] ? 'Changes' : 'Stays') + '</span></div>'; }).join('') + '</div><div class="vc-caption" data-transition="' + name.toLowerCase() + '" data-old="' + old + '" data-new="' + next + '" data-changes="' + changes + '">' + old + ' → ' + next + '</div></div>';
  }
  W.register({
    id: 'gray-encoder', title: 'Watch a position encoder move', lead: 'Move between neighboring positions and see which sensor tracks change. Compare ordinary binary with reflected Gray code.',
    inputs: [{ key: 'width', label: 'Sensor tracks', type: 'select', value: '4', options: [{ value: '3', label: '3 tracks · 8 positions' }, { value: '4', label: '4 tracks · 16 positions' }] }, { key: 'position', label: 'Current position', type: 'number', value: '7', hint: '3 tracks: 0–7. 4 tracks: 0–15. The next position wraps to zero.' }],
    presets: [{ label: 'Binary rollover: 7 → 8', values: { width: '4', position: '7' } }, { label: 'Small move: 2 → 3', values: { width: '3', position: '2' } }, { label: 'Wrap around: 15 → 0', values: { width: '4', position: '15' } }],
    build: function (v) {
      var width = Number(v.width), positionText = String(v.position === undefined ? '' : v.position).trim(), position = Number(positionText);
      if (width !== 3 && width !== 4) throw new Error('Choose three or four tracks.');
      if (!/^\d+$/.test(positionText) || !Number.isInteger(position) || position < 0 || position >= 1 << width) throw new Error('Enter a whole position from 0 to ' + ((1 << width) - 1) + ' for ' + width + ' tracks.');
      var next = (position + 1) % (1 << width), oldB = bits(position, width), newB = bits(next, width), oldG = gray(oldB), newG = gray(newB), bChanges = distance(oldB, newB);
      return { frames: [
        { title: 'Read the current position as a vertical slice', explain: width + ' tracks give ' + (1 << width) + ' positions. The outlined binary column at position ' + position + ' reads ' + oldB + '. The next position is ' + next + '.', html: trackDiagram(width, position, next, 'Binary') },
        { title: 'Ordinary binary can change several tracks together', explain: position + ' → ' + next + ' changes ' + bChanges + ' binary bit' + (bChanges === 1 ? '' : 's') + '. ' + (bChanges > 1 ? 'Physical sensors may not switch at exactly the same instant, so an intermediate reading can be ambiguous.' : 'This particular move needs only one binary bit. Other transitions, such as 3 → 4, need several.'), html: transition(oldB, newB, 'Binary') },
        { title: 'Use the Gray pattern on the same tracks', explain: 'The positions have not changed. Their labels now follow the reflected Gray sequence. Position ' + position + ' reads ' + oldG + ', and position ' + next + ' reads ' + newG + '.', html: trackDiagram(width, position, next, 'Gray') },
        { title: 'Exactly one Gray sensor changes', explain: 'Only the highlighted track changes between these neighboring Gray positions. During this transition, ideal independent bit switching can only produce the old codeword or the new one.', html: transition(oldG, newG, 'Gray') },
        { title: 'Compare the same physical move', explain: 'Gray code reduces ambiguity at adjacent position boundaries. It does not correct noisy sensors, skipped positions, or faulty wiring; decoding is still needed to obtain an ordinary binary value.', html: '<div class="vc-encoder-result">' + transition(oldB, newB, 'Binary') + transition(oldG, newG, 'Gray') + '</div><div class="vw-equation">Position ' + position + ' → ' + next + '</div>' }
      ], takeaway: 'Reflected Gray code changes exactly one bit between neighboring positions, including the final-to-first wraparound. That makes it useful for physical position sensors.' };
    }
  });
})();
