/* Complete worked explanations, shared by examples, guided practice and answer sheets. */
(function () {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const $ = (s, host = document) => host.querySelector(s);
  const sub = base => ({2:'₂',8:'₈',10:'₁₀',16:'₁₆'}[base] || '');
  const numbered = items => `<ol class="solution-steps">${items.map((s, i) => `<li><span class="solution-step-number" aria-hidden="true">${i + 1}</span><div><strong>${esc(s.title || 'Step ' + (i + 1))}</strong><p>${esc(s.explanation || s)}</p>${s.math ? `<div class="solution-equation">${esc(s.math)}</div>` : ''}</div></li>`).join('')}</ol>`;
  function tableHTML(t, context = '') {
    return `<div class="solution-table-wrap" tabindex="0" role="region" aria-label="${esc(context ? context + ': ' + t.caption : t.caption)}"><table class="solution-table"><caption>${esc(t.caption)}</caption><thead><tr>${t.headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function html(q) {
    const w = q.worked;
    if (!w) return numbered(q.steps.map((s, i) => ({title:'Step ' + (i + 1), explanation:s})));
    return `<div class="worked-solution" data-worked-id="${esc(q.id)}"><p class="solution-method"><strong>Method:</strong> ${esc(w.method)}</p><p><strong>Start with:</strong> ${esc(w.given)}</p>${(w.tables || []).map(t => tableHTML(t, q.prompt || q.id)).join('')}<p class="solution-section-label"><strong>Follow every step</strong></p>${numbered(w.steps)}<div class="solution-check"><strong>Check the answer</strong><ol>${w.check.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div><p class="solution-pitfall"><strong>Keep in mind:</strong> ${esc(w.pitfall)}</p></div>`;
  }
  function coach(q, count) {
    const w = q.worked;
    if (!w) return '';
    const n = Math.min(count || 0, w.steps.length);
    return `<section class="solution-coach" aria-label="Guided solution help"><strong>Work with me</strong><p>Stuck on a step? Reveal the reasoning as you work. Your answer stays editable.</p><div class="coach-progress" aria-live="polite">${n} of ${w.steps.length} steps shown</div>${n ? numbered(w.steps.slice(0, n)) : ''}${n === w.steps.length ? `<div class="coach-complete"><p><strong>Complete answer: ${esc(q.answer)}</strong></p>${(w.tables || []).map(t => tableHTML(t, q.prompt || q.id)).join('')}<div class="solution-check"><strong>Check the answer</strong><ol>${w.check.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div><p>${esc(w.pitfall)}</p></div>` : ''}<div class="button-row">${n < w.steps.length ? '<button type="button" class="button secondary small" data-coach-next>Show the next step</button><button type="button" class="sample" data-coach-all>Show the complete solution</button>' : '<span class="learned-label" tabindex="-1">The full walkthrough is open. Try writing the answer yourself.</span>'}</div></section>`;
  }
  function discovery() {
    return `<section class="solution-discovery" aria-label="Complete worked examples"><div><span class="tag">Complete worked solutions</span><h2>See how the answer is built.</h2><p>Every operation, every intermediate result, and a final check. Study an example first, or reveal one step while you practise.</p><div class="button-row"><a class="button" href="#quiz-2">Your Quiz #2 · 15 solved conversions</a><a class="button secondary" href="#examples">All 72 worked examples</a></div></div><div class="solution-mini" aria-label="Example of repeated multiplication"><strong>0.8125₁₀ → binary</strong><div><span>0.8125 × 2 = 1.625</span><b>1</b></div><div><span>0.625 × 2 = 1.25</span><b>1</b></div><div><span>0.25 × 2 = 0.5</span><b>0</b></div><div><span>0.5 × 2 = 1</span><b>1</b></div><p>Read the whole parts downward: <strong>0.1101₂</strong></p></div></section>`;
  }
  function fromQuiz(q) {
    const multiply = q.method === 'repeated-multiply';
    const t = multiply ? {
      caption:'Multiply the remainder; keep the whole part as the next digit',
      headers:['Step','Current fraction','Multiply','Whole part → digit','Keep this remainder'],
      rows:q.rows.map((r, i) => [i + 1, r.current, `${r.current} × ${r.base} = ${r.product}`, `${r.digitValue}${String(r.digit) !== String(r.digitValue) ? ' = ' + r.digit : ''}`, r.remainder])
    } : {
      caption:'Give every digit its source-base place value',
      headers:['Position','Digit value','Weight','Contribution','Decimal contribution'],
      rows:q.rows.map(r => [r.position, `${r.digit}${String(r.digit) !== String(r.digitValue) ? ' = ' + r.digitValue : ''}`, r.power < 0 ? `1/${r.denominator}` : `${q.sourceBase}^${r.power}`, r.term, r.decimal])
    };
    return {id:'quiz2-' + q.id,prompt:q.prompt,answer:q.answer,worked:{method:multiply ? `Repeated multiplication by ${q.targetBase}` : `Place values in base ${q.sourceBase}`,given:`${q.input}${sub(q.sourceBase)} → base ${q.targetBase}. ${q.requestedPlaces ? 'Keep ' + q.requestedPlaces + ' fractional digits.' : 'Find the exact value.'}`,steps:q.steps,tables:[t],check:q.check,pitfall:q.formatNote}};
  }
  function quizBody(q) {
    const w = fromQuiz(q);
    const divisions = q.rows.filter(r => r.divisionSteps?.length);
    return `<section class="quiz2-question" data-quiz2-question="${q.id}"><span class="tag">Question ${q.id} · ${q.sourceBase} → ${q.targetBase}</span><h2>${esc(q.prompt)}</h2><div class="solution-answer-pair"><div><span>Your supplied response</span><strong>${esc(q.supplied)}</strong></div><div class="verified-answer"><span>Verified complete numeral</span><strong>${esc(q.answer)}<sub>${q.targetBase}</sub></strong></div></div><div class="solution-setup"><strong>Why this method works</strong><ul>${q.setup.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>${html(w)}${divisions.length ? `<details class="division-detail"><summary>Show how the fractions become decimals, digit by digit</summary>${divisions.map(r => `<div><p><strong>${esc(r.term)} = ${esc(r.decimal)}</strong></p><ol>${r.divisionSteps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>`).join('')}</details>` : ''}${q.precisionNote ? `<div class="solution-precision"><strong>Exact value and precision</strong><p>${esc(q.precisionNote)}</p></div>` : ''}<p class="small-text muted">${esc(q.submittedInterpretation || '')}</p></section>`;
  }
  function quiz2(host, id, ctx) {
    const D = window.QUIZ2_DATA, all = id === 'all', q = D.questions.find(x => String(x.id) === id) || D.questions[0];
    ctx.setHTML(`<div class="breadcrumb"><a href="#practice">Practice & exams</a><span>/</span><span>Quiz #2 solutions</span></div><div class="solution-page-heading"><div><h1>Your Quiz #2,<br>one calculation at a time.</h1><p>${esc(D.intro)}</p></div><div class="button-row"><a class="button secondary small" href="${all ? '#quiz-2/1' : '#quiz-2/all'}">${all ? 'Focus on one question' : 'Read all 15 solutions'}</a><button class="button secondary small" id="print-quiz2">Print all worked solutions</button></div></div><p class="solution-source">${esc(D.sourceNote)}</p><div class="quiz2-layout"><aside class="quiz2-navigation"><label for="quiz2-select">Choose a question</label><select id="quiz2-select">${D.questions.map(x => `<option value="${x.id}" ${x === q ? 'selected' : ''}>${x.id}. ${esc(x.input)}${sub(x.sourceBase)} → base ${x.targetBase}</option>`).join('')}</select><nav class="quiz2-map" aria-label="Quiz #2 questions">${D.questions.map(x => `<a href="#quiz-2/${x.id}" ${!all && x === q ? 'aria-current="page"' : ''} aria-label="Question ${x.id}: ${esc(x.input)} base ${x.sourceBase} to base ${x.targetBase}">${x.id}</a>`).join('')}</nav><details class="quiz2-methods"><summary>The two conversion methods</summary><ol>${D.principles.map(s => `<li>${esc(s)}</li>`).join('')}</ol></details><a href="#examples">More complete worked examples</a></aside><article class="quiz2-paper">${all ? D.questions.map(quizBody).join('') : quizBody(q)}${!all ? `<section class="quiz2-try"><h3>Try this exact question yourself</h3><p>Enter the complete numeral, including 0. for a fraction. Omit the base subscript.</p><form id="quiz2-try-form"><label for="quiz2-answer">Your answer in base ${q.targetBase}</label><div class="quiz2-input-row"><input id="quiz2-answer" autocomplete="off" spellcheck="false" maxlength="100" required><button class="button" type="submit">Check my answer</button></div></form><div id="quiz2-feedback" role="status" aria-live="polite"></div><div class="lesson-actions">${q.id > 1 ? `<a class="button secondary" href="#quiz-2/${q.id - 1}">Previous question</a>` : ''}${q.id < 15 ? `<a class="button" href="#quiz-2/${q.id + 1}">Next worked question</a>` : '<a class="button" href="#practice">Try a practice set</a>'}</div></section>` : ''}</article></div>`);
    $('#quiz2-select', host).onchange = e => location.hash = 'quiz-2/' + e.target.value;
    $('#print-quiz2', host).onclick = () => {
      $('#print-area').innerHTML = `<h1>Quiz #2 · Complete worked solutions</h1><p>${esc(D.sourceNote)}</p>${D.questions.map(quizBody).join('')}`; $('#print-area').querySelectorAll('details').forEach(d => d.open = true); window.print();
    };
    if (!all) $('#quiz2-try-form', host).onsubmit = e => {
      e.preventDefault(); const input = $('#quiz2-answer', host).value.trim(), out = $('#quiz2-feedback', host);
      try {
        const actual = window.LogicEngine.convert(input, q.targetBase, 10).fraction, expected = window.LogicEngine.convert(q.answer, q.targetBase, 10).fraction;
        const hasPlaces = !q.requestedPlaces || (input.split('.')[1] || '').length === q.requestedPlaces;
        out.className = 'solution-check';
        out.textContent = actual === expected ? (hasPlaces ? `Correct: ${q.answer}${sub(q.targetBase)}. Compare each operation with your working above.` : `The value is correct. This question asks for ${q.requestedPlaces} fractional digits: write ${q.answer}${sub(q.targetBase)}.`) : `This is a different value. The exact complete numeral is ${q.answer}${sub(q.targetBase)}. Start with step 1 and compare your place values or remainders.`;
      } catch (err) { out.className = 'error'; out.textContent = err.message; }
    };
  }
  function examples(host, id, ctx) {
    const Q = window.QUESTION_BANK, C = window.COURSE_DATA, q = Q.find(x => x.id === id), module = C.modules.find(m => m.id === id);
    if (q) {
      const m = C.modules.find(x => x.id === q.module), siblings = Q.filter(x => x.module === q.module), i = siblings.indexOf(q);
      ctx.setHTML(`<div class="breadcrumb"><a href="#practice">Practice & exams</a><span>/</span><a href="#examples">Worked examples</a><span>/</span><a href="#examples/${m.id}">${esc(m.title)}</a></div><article class="example-paper"><span class="tag">${esc(m.title)} · ${esc(q.level)}</span><h1>${esc(q.prompt)}</h1><p class="example-answer"><span>Complete answer</span><strong>${esc(q.answer)}</strong></p>${html(q)}<div class="button-row"><button class="button" id="practise-example">Practise this question</button><button class="button secondary" id="print-example">Print complete solution</button></div><div class="lesson-actions">${i ? `<a class="button secondary" href="#examples/${siblings[i - 1].id}">Previous example</a>` : ''}${i < siblings.length - 1 ? `<a class="button secondary" href="#examples/${siblings[i + 1].id}">Next example</a>` : `<a class="button secondary" href="#examples/${m.id}">All module examples</a>`}</div></article>`);
      $('#practise-example', host).onclick = () => ctx.start([q]);
      $('#print-example', host).onclick = () => ctx.print([q], true);
      return;
    }
    ctx.setHTML(`<div class="breadcrumb"><a href="#practice">Practice & exams</a><span>/</span><span>Complete worked examples</span></div><div class="solution-page-heading"><div><h1>Every operation.<br>Every reason. Every check.</h1><p>Study the full solution before attempting a question. These are the same complete explanations used in guided practice, exam reviews, and printed answer sheets.</p></div><a class="button secondary" href="#quiz-2">Your Quiz #2 solutions</a></div><div class="example-filter"><div class="field"><label for="example-module">Topic</label><select id="example-module"><option value="all">All six modules</option>${C.modules.map(m => `<option value="${m.id}" ${m === module ? 'selected' : ''}>${esc(m.title)}</option>`).join('')}</select></div><div class="field"><label for="example-level">Level</label><select id="example-level"><option value="all">All levels</option><option value="foundation">Foundation</option><option value="practice">Practice</option><option value="exam">Exam level</option></select></div><div class="field"><label for="example-search">Find an example</label><input type="search" id="example-search" placeholder="Try binary, XOR, parity…"></div></div><div class="example-results-top"><p id="example-count" aria-live="polite"></p><button class="button secondary small" id="print-examples">Print these worked solutions</button></div><div class="example-grid" id="example-grid"></div>`);
    let filtered = [];
    function draw() {
      const mid = $('#example-module', host).value, level = $('#example-level', host).value, search = $('#example-search', host).value.toLowerCase();
      filtered = Q.filter(x => (mid === 'all' || x.module === mid) && (level === 'all' || x.level === level) && `${x.prompt} ${x.concept}`.toLowerCase().includes(search));
      $('#example-count', host).textContent = `${filtered.length} complete worked examples`;
      $('#example-grid', host).innerHTML = filtered.length ? filtered.map(x => `<a class="example-card" href="#examples/${x.id}"><span>${esc(C.modules.find(m => m.id === x.module).title)} · ${esc(x.level)}</span><h2>${esc(x.prompt)}</h2><p>${esc(x.worked?.method || x.concept)}</p><strong>${x.worked?.steps.length || x.steps.length} explained steps · ${x.worked?.check.length || 1} checks</strong><span class="example-card-action">Open the full solution</span></a>`).join('') : '<p>No examples match. Try a different search or topic.</p>';
      $('#print-examples', host).disabled = !filtered.length;
    }
    ['#example-module','#example-level'].forEach(s => $(s, host).onchange = draw);
    $('#example-search', host).oninput = draw;
    $('#print-examples', host).onclick = () => ctx.print(filtered, true);
    draw();
  }
  window.StudySolutions = {html,coach,discovery,quiz2,examples,fromQuiz,tableHTML};
})();
