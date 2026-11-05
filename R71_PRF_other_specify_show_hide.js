/* Row 71 - Conditional Other-specify fields in the patient forms
   PC2 Modified | A2 / A3 / A7 / A9 / A11 / A12
   Setup : each question uses the native other category (e.g. _95 "Other (specify)" other) or a
           separate text question named <Q>_Oth on the same page. Confirm A9 codes 11-13 first.
   Routing: Dimensions already requires the text when Other is ticked; add a validation if text
           without Other must be rejected.
   JS    : the specify box is shown only while its Other is ticked (cleared when unticked).
           One banner on the PRF page covers all listed questions.
   Banner: PRF page/block .Banners.AddNew("PRF_Other", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { questions: ['A2', 'A3', 'A7', 'A9', 'A11', 'A12'], otherCode: '_95' };
  var D = DimJS;
  CFG.questions.forEach(function (q) {
    var cb = D.cat(q, CFG.otherCode);
    if (!cb) return;
    var box = D.inputs(q + '_Oth', 'text')[0] ||
              D.inputs(q, 'text').filter(function (t) { return /_O/.test(t.name); })[0];
    if (!box) return;
    function sync() {
      box.style.display = cb.checked ? '' : 'none';
      if (!cb.checked) box.value = '';
    }
    D.inputs(q, 'checkbox,radio').forEach(function (x) { x.addEventListener('change', sync); });
    sync();
  });
});
