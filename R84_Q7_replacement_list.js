/* Row 84 (scenario 83) - Q7: replacement list shown only for 'in place of', live on the page
   Survey PC3 | Q7 (one page per patient who chose a product at Q6).
           QNR: IF CODE 2 SELECTED AND P11 > 1 CODE SELECTED, SHOW LIST SELECTED IN P11 TO SELECT TREATMENT(S)
           TO BE REPLACED.
   Setup : Q7 loop fields Choice {_1 combination, _2 in place of} and Repl (label has <span class='djs-q-Repl'></span>).
           Routing: Q7 asked only for a patient with a product at Q6; product name and patient summary piped;
           'in combination' filtered out when P11 has ARNI (code 3); Repl lists only the P11 treatments and is
           not on the page when P11 has a single treatment (no autocode).
   Behaviour: Repl (question and answers) is shown only while 'in place of' is chosen; when hidden its ticks
           are removed, so they are never saved. ARNI is ticked by R85 (scenario 84).
           Server: ValQ7 (ERR_Q7Repl) asks for Repl when 'in place of' is chosen; routing clears it otherwise.
   Banner: Q7[..].Choice.Banners.AddNew("R84_Q7", "<mrRef RefType = ""script"" src = ""js_files/R84_Q7_replacement_list.js"" ...>")
           before each Q7 iteration Ask (Choice = first question of the page), removed after. */
DimJS.ready(function () {
  var CFG = { choice: 'Choice', inPlace: '_2', repl: 'Repl' };
  var D = DimJS, boxes = D.inputs(CFG.repl, 'checkbox');
  if (!boxes.length) return;
  var blocks = D.boxes(CFG.repl);
  function update() {
    var on = D.isOn(CFG.choice, CFG.inPlace);
    D.show(blocks, on);
    if (!on) boxes.forEach(function (b) { if (b.checked) { b.checked = false; D.fire(b, 'change'); } });   /* hidden: never saved */
  }
  D.inputs(CFG.choice, 'radio').forEach(function (r) { r.addEventListener('change', update); r.addEventListener('click', update); });
  update();
  setTimeout(update, 300);
});
