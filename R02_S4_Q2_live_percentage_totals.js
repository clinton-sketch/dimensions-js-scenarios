/* Row 2 - Live percentage calculation and totals
   Survey 34 (JS set 1) | S4 + Q2
   Setup : Q2 = numeric loop (rows = 5 products), cell long [1..50].
           If S4 is on an earlier page, pipe it into the Q2 label: <span id="S4Val">{#S4}</span>
   Banner: Q2.Banners.AddNew("Q2_Pct", "<script>...this file...</script>")   ' double every "
   Routing still validates: each row <= S4 and sum of rows = S4 (validation function) -
   the % shown here is display only. */
DimJS.ready(function () {
  var CFG = { q: 'Q2', s4Question: 'S4', s4Span: 'S4Val', decimals: 0 };
  var D = DimJS, cells = D.inputs(CFG.q, 'text');
  if (!cells.length) return;

  var pct = cells.map(function (c, i) {
    var s = D.after(c, 'djsPct' + i, 'span'); s.style.marginLeft = '8px'; return s;
  });
  var table = cells[cells.length - 1].closest('table') || cells[cells.length - 1];
  var total = D.after(table, 'djsQ2Total', 'div'); total.style.marginTop = '8px'; total.style.fontWeight = 'bold';

  function update() {
    var base = D.piped(CFG.s4Span, CFG.s4Question), sum = 0, sumPct = 0;
    cells.forEach(function (c, i) {
      var v = D.num(c.value);
      if (!isNaN(v)) sum += v;
      var p = (!isNaN(v) && base > 0) ? v / base * 100 : NaN;
      if (!isNaN(p)) sumPct += p;
      pct[i].textContent = isNaN(p) ? '- %' : p.toFixed(CFG.decimals) + ' %';
    });
    total.textContent = 'Total: ' + sum + ' of ' + (isNaN(base) ? '?' : base) +
      '   |   ' + sumPct.toFixed(CFG.decimals) + ' %';
    total.style.color = (base > 0 && sum === base) ? '#1b5e20' : '#b00020';
  }
  cells.concat(D.inputs(CFG.s4Question, 'text')).forEach(function (c) {
    c.addEventListener('input', update); c.addEventListener('change', update);
  });
  update();
});
