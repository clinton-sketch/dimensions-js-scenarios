/* Row 78 (scenario 77) - Ejection fraction fields: % suffix, P4ter only when needed, patient type
   Survey PC3 | Patient Record Form, P4 ___% [0-100%] (0-39 HFrEF, 40-49 HFmrEF, 50-100 HFpEF),
           P4bis Yes / No, P4ter ___% [0-100%] asked only if P4bis = Yes.
   Setup : PRF loop fields P4 long [0 .. 100], P4bis {_1 Yes, _2 No}, P4ter long [0 .. 100]
           (label has <span class='djs-q-P4ter'></span>); routing: PRF[..].P4ter.MustAnswer = False.
   Behaviour: '%' is shown after both boxes (0-100, whole numbers - digits only); P4ter (question and box)
           is shown only while P4bis = Yes - when hidden it is emptied, so it is never saved; next to P4 the
           patient type is shown live: 0-39 HFrEF, 40-49 HFmrEF, 50-100 HFpEF.
           The server check ValPRF (ERR_P4ter) asks for P4ter when P4bis = Yes; routing clears it otherwise
           and stores the type in hPRF[..].HFType.
   Banner: PRF[..].P1.Banners.AddNew("R78_P1", "<mrRef RefType = ""script"" src = ""js_files/R78_P4_P4ter_ef_percent.js"" ...>")
           before each PRF iteration Ask, removed after. */
DimJS.ready(function () {
  var CFG = { ef: 'P4', bis: 'P4bis', ter: 'P4ter', yes: '_1' };
  var D = DimJS, ef = D.inputs(CFG.ef, 'text')[0], ter = D.inputs(CFG.ter, 'text')[0];
  if (!ef) return;
  var terBlocks = ter ? D.boxes(CFG.ter) : [];

  function pct(el) {
    if (el.type === 'number') el.type = 'text';
    el.maxLength = 3; el.style.width = '3.5em';
    el.setAttribute('inputmode', 'numeric'); el.setAttribute('autocomplete', 'off');
    var s = document.createElement('span'); s.textContent = ' %'; s.style.fontWeight = 'bold';
    el.parentNode.insertBefore(s, el.nextSibling);
    el.addEventListener('input', function () {
      var v = el.value.replace(/[^0-9]/g, '').slice(0, 3);
      if (v !== el.value) el.value = v;
      update();
    });
    return s;
  }
  var efPct = pct(ef);
  if (ter) pct(ter);
  var type = document.createElement('span');
  type.style.marginLeft = '12px'; type.style.color = '#004360'; type.style.fontStyle = 'italic';
  efPct.parentNode.insertBefore(type, efPct.nextSibling);

  function update() {
    var v = D.num(ef.value);
    type.textContent = isNaN(v) || v > 100 ? '' :
      'Patient type: ' + (v >= 50 ? 'HFpEF' : v >= 40 ? 'HFmrEF' : 'HFrEF');
    if (ter) {
      var on = D.isOn(CFG.bis, CFG.yes);
      D.show(terBlocks, on);
      if (!on && ter.value !== '') ter.value = '';        /* hidden: never saved */
    }
  }
  D.inputs(CFG.bis, 'radio').forEach(function (r) { r.addEventListener('change', update); r.addEventListener('click', update); });
  update();
  setTimeout(update, 300);   /* after the template / browser restored values */
});
