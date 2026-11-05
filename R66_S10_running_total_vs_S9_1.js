/* Row 66 - Patient-count total with live mismatch feedback
   PC2 Modified | S10 (three migraine-day bands) must add up to S9_1
   Setup : S10 numeric loop (3 bands). S9_1 is on an earlier page: pipe it into the S10 label as
           <span id="S9_1Val">{#S9_1}</span>  (S9_1 itself is not defined in the file - confirm).
   Routing: validation - sum = S9_1; the "sum < 4" screen-out stays in routing.
   Banner: S10.Banners.AddNew("S10_Sum", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'S10', target: 'S9_1', span: 'S9_1Val' };
  var D = DimJS, cells = D.inputs(CFG.q, 'text');
  if (!cells.length) return;
  var out = D.after(cells[cells.length - 1].closest('table') || cells[cells.length - 1], 'djsS10Total', 'div');
  out.style.fontWeight = 'bold';
  function update() {
    var goal = D.piped(CFG.span, CFG.target), sum = 0;
    cells.forEach(function (c) { var v = D.num(c.value); if (!isNaN(v)) sum += v; });
    out.textContent = 'Total: ' + sum + (isNaN(goal) ? '' : ' of ' + goal);
    out.style.color = isNaN(goal) || sum === goal ? '#1b5e20' : '#b00020';
  }
  cells.forEach(function (c) { c.addEventListener('input', update); });
  update();
});
