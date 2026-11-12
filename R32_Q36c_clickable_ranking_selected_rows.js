/* Row 32 - Clickable ranking for the selected grid rows
   Survey 37 | Q36c (Genre | Select | Rank)
   Setup : Q36c = loop over genres with Sel categorical [0..1] {_1} and Rank long [1..5]
           (MustAnswer = False) so both render in the same row.
   Routing: validation - ranks given only for selected rows, unique and 1..N (N = rows selected).
   Behaviour: ticking a genre gives it the next rank; unticking removes it and closes the gap.
           Clicking the rank box of a selected genre moves it up one place.
           The grid writes the Select column's header twice (question label, then its category
           label "Select"); the two are merged into one cell (same code as row 17 / Q20).
   Banner: Q36c.Banners.AddNew("R32_Q36c", "<script ... src=""<link>""></script>") before Q36c.Ask(),
           Q36c.Banners.Remove("R32_Q36c") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q36c' };
  var D = DimJS, rows = [];
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
      if (!left) {
        /* Row now empty: cells above that span into it (corner, Name, Brand, merged DK) must
           stop spanning it, or they take over the first data row and push it sideways. */
        for (var p = 0; p < r; p++) {
          Array.prototype.forEach.call(head[p].cells, function (x) {
            if (p + x.rowSpan > r && x.rowSpan > 1) x.rowSpan -= 1;
          });
        }
        head[r].style.display = 'none';
      }
    }
  }
  var firstIn = D.inputs(CFG.q)[0], table = firstIn ? firstIn.closest('table') : null;
  if (table) mergeHeaders(table);

  D.inputs(CFG.q, 'checkbox').forEach(function (cb) {
    var rank = D.inputs(CFG.q, 'text', D.row(cb))[0];
    if (rank) { rank.readOnly = true; rank.style.cursor = 'pointer'; rank.style.width = '3em'; rows.push({ cb: cb, rank: rank }); }
  });
  if (!rows.length) return;

  function ordered() {
    return rows.filter(function (r) { return r.cb.checked && !isNaN(D.num(r.rank.value)); })
               .sort(function (a, b) { return D.num(a.rank.value) - D.num(b.rank.value); });
  }
  function renumber(list) {
    rows.forEach(function (r) { if (!r.cb.checked) r.rank.value = ''; r.rank.style.background = r.cb.checked ? '' : '#eee'; });
    list.forEach(function (r, i) { r.rank.value = i + 1; });
  }
  rows.forEach(function (r) {
    r.cb.addEventListener('change', function () {
      var list = ordered().filter(function (x) { return x !== r; });
      if (r.cb.checked) list.push(r);                       // new selection goes to the bottom
      renumber(list);
    });
    r.rank.addEventListener('click', function () {
      if (!r.cb.checked) return;
      var list = ordered(), i = list.indexOf(r);
      if (i > 0) { list.splice(i, 1); list.splice(i - 1, 0, r); renumber(list); }
    });
  });
  renumber(ordered().concat(rows.filter(function (r) { return r.cb.checked && isNaN(D.num(r.rank.value)); })));
});
