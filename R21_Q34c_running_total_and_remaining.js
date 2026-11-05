/* Row 21 - Live total and remaining points
   Survey 37 | Q34c (distribute 100 points)
   Setup : Q34c = numeric loop, cells long [0..100].
   Routing: validation - total = 100 (blank is not treated as 0).
   Banner: Q34c.Banners.AddNew("Q34c_Sum", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q34c', target: 100 };
  var D = DimJS, cells = D.inputs(CFG.q, 'text');
  if (!cells.length) return;
  var table = cells[0].closest('table');
  var tot = table.insertRow(), rem = table.insertRow();
  [[tot, 'Total'], [rem, 'Remaining']].forEach(function (r) {
    r[0].insertCell().innerHTML = '<b>' + r[1] + '</b>';
    var c = r[0].insertCell(); c.style.fontWeight = 'bold';
    while (r[0].cells.length < table.rows[0].cells.length) r[0].insertCell();
  });
  function update() {
    var sum = 0;
    cells.forEach(function (c) { var v = D.num(c.value); if (!isNaN(v)) sum += v; });
    tot.cells[1].textContent = sum;
    rem.cells[1].textContent = CFG.target - sum;
    rem.cells[1].style.color = sum === CFG.target ? '#1b5e20' : '#b00020';
  }
  cells.forEach(function (c) { c.addEventListener('input', update); });
  update();
});
