/* Row 44 - Live validation of comorbidity column sums
   Survey 38 (JS set 4) | S14ter, feedback row 3: for each patient-type row, B + C <= A
   Setup : S14ter = loop over the patient types shown (filtered to S14 > 0) with
             A long [0..S14.x] (changed / initiated), B long [0..100] (with T2D), C long [0..100] (with CKD)
           all three in the same row.
   Routing: validation - same rule on submit.
   Banner: S14ter.Banners.AddNew("S14ter_Sum", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'S14ter', msg: 'Patients with T2D + patients with CKD cannot be more than the patients in the first column.' };
  var D = DimJS, rows = [];
  D.inputs(CFG.q, 'text').forEach(function (t) { var tr = D.row(t); if (tr && rows.indexOf(tr) < 0) rows.push(tr); });
  rows.forEach(function (tr, i) {
    var cells = D.inputs(CFG.q, 'text', tr).sort(function (a, b) { return D.col(a) - D.col(b); });
    if (cells.length < 3) return;
    function check() {
      var a = D.num(cells[0].value), b = D.num(cells[1].value), c = D.num(cells[2].value);
      var bad = !isNaN(a) && (isNaN(b) ? 0 : b) + (isNaN(c) ? 0 : c) > a;
      [cells[1], cells[2]].forEach(function (x) { x.style.borderColor = bad ? '#b00020' : ''; });
      var last = tr.cells[tr.cells.length - 1];
      D.message(last.lastChild || last, 'djsS14terErr' + i, bad ? CFG.msg : '');
    }
    cells.forEach(function (x) { x.addEventListener('input', check); });
    check();
  });
});
