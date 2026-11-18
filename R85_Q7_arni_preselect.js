/* Row 85 (scenario 84) - Q7 replacement list: ARNI ticked automatically when it was selected in P11
   Survey PC3 | Q7 replacement follow-up. QNR: ARNI AUTOMATICALLY TICKED IF SELECTED IN P11.
   Setup : Q7 loop field Repl (codes as LstHFTreat, _3 = ARNI). Routing lists only the P11 treatments in Repl
           (Categories.Filter = P11 answers, rechecked on every pass, so ARNI is on the page only when it is in P11)
           and pipes the P11_11bis / P11 Other texts into 'SGLT2 inhibitors' / 'Other' (hQ7Spec11 / hQ7Spec12).
   Behaviour: whenever the list is shown ('in place of' chosen, see R84) and nothing is ticked in it yet,
           ARNI is ticked. The respondent can untick it (not locked); nothing else is ticked automatically,
           also when only one treatment would be left.
   Banner: Q7[..].Choice.Banners.AddNew("R85_Q7", "<mrRef RefType = ""script"" src = ""js_files/R85_Q7_arni_preselect.js"" ...>")
           after R84, before each Q7 iteration Ask, removed after. */
DimJS.ready(function () {
  var CFG = { choice: 'Choice', inPlace: '_2', repl: 'Repl', arni: '_3' };
  var D = DimJS, boxes = D.inputs(CFG.repl, 'checkbox'), arni = D.cat(CFG.repl, CFG.arni);
  if (!boxes.length || !arni) return;
  function update() {
    if (!D.isOn(CFG.choice, CFG.inPlace)) return;
    if (boxes.some(function (b) { return b.checked; })) return;
    arni.checked = true; D.fire(arni, 'change');
  }
  /* after R84 has shown / emptied the list */
  D.inputs(CFG.choice, 'radio').forEach(function (r) {
    ['change', 'click'].forEach(function (ev) { r.addEventListener(ev, function () { setTimeout(update, 0); }); });
  });
  update();
  setTimeout(update, 350);
});
