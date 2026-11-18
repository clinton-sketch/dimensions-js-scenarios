/* Row 65 (scenario 64) - A3_4a / A3_4b count shown only for the matching A3_4 answer
   Survey PC1 | patient chart, A3 table: A3_4 single answer
     r1 started on new therapy        -> A3_4a number of times new therapy started   [Show if A3_4_r1]
     r2 increase in dose               -> A3_4b number of times the dose was increased [Show if A3_4_r2]
   Setup : A3Blk fields A3_4 categorical [1..1], A3_4a / A3_4b long [1 ..] codes NA (labels carry
           <span class='djs-q-A3_4a'></span> / djs-q-A3_4b); routing: both MustAnswer = False.
   Behaviour: on the same page, A3_4a (question and box) is shown only while r1 is chosen and A3_4b only
           while r2 is chosen; a hidden one is emptied, so it is never saved. Digits only.
           Server: ValPC1A3 (ERR_A3_4a / ERR_A3_4b) asks for the matching count; routing clears the other.
   Banner: PC1Chart[..].A3Blk.A3_1.Banners.AddNew("R65_A3", "<mrRef RefType = ""script"" src = ""js_files/R65_A3_4_show_count.js"" ...>")
           before .A3Blk.Ask() (A3_1 = first question of the page), removed after. */
DimJS.ready(function () {
  var CFG = { q: 'A3_4', show: { _1: 'A3_4a', _2: 'A3_4b' } };
  var D = DimJS;
  if (!D.inputs(CFG.q, 'radio').length) return;
  var parts = Object.keys(CFG.show).map(function (c) {
    var box = D.inputs(CFG.show[c], 'text')[0];
    if (box) box.addEventListener('input', function () {
      var v = box.value.replace(/[^0-9]/g, '');
      if (v !== box.value) box.value = v;
    });
    if (box) box.setAttribute('inputmode', 'numeric');
    return { c: c, box: box, blocks: D.boxes(CFG.show[c]) };
  });
  function update() {
    parts.forEach(function (p) {
      var on = D.isOn(CFG.q, p.c);
      D.show(p.blocks, on);
      if (!on && p.box && p.box.value !== '') p.box.value = '';   /* hidden: never saved */
    });
  }
  D.inputs(CFG.q, 'radio').forEach(function (r) { r.addEventListener('change', update); r.addEventListener('click', update); });
  update();
  setTimeout(update, 300);
});
