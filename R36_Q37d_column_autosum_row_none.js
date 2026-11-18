/* Row 36 - Column auto-sums with a row-level None
   Survey 37 | Q37d (rows = formats; Fiction | Non-Fiction | Academic | None)
   Setup : Q37d = loop over formats with Fic, Non, Aca long [0..] (MustAnswer = False) and
           None categorical [0..1] {_1 "None"} - all four render in the same row.
   Routing: validation per row - None xor at least one number.
   Behaviour: None clears and disables the row's numbers (cleared, not restored, when unticked).
   Banner: Q37d.Banners.AddNew("Q37d_Sum", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q37d' };
  var D = DimJS, cells = D.inputs(CFG.q, 'text');
  if (!cells.length) return;
  var table = cells[0].closest('table');

  /* None header shown once: the None column is a categorical sub-question, so the player adds a
     second header row with its category label ("None" again). Drop that row and let the first
     header row stand alone (cells that spanned both rows now span one). Display only. */
  var rows = Array.prototype.slice.call(table.rows), first = -1;
  for (var r = 0; r < rows.length; r++) { if (rows[r].querySelector('input')) { first = r; break; } }
  if (first === 2) {
    Array.prototype.forEach.call(rows[0].cells, function (c) { if (c.rowSpan > 1) c.rowSpan = c.rowSpan - 1; });
    rows[1].parentNode.removeChild(rows[1]);
  }

  var cols = [];
  cells.forEach(function (c) { var i = D.col(c); if (cols.indexOf(i) < 0) cols.push(i); });
  cols.sort(function (a, b) { return a - b; });
  var tot = table.insertRow(); tot.className = 'djs-total';
  for (var i = 0; i < table.rows[0].cells.length; i++) tot.insertCell();
  tot.cells[0].innerHTML = '<b>Total</b>';

  function update() {
    D.inputs(CFG.q, 'checkbox').forEach(function (none) {
      D.inputs(CFG.q, 'text', D.row(none)).forEach(function (c) { if (none.checked) c.value = ''; D.disable(c, none.checked); });
    });
    cols.forEach(function (ci) {
      var s = 0;
      cells.forEach(function (c) { if (D.col(c) === ci) { var v = D.num(c.value); if (!isNaN(v)) s += v; } });
      tot.cells[ci].innerHTML = '<b>' + s + '</b>';
    });
  }
  D.inputs(CFG.q).forEach(function (e) { e.addEventListener('input', update); e.addEventListener('change', update); });
  update();
});
