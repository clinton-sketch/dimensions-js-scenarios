/* Row 15 - Collapsible radio questions on one page
   Survey 36 | Scenario #14 / P1-P3 ("CLINICAL CHARACTERISTICS")
   Setup : P1, P2, P3 in one block (Block_P). In each label put a marker so the question text
           becomes the clickable header:  <span class="djs-q-P1"></span>P1. Patient's gender
   JS    : header click opens/closes the answers (hidden with CSS only, so answers still post).
           The first unanswered question and any question with a Dimensions error start open.
   Banner: Block_P.Banners.AddNew("P_Collapse", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { questions: ['P1', 'P2', 'P3'] };
  var D = DimJS, firstOpenDone = false;
  D.css('djsAcc', '.djs-acc-head{cursor:pointer;display:block;padding:6px 0;font-weight:bold}' +
    '.djs-acc-head:before{content:"\\25B6  "}.djs-acc-head.open:before{content:"\\25BC  "}');

  CFG.questions.forEach(function (q) {
    var marker = document.querySelector('.djs-q-' + q), answers = D.inputs(q);
    if (!marker || !answers.length) return;
    var head = marker.closest('.mrQuestionText') || marker.parentElement;
    var body = D.ownBlock(answers[0], q);
    if (body.contains(head)) body = answers[0].closest('table') || answers[0].parentElement;
    head.className += ' djs-acc-head';
    head.setAttribute('role', 'button'); head.setAttribute('tabindex', '0');

    function set(open) {
      body.style.display = open ? '' : 'none';
      head.classList.toggle('open', open); head.setAttribute('aria-expanded', open);
    }
    var hasError = !!(body.querySelector('.mrErrorText') || (head.parentElement && head.parentElement.querySelector('.mrErrorText')));
    var answered = answers.some(function (a) { return a.checked; });
    var open = hasError || (!answered && !firstOpenDone);
    if (open && !answered) firstOpenDone = true;
    set(open);

    head.addEventListener('click', function () { set(body.style.display === 'none'); });
    head.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); head.click(); } });
    answers.forEach(function (a) { a.addEventListener('change', function () { head.title = D.label(a); }); });
  });
});
