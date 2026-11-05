/* Row 9 - Live count of selected grid options
   Survey 34 | Q3Q0b ("Number of selections: ...")
   Setup : put <span id="Q3Q0bCount">0</span> in the question text where the count must show.
           mode: 'grid' = all ticked cells (default); 'row' also shows a count at the end of each row.
   Banner: Q3Q0b.Banners.AddNew("Q3Q0b_Count", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q3Q0b', spanId: 'Q3Q0bCount', mode: 'grid' };
  var D = DimJS, boxes = D.inputs(CFG.q, 'checkbox');
  if (!boxes.length) return;
  var out = document.getElementById(CFG.spanId) ||
            D.after(boxes[0].closest('table') || boxes[0], CFG.spanId, 'div');

  function update() {
    out.textContent = boxes.filter(function (b) { return b.checked; }).length;
    if (CFG.mode !== 'row') return;
    boxes.forEach(function (b) {
      var tr = D.row(b), last = tr.cells[tr.cells.length - 1];
      var c = D.after(last.lastChild || last, 'djsCnt' + tr.rowIndex, 'span');
      c.textContent = ' (' + D.inputs(CFG.q, 'checkbox', tr).filter(function (x) { return x.checked; }).length + ')';
    });
  }
  boxes.forEach(function (b) { b.addEventListener('change', update); });
  update();
});
