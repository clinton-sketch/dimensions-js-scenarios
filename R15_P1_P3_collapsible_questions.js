/* Row 15 - Collapsible radio questions on one page
   Survey 36 | Scenario #14 / P1-P3 ("CLINICAL CHARACTERISTICS")
   Setup : P1, P2, P3 in one block (Block_P). In each label put a marker so the question text
           becomes the clickable header:  <span class="djs-q-P1"></span>P1. Patient's gender
   JS    : header click opens/closes the answers (hidden with CSS only, so answers still post).
           Picking an answer closes that question, shows the answer in its header and opens
           the next unanswered one. The first unanswered question and any question with a
           Dimensions error start open.
   Banner: on the block's FIRST QUESTION, not the block (a banner on the block itself is not
           rendered by the player):
             Block_P.P1.Banners.AddNew("R15_BlockP", "<script ... src=""<link>""></script>")
             Block_P.Ask()
             Block_P.P1.Banners.Remove("R15_BlockP") */
DimJS.ready(function () {
  var CFG = { questions: ['P1', 'P2', 'P3'], closeDelay: 300 };
  var D = DimJS, items = [];
  D.css('djsAcc', '.djs-acc-head{cursor:pointer;display:block;padding:6px 0;font-weight:bold}' +
    '.djs-acc-head:before{content:"\\25B6  "}.djs-acc-head.open:before{content:"\\25BC  "}' +
    '.djs-acc-pick{font-weight:normal;color:#555;margin-left:8px}');

  CFG.questions.forEach(function (q) {
    var marker = document.querySelector('.djs-q-' + q), answers = D.inputs(q, 'radio,checkbox');
    if (!marker || !answers.length) return;
    var head = marker.closest('.mrQuestionText') || marker.parentElement;
    var body = D.ownBlock(answers[0], q);
    if (body.contains(head)) body = answers[0].closest('table') || answers[0].parentElement;
    if (head.classList.contains('djs-acc-head')) return;       /* already set up */
    head.classList.add('djs-acc-head');
    head.setAttribute('role', 'button'); head.setAttribute('tabindex', '0');
    var pick = document.createElement('span'); pick.className = 'djs-acc-pick';
    head.appendChild(pick);

    /* Dimensions error for THIS question: inside its answers, or just above its text */
    var hasError = !!body.querySelector('.mrErrorText') || D.lead(body).some(function (el) {
      return el.classList.contains('mrErrorText') || !!el.querySelector('.mrErrorText');
    });
    items.push({ q: q, head: head, body: body, pick: pick, answers: answers, hasError: hasError });
  });

  function answered(it) { return it.answers.some(function (a) { return a.checked; }); }
  function set(it, open) {
    it.body.style.display = open ? '' : 'none';
    it.head.classList.toggle('open', open); it.head.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function showPick(it) {
    var on = it.answers.filter(function (a) { return a.checked; }).map(D.label);
    it.pick.textContent = on.length ? '(' + on.join(', ') + ')' : '';
  }

  var firstOpenDone = false;
  items.forEach(function (it) {
    var open = it.hasError || (!answered(it) && !firstOpenDone);
    if (open && !answered(it)) firstOpenDone = true;
    set(it, open); showPick(it);

    it.head.addEventListener('click', function () { set(it, it.body.style.display === 'none'); });
    it.head.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); it.head.click(); }
    });
    it.answers.forEach(function (a) {
      a.addEventListener('change', function () {
        showPick(it);
        if (a.type !== 'radio') return;                       /* multi-choice stays open */
        setTimeout(function () {
          set(it, false);
          var next = items.filter(function (x) { return !answered(x); })[0];
          if (next) set(next, true);
        }, CFG.closeDelay);
      });
    });
  });
});
