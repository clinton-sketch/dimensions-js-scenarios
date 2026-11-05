/* Row 42 - Read-only Total column filled from Q39e, plus Physical + Digital must equal Total
   (Q39f copy of R41_R42_Q39d_Q39f_readonly_total_and_row_check.js - CFG set for Q39f)
   Survey 37 | Q39c -> Q39d  and  Q39e -> Q39f
   Setup : Q39d / Q39f = loop over the categories with Tot, Phy, Dig long [0..] in one row.
   Routing (before the ask) - fill the Total cells:
           Q39d[{Fiction}].Tot = Q39c[{Fiction}].Num   (repeat per category, or loop over them)
           Row 42 validation: Phy + Dig = Tot per row.
   JS    : Total cells read-only (still posted); row 42 shows a live per-row error.
   Banner: Q39d.Banners.AddNew("Q39d_RO", "<script>...</script>")             (rowCheck: false)
           Q39f.Banners.AddNew("Q39f_RO", "<script>...</script>")  with CFG.q = 'Q39f', rowCheck: true */
DimJS.ready(function () {
  var CFG = { q: 'Q39f', totalSub: 'Tot', rowCheck: true,
              msg: 'Physical + Digital must equal the Total for this row.' };
  var D = DimJS;
  D.inputs(CFG.totalSub, 'text').filter(function (t) { return D.nameHas(t, CFG.q); }).forEach(function (tot, i) {
    D.lock(tot);
    if (!CFG.rowCheck) return;
    var tr = D.row(tot), parts = D.inputs(CFG.q, 'text', tr).filter(function (t) { return t !== tot; });
    var msgAnchor = tr.cells[tr.cells.length - 1];
    function check() {
      var filled = parts.every(function (p) { return p.value !== ''; });
      var sum = parts.reduce(function (s, p) { var v = D.num(p.value); return s + (isNaN(v) ? 0 : v); }, 0);
      var bad = filled && sum !== D.num(tot.value);
      D.message(msgAnchor.lastChild || msgAnchor, 'djsRowErr' + i, bad ? CFG.msg : '');
    }
    parts.forEach(function (p) { p.addEventListener('input', check); });
    check();
  });
});
