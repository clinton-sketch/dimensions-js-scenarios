/* Row 33 - Disable the unchecked choices after three selections
   Survey 37 | Q36d (select up to 3)
   Setup : Q36d categorical [1..3] - Dimensions also enforces the maximum on the server.
   Banner: Q36d.Banners.AddNew("Q36d_Max", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q36d', max: 3 };
  var D = DimJS, boxes = D.inputs(CFG.q, 'checkbox');
  function sync() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    boxes.forEach(function (b) { if (!b.checked) D.disable(b, n >= CFG.max); else D.disable(b, false); });
  }
  boxes.forEach(function (b) { b.addEventListener('change', sync); });
  sync();
});
