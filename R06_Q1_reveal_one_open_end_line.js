/* Row 6 - Reveal one open-end line at a time
   Survey 34 | Q1 (biosimilar awareness)
   Setup : Q1 = text loop with 3 rows (MustAnswer = False) + Q1_DK categorical {_4 "I don't know"}
           on the same page (block).
   Routing: validation - at least line 1 OR DK; DK together with text is an error.
           "Around 50 words": add a word-count check in the validation if it is a hard limit.
   Banner: Block_Q1.Banners.AddNew("Q1_Lines", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q1', dk: 'Q1_DK', dkCode: '_4' };
  var D = DimJS;
  var lines = D.inputs(CFG.q, 'text');
  var dk = D.cat(CFG.dk, CFG.dkCode);
  if (!lines.length) return;
  function holder(t) { return D.row(t) || t.parentElement; }

  function update() {
    var dkOn = !!(dk && dk.checked);
    lines.forEach(function (t, i) {
      if (dkOn) D.clear(t);
      var prevFilled = i === 0 || lines[i - 1].value.trim() !== '';
      var visible = !dkOn && (prevFilled || t.value.trim() !== '');   // never hide a line holding an answer
      holder(t).style.display = visible ? '' : 'none';
    });
  }
  lines.forEach(function (t) {
    t.addEventListener('input', function () { if (dk && t.value.trim() !== '') dk.checked = false; update(); });
  });
  if (dk) dk.addEventListener('change', update);
  update();
});
