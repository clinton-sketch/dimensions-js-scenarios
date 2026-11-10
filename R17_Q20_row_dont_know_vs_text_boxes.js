/* Row 17 - Row-level Don't know exclusive to the paired text fields
   Survey 36 | Scenario #16 / Q20 (Device 1-3: Device name | Brand | 99 Don't know)
   Setup : Q20 = loop over Device 1-3 with three cells per row:
             Name text, Brand text (MustAnswer = False) and DK categorical [0..1] {_99 "Don't know"}
   Routing: validation per row - either DK, or Name and Brand both answered, never both.
   JS    : ticking Don't know clears and greys out that row's text boxes; typing in a box
           unticks Don't know. The grid writes a categorical column's header twice (question
           label, then its category label underneath); when both say the same thing they are
           merged into one cell, like the Name and Brand headers.
   Banner: Q20.Banners.AddNew("R17_Q20", "<script ... src=""<link>""></script>") before Q20.Ask(),
           Q20.Banners.Remove("R17_Q20") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q20' };
  var D = DimJS;
  var QUOTES = new RegExp('[' + String.fromCharCode(0x2018, 0x2019, 0x60) + ']', 'g');

  function key(cell) {
    return cell.textContent.replace(QUOTES, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  }

  /* Merge a header cell into the one above when both show the same text over the same columns. */
  function mergeHeaders(table) {
    var rows = Array.prototype.slice.call(table.rows), head = [], grid = [], r;
    for (r = 0; r < rows.length; r++) {
      if (rows[r].querySelector('input,select,textarea')) break;
      head.push(rows[r]);
    }
    if (head.length < 2) return;
    /* grid[row][col] = cell occupying that slot (rowspan/colspan aware) */
    head.forEach(function (row, ri) {
      grid[ri] = grid[ri] || [];
      var col = 0;
      Array.prototype.forEach.call(row.cells, function (cell) {
        while (grid[ri][col]) col++;
        cell.djsCol = col;
        for (var y = 0; y < cell.rowSpan && ri + y < head.length; y++) {
          grid[ri + y] = grid[ri + y] || [];
          for (var x = 0; x < cell.colSpan; x++) grid[ri + y][col + x] = cell;
        }
        col += cell.colSpan;
      });
    });
    for (r = 1; r < head.length; r++) {
      Array.prototype.forEach.call(head[r].cells, function (cell) {
        if (cell.style.display === 'none' || key(cell) === '') return;
        var above = grid[r - 1][cell.djsCol];
        if (!above || above === cell || above.djsCol !== cell.djsCol || above.colSpan !== cell.colSpan) return;
        if (key(above) !== key(cell)) return;
        above.rowSpan += cell.rowSpan;
        cell.style.display = 'none';
      });
      var left = Array.prototype.some.call(head[r].cells, function (x) { return x.style.display !== 'none'; });
      if (!left) head[r].style.display = 'none';
    }
  }
  var first = D.inputs(CFG.q)[0], table = first ? first.closest('table') : null;
  if (table) mergeHeaders(table);

  D.inputs(CFG.q, 'checkbox').forEach(function (dk) {
    var tr = D.row(dk); if (!tr) return;
    var texts = D.inputs(CFG.q, 'text', tr);
    function sync() {
      texts.forEach(function (t) { if (dk.checked) D.clear(t); D.disable(t, dk.checked); });
    }
    dk.addEventListener('change', sync);
    texts.forEach(function (t) {
      t.addEventListener('input', function () { if (t.value.trim() !== '' && dk.checked) { dk.checked = false; sync(); } });
    });
    sync();
  });
});
