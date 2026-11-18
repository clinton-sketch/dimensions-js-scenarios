/* Row 63 (scenario 62 page) - A2_5: Other (please specify) box beside the Other answer
   Survey PC1 | patient chart, A2 table, A2_5 Current Insurance Coverage (single answer, r5 Other (please specify:))
   Setup : A2Blk fields A2_5 categorical [1..1] and A2_5_Oth text (label carries <span class='djs-q-A2_5_Oth'></span>);
           routing: A2_5_Oth.MustAnswer = False.
   Behaviour: the A2_5_Oth box is moved onto the same line as 'Other (please specify:)' and its own question
           text is hidden; it is shown only while Other is chosen (emptied otherwise, so never saved);
           typing in it chooses Other. The stored answers are the normal A2_5 / A2_5_Oth answers.
           Server: ValPC1A2 (ERR_A2_5_Oth) checks Other + text go together.
   Banner: PC1Chart[..].A2Blk.A2_1.Banners.AddNew("R63_A2", "<mrRef RefType = ""script"" src = ""js_files/R63_A2_5_other_specify_inline.js"" ...>")
           before .A2Blk.Ask() (A2_1 = first question of the page), removed after. */
DimJS.ready(function () {
  var CFG = { q: 'A2_5', other: '_5', text: 'A2_5_Oth' };
  var D = DimJS, cb = D.cat(CFG.q, CFG.other), box = D.inputs(CFG.text, 'text')[0];
  if (!cb || !box) return;
  var blocks = D.boxes(CFG.text);
  box.style.marginLeft = '8px'; box.style.width = '16em'; box.style.verticalAlign = 'middle';
  box.placeholder = 'please specify';
  box.setAttribute('aria-label', 'Other insurance coverage - please specify');
  function place() {
    var lab = cb.closest('label') || D.labelEl(cb) || cb;   /* the template moves the radio into its label */
    if (lab !== cb) { lab.style.display = 'inline-block'; lab.style.verticalAlign = 'middle'; }
    if (lab.nextSibling !== box) lab.parentNode.insertBefore(box, lab.nextSibling);
  }
  place();
  D.show(blocks, false);
  box.addEventListener('input', function () {
    if (box.value.trim() !== '' && !cb.checked) { cb.checked = true; D.fire(cb, 'change'); }
  });
  function update() {
    box.style.display = cb.checked ? '' : 'none';
    if (!cb.checked && box.value !== '') box.value = '';   /* not applicable: never saved */
  }
  D.inputs(CFG.q, 'radio').forEach(function (r) { r.addEventListener('change', update); r.addEventListener('click', update); });
  update();
  setTimeout(function () { place(); update(); }, 300);   /* after the template has rebuilt the answers */
});
