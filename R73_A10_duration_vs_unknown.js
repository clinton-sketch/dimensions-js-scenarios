/* Row 73 - Duration inputs exclusive to Unknown
   PC2 Modified | A10 (weeks 0-52, months 0-12, years 0-10, or Unknown)
   Setup : A10_W long [0..52], A10_M long [0..12], A10_Y long [0..10] (MustAnswer = False) and
           A10_Unk categorical [0..1] {_1 "Unknown"} in one block. The three units are NOT
           exclusive to each other - only Unknown is.
   Routing: validation - Unknown xor numbers; not all three zero; confirm whether blanks count as 0.
   Banner: block.Banners.AddNew("A10_Unknown", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { units: ['A10_W', 'A10_M', 'A10_Y'], unknown: 'A10_Unk',
              msg: 'Please enter a duration greater than zero, or select Unknown.' };
  var D = DimJS, unk = D.inputs(CFG.unknown, 'checkbox')[0];
  var boxes = CFG.units.map(function (q) { return D.inputs(q, 'text')[0]; }).filter(Boolean);
  if (!boxes.length) return;
  function sync() {
    var off = !!(unk && unk.checked);
    boxes.forEach(function (b) { if (off) b.value = ''; D.disable(b, off); });
    var filled = boxes.filter(function (b) { return b.value !== ''; });
    var allZero = filled.length === boxes.length && filled.every(function (b) { return D.num(b.value) === 0; });
    D.message(boxes[boxes.length - 1], 'djsA10Err', !off && allZero ? CFG.msg : '');
  }
  boxes.forEach(function (b) {
    b.addEventListener('input', function () { if (b.value !== '' && unk) unk.checked = false; sync(); });
  });
  if (unk) unk.addEventListener('change', sync);
  sync();
});
