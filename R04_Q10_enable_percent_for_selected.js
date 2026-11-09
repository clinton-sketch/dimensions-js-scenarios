/* Row 4 - Enable percentage input only for selected products
   Survey 34 | Q10
   Setup : Q10 = loop over products (ran, Other fix) with two cells per row:
             Sel categorical [0..1] {_1 "Select"}   and   Pct long [0..100]
           so the checkbox and its % box render in the SAME table row (pairing survives randomisation).
           Other-specify text = native other / separate text question in the Other row.
   Routing: validation - Pct required only where Sel is ticked, empty where not, total = 100.
   Banner: on Q10 (first question of the page), added before the page ask, removed after.
   Metadata: every optional text/numeric box on the page (Pct, an Other-specify text question)
           needs codes({ _NA "" NA }) as well as MustAnswer = False, or Dimensions shows
           "Missing Answer(s)" for the blank ones. */
DimJS.ready(function () {
  // sel / pct = the loop's sub-question names. Fields are matched by name, so other boxes in the
  // row (e.g. an Other-specify text question moved into the Other row's label) are ignored.
  var CFG = { q: 'Q10', sel: 'Sel', pct: 'Pct' };
  var D = DimJS, rows = [];
  function sub(el, name) { return new RegExp('_Q' + name + '(?![A-Za-z0-9])', 'i').test(D.norm(el.name)); }
  D.inputs(CFG.q, 'checkbox').filter(function (cb) { return sub(cb, CFG.sel); }).forEach(function (cb) {
    var tr = D.row(cb);
    var pct = tr ? D.inputs(CFG.q, 'text', tr).filter(function (t) { return sub(t, CFG.pct); })[0] : null;
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
