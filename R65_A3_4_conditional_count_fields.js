/* Row 65 - Conditional treatment-event count fields (same page)
   PC1-Modified | A3_4 (single) -> A3_4a (count of new therapies, for r1) / A34b (count of dose
   increases, for r2). Confirm the A34b name and the count ranges with the client.
   Setup : A3_4, A3_4a, A3_4b in one block; A3_4a / A3_4b MustAnswer = False, labels start with
           <span class="djs-q-A3_4a"></span> / <span class="djs-q-A3_4b"></span>.
   Routing: validation - the matching count is required; NULL the other after the ask.
   Banner: block.Banners.AddNew("A3_4_Counts", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'A3_4', map: { '_1': 'A3_4a', '_2': 'A3_4b' } };
  var D = DimJS;
  function sync() {
    Object.keys(CFG.map).forEach(function (code) {
      var q = CFG.map[code], on = D.isOn(CFG.q, code);
      D.show(q, on);
      if (!on) D.inputs(q, 'text').forEach(D.clear);
    });
  }
  D.inputs(CFG.q, 'radio').forEach(function (r) { r.addEventListener('change', sync); });
  sync();
});
