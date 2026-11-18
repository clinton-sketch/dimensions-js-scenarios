/* Row 79 (scenario 78) - Comorbidities: None exclusive, Other-specify box only when Other is ticked
   Survey PC3 | Patient Record Form, P5 (multiple answer, None EXCLUSIVE, Other (please specify))
   Setup : PRF loop fields P5 categorical [1..] {_1 "None" exclusive, ..., _99 "Other (please specify)"}
           and P5_Oth text (label has <span class='djs-q-P5_Oth'></span>);
           routing: PRF[..].P5_Oth.MustAnswer = False.
   Behaviour: the P5_Oth box is moved next to 'Other (please specify)' and shown only while Other is
           ticked (emptied when unticked, so it is never saved); typing in it ticks Other.
           None unticks every other comorbidity (and empties the Other box); ticking any other
           comorbidity unticks None. Each patient form has its own answers (one page per form).
           Server: None is exclusive in the metadata; ValPRF (ERR_P5_Oth) checks Other + text go together.
   Banner: PRF[..].P1.Banners.AddNew("R79_P1", "<mrRef RefType = ""script"" src = ""js_files/R79_P5_none_other_specify.js"" ...>")
           before each PRF iteration Ask, removed after. */
DimJS.ready(function () {
  var CFG = { q: 'P5', none: '_1', other: '_99', text: 'P5_Oth' };
  var D = DimJS, boxes = D.inputs(CFG.q, 'checkbox');
  if (!boxes.length) return;
  var none = D.cat(CFG.q, CFG.none), oth = D.cat(CFG.q, CFG.other);
  var txt = D.inputs(CFG.text, 'text')[0];

  if (txt && oth) {
    var txtBlocks = D.boxes(CFG.text);
    txt.style.marginLeft = '8px'; txt.style.width = '16em';
    txt.placeholder = 'please specify';
    txt.setAttribute('aria-label', 'Other comorbidity - please specify');
    var anchor = oth.closest('label') || D.labelEl(oth) || oth;   /* the template moves the checkbox into its label */
    if (anchor !== oth) { anchor.style.display = 'inline-block'; anchor.style.verticalAlign = 'middle'; }   /* box on the same line */
    txt.style.verticalAlign = 'middle';
    anchor.parentNode.insertBefore(txt, anchor.nextSibling);
    D.show(txtBlocks, false);
    txt.addEventListener('input', function () {
      if (txt.value.trim() !== '' && !oth.checked) { oth.checked = true; D.fire(oth, 'change'); }
    });
  }

  function sync(changed) {
    if (none && changed === none && none.checked) {
      boxes.forEach(function (b) { if (b !== none && b.checked) { b.checked = false; D.fire(b, 'change'); } });
    } else if (none && changed && changed !== none && changed.checked && none.checked) {
      none.checked = false; D.fire(none, 'change');   /* template restyles the label on change */
    }
    if (txt && oth) {
      txt.style.display = oth.checked ? '' : 'none';
      if (!oth.checked && txt.value !== '') txt.value = '';   /* not applicable: never saved */
    }
  }
  boxes.forEach(function (b) { b.addEventListener('change', function () { sync(b); }); });
  sync(null);
  setTimeout(function () { sync(null); }, 300);
});
