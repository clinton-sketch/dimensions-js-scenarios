/* Row 4 - Enable percentage input only for selected products
   Survey 34 | Q10
   Setup : Q10 = loop over products (ran, Other fix) with two cells per row:
             Sel categorical [0..1] {_1 "Select"}   and   Pct long [0..100]
           so the checkbox and its % box render in the SAME table row (pairing survives randomisation).
           Other-specify text = native other / separate text question in the Other row.
   Routing: validation - Pct required only where Sel is ticked, empty where not, total = 100.
   Banner: Q10.Banners.AddNew("Q10_Pct", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q10' };
  var D = DimJS, rows = [];
  D.inputs(CFG.q, 'checkbox').forEach(function (cb) {
    var tr = D.row(cb);
    var pct = tr ? D.inputs(CFG.q, 'text', tr).filter(function (t) { return !/_O/.test(t.name); })[0] : null;
    if (pct) rows.push({ cb: cb, pct: pct });
  });
  if (!rows.length) return;
  var total = D.after(rows[0].cb.closest('table'), 'djsQ10Total', 'div');
  total.style.fontWeight = 'bold';

  function update() {
    var sum = 0;
    rows.forEach(function (r) {
      if (!r.cb.checked) r.pct.value = '';
      D.disable(r.pct, !r.cb.checked);          // disabled = not posted
      var v = D.num(r.pct.value); if (!isNaN(v)) sum += v;
    });
    total.textContent = 'Total: ' + sum + ' %';
    total.style.color = sum === 100 ? '#1b5e20' : '#b00020';
  }
  rows.forEach(function (r) {
    r.cb.addEventListener('change', function () { update(); if (r.cb.checked) r.pct.focus(); });
    r.pct.addEventListener('input', update);
  });
  update();
});
