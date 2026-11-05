/* Row 17 - Row-level Don't know exclusive to the paired text fields
   Survey 36 | Scenario #16 / Q20 (Device 1-3: Device name | Brand | 99 Don't know)
   Setup : Q20 = loop over Device 1-3 with three cells per row:
             Name text, Brand text (MustAnswer = False) and DK categorical [0..1] {_99 "Don't know"}
   Routing: validation per row - either DK, or Name and Brand both answered, never both.
   Banner: Q20.Banners.AddNew("Q20_DK", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q20' };
  var D = DimJS;
  D.inputs(CFG.q, 'checkbox').forEach(function (dk) {
    var tr = D.row(dk); if (!tr) return;
    var texts = D.inputs(CFG.q, 'text', tr);
    function sync() {
      texts.forEach(function (t) { if (dk.checked) D.clear(t); D.disable(t, dk.checked); });
    }
    dk.addEventListener('change', sync);
    texts.forEach(function (t) {
      t.addEventListener('input', function () { if (t.value.trim() !== '' && dk.checked) { dk.checked = false; sync(); } });
    });
    sync();
  });
});
