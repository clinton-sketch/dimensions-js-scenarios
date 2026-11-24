/* Row 55 (scenario 54) - Q7: replacement list shown only for 'in place of', ARNI ticked in advance
   Survey 38 | Q7 (one page per patient who chose a product at Q6).
           QNR: IF CODE 2 SELECTED AND P11 > 1 CODE SELECTED, SHOW LIST SELECTED IN P11 TO SELECT TREATMENT(S)
           TO BE REPLACED; ARNI AUTOMATICALLY TICKED IF SELECTED IN P11.
   Setup : Q7 loop fields Choice {_1 combination, _2 in place of} and Repl (label has <span class='djs-q-Repl'></span>).
           Routing: Repl lists only the P11 treatments (with the P11 specify texts piped), is hidden when P11 has
           a single treatment (no autocode), and is pre-set to ARNI when ARNI is in P11.
   Behaviour: Repl (question and answers) is shown only while 'in place of' is chosen; when hidden its ticks
           are removed (never saved) and when shown again the ticks set by the routing (ARNI) come back.
           ARNI is also ticked when the list opens empty after an error page (the routing tick was lost).
           Server: ValQ7 (ERR_Q7Repl) asks for Repl when 'in place of' is chosen; routing clears it otherwise.
   Banner: Q7[..].Choice.Banners.AddNew("R55_Q7", "<mrRef RefType = ""script"" src = ""js_files/R55_Q7_replacement_list.js"" ...>")
           before each Q7 iteration Ask (Choice = first question of the page), removed after. */
DimJS.ready(function () {
  var CFG = { choice: 'Choice', inPlace: '_2', repl: 'Repl', arni: '_3' };
  var D = DimJS, boxes = D.inputs(CFG.repl, 'checkbox');
  /* one treatment only: the routing hides Repl (Style.Hidden -> visibility: hidden) and saves
     nothing (no autocode) - leave it hidden and unticked */
  if (boxes.length < 2 || getComputedStyle(boxes[0]).visibility === 'hidden') return;
  var blocks = D.boxes(CFG.repl);
  var preset = boxes.filter(function (b) { return b.defaultChecked || b.checked; });
  /* After an error the page comes back with what was posted - an empty list if it was hidden -
     so the routing's ARNI tick is gone. Repl lists only the P11 treatments, so an ARNI box on
     the page means ARNI was chosen at P11: use it as the preset. */
  var arni = D.cat(CFG.repl, CFG.arni);
  if (!preset.length && arni) preset = [arni];
  var wasOn = null;
  function update() {
    var on = D.isOn(CFG.choice, CFG.inPlace);
    D.show(blocks, on);
    if (!on) boxes.forEach(function (b) { b.checked = false; });              /* hidden: never saved */
    else if (wasOn === false && !boxes.some(function (b) { return b.checked; }))
      preset.forEach(function (b) { b.checked = true; D.fire(b, 'change'); });   /* ARNI ticked when shown */
    wasOn = on;
  }
  D.inputs(CFG.choice, 'radio').forEach(function (r) { r.addEventListener('change', update); r.addEventListener('click', update); });
  update();
  setTimeout(update, 300);
});
