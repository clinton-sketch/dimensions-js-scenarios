/* Row 71 (scenario 70) - Other (please specify) boxes beside their answers, only when selected
   Survey PC2 | patient record: A2 (_95), A3 (_95), A7 (_6) on the demographics page and A9 (_95), A11 (_95),
           A12 (_95) on the treatment history page. QNR: show and validate each Other text only when its Other
           answer is selected; keep the patient records independent.
   Setup : each Other answer has its own text question (A2_Oth, A3_Oth, A7_Oth, A9_Oth, A11_Oth, A12_Oth; labels
           carry <span class='djs-q-A2_Oth'></span> etc.); routing: all MustAnswer = False and they are cleared
           when Other is not selected.
   Behaviour: every pair found on the page is handled - the box is moved onto the same line as its Other answer
           (the template's full-width answer label is made inline-block) and its own question text is hidden; it is
           shown only while Other is selected (emptied otherwise, so never saved - no hidden-field errors on return);
           typing in it selects Other. The stored answers are the normal question / text answers.
           Server: ValPC2Demo / ValPC2Treat (ERR_A2_Oth ... ERR_A12_Oth) check Other + text go together.
   Banner: PC2PRF[..].DemoBlk.A1.Banners.AddNew("R71_A1", ...) and PC2PRF[..].TreatBlk.A9.Banners.AddNew("R71_A9", ...)
           with src = ""js_files/R71_PRF_other_specify_inline.js"", before each page's Ask, removed after. */
DimJS.ready(function () {
  var CFG = [
    { q: 'A2', c: '_95', t: 'A2_Oth' }, { q: 'A3', c: '_95', t: 'A3_Oth' }, { q: 'A7', c: '_6', t: 'A7_Oth' },
    { q: 'A9', c: '_95', t: 'A9_Oth' }, { q: 'A11', c: '_95', t: 'A11_Oth' }, { q: 'A12', c: '_95', t: 'A12_Oth' }
  ];
  var D = DimJS;
  CFG.forEach(function (p) {
    var cb = D.cat(p.q, p.c), box = D.inputs(p.t, 'text')[0];
    if (!cb || !box) return;
    var blocks = D.boxes(p.t);
    box.style.marginLeft = '8px'; box.style.width = '16em'; box.style.verticalAlign = 'middle';
    box.placeholder = 'please specify';
    box.setAttribute('aria-label', p.q + ' - Other: please specify');
    function place() {
      var lab = cb.closest('label') || D.labelEl(cb) || cb;   /* the template moves the input into its label */
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
    D.inputs(p.q, 'radio,checkbox').forEach(function (r) { r.addEventListener('change', update); r.addEventListener('click', update); });
    update();
    setTimeout(function () { place(); update(); }, 300);   /* after the template has rebuilt the answers */
  });
});
