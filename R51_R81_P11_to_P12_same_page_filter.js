/* Rows 51 and 81 - Carry the P11 treatments into P12 on the same page
   Survey 38 / PC3 | P11 -> P12 ("ONLY SHOW CODES SELECTED IN P11")
   Setup : P11 and P12 = same category list, both on the PRF page. P11 Other / SGLT2 texts:
           native other on P11 code 96 (or P11_Oth text) and P11_11bis text.
   Routing: validation - P12 must be a subset of P11. Never auto-answer P12 when only one is left.
   JS    : P12 shows only the codes ticked in P11 (unticking in P11 also unticks in P12);
           (row 51) the P12 Other and SGLT2 labels show the text typed at P11.
   Banner: PRF page/block .Banners.AddNew("P12_Filter", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { from: 'P11', to: 'P12', otherCode: '_96', sgltCode: '_11',
              otherText: 'P11_Oth', sgltText: 'P11_11bis', pipeTexts: true };
  var D = DimJS;
  var src = D.inputs(CFG.from, 'checkbox'), dst = D.inputs(CFG.to, 'checkbox');
  if (!dst.length) return;
  function holder(b) { return b.closest('tr') || b.closest('li') || b.parentElement; }
  function textOf(q) { var t = D.inputs(q, 'text')[0]; return t ? t.value.trim() : ''; }
  var baseLabel = {};
  dst.forEach(function (b) { var l = D.labelEl(b); if (l) baseLabel[b.value] = l.textContent; });

  function sync() {
    dst.forEach(function (b) {
      var on = D.isOn(CFG.from, b.value);
      holder(b).style.display = on ? '' : 'none';
      if (!on) b.checked = false;
      var l = D.labelEl(b);
      if (!CFG.pipeTexts || !l) return;
      var extra = b.value === CFG.otherCode ? textOf(CFG.otherText) || (D.inputs(CFG.from, 'text').filter(function (t) { return /_O/.test(t.name); })[0] || {}).value
                : b.value === CFG.sgltCode ? textOf(CFG.sgltText) : '';
      l.textContent = baseLabel[b.value] + (extra ? ': ' + extra : '');
    });
  }
  src.forEach(function (b) { b.addEventListener('change', sync); });
  D.inputs(CFG.from, 'text').concat(D.inputs(CFG.otherText, 'text'), D.inputs(CFG.sgltText, 'text'))
   .forEach(function (t) { t.addEventListener('input', sync); });
  sync();
});
