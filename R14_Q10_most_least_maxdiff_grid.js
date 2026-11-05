/* Row 14 - Most / least appealing (MaxDiff-style) grid
   Survey 36 | Scenario #13 / Q10
   Setup : two single-select questions over the same 4 names, in one block (Block_Q10):
             Q10_Most categorical [1..1] {_1.._4}   and   Q10_Least categorical [1..1] {_1.._4}
   Routing: validation - Q10_Most <> Q10_Least.
   JS    : rebuilds them as one table  [Most o] [name] [o Least]  by MOVING the real radios
           (moved inputs are still posted), hides the original layout, and disables the same
           item in the other column.
   Banner: Block_Q10.Banners.AddNew("Q10_MaxDiff", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { most: 'Q10_Most', least: 'Q10_Least', head: ['Most Appealing', '', 'Least Appealing'] };
  var D = DimJS;
  var most = D.inputs(CFG.most, 'radio'), least = D.inputs(CFG.least, 'radio');
  if (!most.length || most.length !== least.length) return;
  var oldBlocks = D.boxes(CFG.most).concat(D.boxes(CFG.least));

  var t = document.createElement('table');
  t.className = 'djs-maxdiff';
  t.innerHTML = '<thead><tr><th>' + CFG.head.join('</th><th>') + '</th></tr></thead><tbody></tbody>';
  oldBlocks[0].parentNode.insertBefore(t, oldBlocks[0]);
  most.forEach(function (m) {
    var l = least.filter(function (x) { return x.value === m.value; })[0];
    var tr = t.tBodies[0].insertRow();
    tr.insertCell().appendChild(m);
    tr.insertCell().textContent = D.label(m);
    tr.insertCell().appendChild(l);
  });
  D.show(oldBlocks, false);
  D.css('djsMaxDiff', '.djs-maxdiff{border-collapse:collapse;margin:8px 0}' +
    '.djs-maxdiff td,.djs-maxdiff th{border:1px solid #ccc;padding:6px 12px;text-align:center}' +
    '.djs-maxdiff td:nth-child(2){text-align:left}');

  function sync() {
    most.forEach(function (m, i) {
      var l = least.filter(function (x) { return x.value === m.value; })[0];
      D.disable(l, m.checked); D.disable(m, l.checked);
    });
  }
  most.concat(least).forEach(function (r) { r.addEventListener('change', sync); });
  sync();
});
