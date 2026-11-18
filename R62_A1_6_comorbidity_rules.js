/* Row 62 (scenario 61) - A1_6 comorbidities: Type 1 / Type 2 Diabetes not together, exclusive None,
   specify boxes for Malignancy and Other
   Survey PC1 | patient chart, A1 table, A1_6 (multiple answer):
     [r1 and r2 cannot be selected together]  r1 Type 1 Diabetes / r2 Type 2 Diabetes
     r4 Malignancy (other than CNS) (Please specify type)   r12 Other (please specify)
     r13 Patient has no comorbid conditions [Exclusive]
   Setup : A1Blk fields A1_6 categorical [1..] {use LstPC1Comorb, _13 exclusive}, A1_6_Mal and A1_6_Oth text
           (labels carry <span class='djs-q-A1_6_Mal'></span> / djs-q-A1_6_Oth); routing: both MustAnswer = False.
   Behaviour: ticking Type 1 unticks Type 2 and the other way round; 'no comorbid conditions' unticks every
           other answer (and empties the specify boxes), any other answer unticks it; the Malignancy and Other
           boxes sit next to their answers and are shown only while ticked (emptied when unticked, so never
           saved); typing in a box ticks its answer. The stored answers are the normal A1_6 / A1_6_Mal / A1_6_Oth.
           Server: exclusive in the metadata; ValPC1A1 (ERR_A1_6_T12 / _Mal / _Oth) checks the same rules.
   Banner: PC1Chart[..].A1Blk.A1_1M.Banners.AddNew("R62_A1", "<mrRef RefType = ""script"" src = ""js_files/R62_A1_6_comorbidity_rules.js"" ...>")
           before .A1Blk.Ask(), removed after. */
DimJS.ready(function () {
  var CFG = { q: 'A1_6', pairOff: ['_1', '_2'], none: '_13',
              boxes: [{ c: '_4', q: 'A1_6_Mal', ph: 'please specify type', aria: 'Malignancy - please specify type' },
                      { c: '_12', q: 'A1_6_Oth', ph: 'please specify', aria: 'Other comorbid condition - please specify' }] };
  var D = DimJS, all = D.inputs(CFG.q, 'checkbox');
  if (!all.length) return;
  var none = D.cat(CFG.q, CFG.none), p1 = D.cat(CFG.q, CFG.pairOff[0]), p2 = D.cat(CFG.q, CFG.pairOff[1]);

  var specs = CFG.boxes.map(function (b) {
    var cb = D.cat(CFG.q, b.c), box = D.inputs(b.q, 'text')[0];
    if (!cb || !box) return null;
    var blocks = D.boxes(b.q);
    box.style.marginLeft = '8px'; box.style.width = '16em'; box.style.verticalAlign = 'middle';
    box.placeholder = b.ph; box.setAttribute('aria-label', b.aria);
    var anchor = cb.closest('label') || D.labelEl(cb) || cb;   /* the template moves the checkbox into its label */
    if (anchor !== cb) { anchor.style.display = 'inline-block'; anchor.style.verticalAlign = 'middle'; }   /* box on the same line */
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
    D.show(blocks, false);
    box.addEventListener('input', function () {
      if (box.value.trim() !== '' && !cb.checked) { cb.checked = true; D.fire(cb, 'change'); }
    });
    return { cb: cb, box: box };
  }).filter(Boolean);

  function off(el) { if (el && el.checked) { el.checked = false; D.fire(el, 'change'); } }
  function sync(changed) {
    if (changed && changed.checked) {
      if (changed === none) all.forEach(function (b) { if (b !== none) off(b); });
      else {
        if (none && none.checked) none.checked = false;
        if (changed === p1) off(p2);
        if (changed === p2) off(p1);
      }
    }
    specs.forEach(function (s) {
      s.box.style.display = s.cb.checked ? '' : 'none';
      if (!s.cb.checked && s.box.value !== '') s.box.value = '';   /* not applicable: never saved */
    });
  }
  all.forEach(function (b) { b.addEventListener('change', function () { sync(b); }); });
  sync(null);
  setTimeout(function () { sync(null); }, 300);
});
