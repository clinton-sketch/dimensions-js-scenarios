/* Row 50 (scenario 49) - P11: SGLT2 'please specify which treatment' box, and the Other box
   Survey 38 | Patient Record Form, P11 (multiple answer); QNR: IF CODE 11 SELECTED, SHOW (EXCEPT IF P4 OR P4TER>40)
           P11_11bis "please specify which treatment"; Other (please specify).
   Setup : PRF loop fields P11 categorical [1..] {_1 .. _10, _11 "SGLT2 inhibitors", _12 "Other (please specify)"},
           P11_11bis text and P11_Oth text (labels with <span class='djs-q-P11_11bis'></span> / djs-q-P11_Oth);
           routing: both MustAnswer = False. P4 / P4bis / P4ter are on the same page.
   Behaviour: the P11_11bis box sits next to 'SGLT2 inhibitors' and is shown only while SGLT2 is ticked
           AND neither P4 nor P4ter (when asked) is above 40 - it reacts live to P4 / P4bis / P4ter.
           The P11_Oth box sits next to 'Other' and is shown only while Other is ticked.
           A hidden box is emptied, so it is never saved.
           Server: ValPRF (ERR_P11_11bis / ERR_P11_Oth) uses the same rules; routing clears what does not apply.
   Banner: PRF[..].P1.Banners.AddNew("R50_P1", "<mrRef RefType = ""script"" src = ""js_files/R50_P11_sglt2_specify.js"" ...>")
           before each PRF iteration Ask, removed after. */
DimJS.ready(function () {
  var CFG = { q: 'P11', sglt2: '_11', other: '_12', spec: 'P11_11bis', oth: 'P11_Oth',
              ef: 'P4', bis: 'P4bis', ter: 'P4ter', yes: '_1', limit: 40 };
  var D = DimJS;
  if (!D.inputs(CFG.q, 'checkbox').length) return;
  var cbS = D.cat(CFG.q, CFG.sglt2), cbO = D.cat(CFG.q, CFG.other);
  var spec = D.inputs(CFG.spec, 'text')[0], oth = D.inputs(CFG.oth, 'text')[0];
  var ef = D.inputs(CFG.ef, 'text')[0], ter = D.inputs(CFG.ter, 'text')[0];

  function place(box, cb, q, ph, aria) {
    if (!box || !cb) return null;
    var blocks = D.boxes(q);
    box.style.marginLeft = '8px'; box.style.width = '16em';
    box.placeholder = ph; box.setAttribute('aria-label', aria);
    var anchor = cb.closest('label') || D.labelEl(cb) || cb;   /* the template moves the checkbox into its label */
    if (anchor !== cb) { anchor.style.display = 'inline-block'; anchor.style.verticalAlign = 'middle'; }   /* box on the same line */
    box.style.verticalAlign = 'middle';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
    D.show(blocks, false);
    box.addEventListener('input', function () {
      if (box.value.trim() !== '' && !cb.checked) { cb.checked = true; D.fire(cb, 'change'); }
    });
    return box;
  }
  place(spec, cbS, CFG.spec, 'please specify which treatment', 'SGLT2 inhibitor - please specify which treatment');
  place(oth, cbO, CFG.oth, 'please specify', 'Other treatment - please specify');

  function over(el) { var v = el ? D.num(el.value) : NaN; return !isNaN(v) && v > CFG.limit; }
  function sglt2Applies() {
    var terAsked = D.isOn(CFG.bis, CFG.yes);
    return !over(ef) && !(terAsked && over(ter));
  }
  function update() {
    if (spec && cbS) {
      var on = cbS.checked && sglt2Applies();
      spec.style.display = on ? '' : 'none';
      if (!on && spec.value !== '') { spec.value = ''; D.fire(spec, 'change'); }
    }
    if (oth && cbO) {
      oth.style.display = cbO.checked ? '' : 'none';
      if (!cbO.checked && oth.value !== '') { oth.value = ''; D.fire(oth, 'change'); }
    }
  }
  D.inputs(CFG.q, 'checkbox').forEach(function (b) { b.addEventListener('change', update); });
  [ef, ter].forEach(function (el) { if (el) ['input', 'change'].forEach(function (ev) { el.addEventListener(ev, update); }); });
  D.inputs(CFG.bis, 'radio').forEach(function (r) { r.addEventListener('change', function () { setTimeout(update, 0); }); });
  update();
  setTimeout(update, 300);
});
