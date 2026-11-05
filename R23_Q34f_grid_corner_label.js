/* Row 23 - Add a corner label to a grid
   Survey 37 | Q34f  ("Reading Format ↓ / Activity →" in the top-left cell)
   Banner: Q34f.Banners.AddNew("Q34f_Corner", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q34f', text: 'Reading Format ↓ / Activity →' };
  var first = DimJS.inputs(CFG.q, 'radio')[0];
  if (!first) return;
  var corner = first.closest('table').rows[0].cells[0];
  corner.textContent = CFG.text;
  corner.style.fontWeight = 'bold';
  corner.style.whiteSpace = 'nowrap';
});
