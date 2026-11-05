/* Rows 48 and 78 - Conditional ejection-fraction field and % labels
   Survey 38 / PC3 | P4 / P4bis / P4ter on the patient record form (one page)
   Setup : P4 long [0..100], P4bis categorical {_1 Yes, _2 No}, P4ter long [0..100]
           (MustAnswer = False), P4ter label starts with <span class="djs-q-P4ter"></span>.
   Routing: validation - P4ter required only if P4bis = {_1}; after the ask NULL it otherwise.
           EF category (0-39 HFrEF, 40-49 HFmrEF, 50-100 HFpEF) derived into a hidden variable.
   JS    : % after both boxes, shows the EF category next to P4, shows P4ter only for Yes.
   Banner: PRF page/block .Banners.AddNew("P4_EF", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { p4: 'P4', bis: 'P4bis', yes: '_1', ter: 'P4ter' };
  var D = DimJS, p4 = D.inputs(CFG.p4, 'text')[0], ter = D.inputs(CFG.ter, 'text')[0];
  [p4, ter].forEach(function (b, i) {
    if (!b) return;
    var s = D.after(b, 'djsPct' + i, 'span'); s.textContent = ' %';
  });
  var cat = p4 ? D.after(document.getElementById('djsPct0'), 'djsEFcat', 'span') : null;
  if (cat) { cat.style.marginLeft = '10px'; cat.style.fontStyle = 'italic'; }

  function sync() {
    if (p4 && cat) {
      var v = D.num(p4.value);
      cat.textContent = isNaN(v) || v < 0 || v > 100 ? '' : v < 40 ? '(HFrEF)' : v < 50 ? '(HFmrEF)' : '(HFpEF)';
    }
    var on = D.isOn(CFG.bis, CFG.yes);
    D.show(CFG.ter, on);
    if (!on && ter) ter.value = '';
  }
  if (p4) p4.addEventListener('input', sync);
  D.inputs(CFG.bis, 'radio').forEach(function (r) { r.addEventListener('change', sync); });
  sync();
});
