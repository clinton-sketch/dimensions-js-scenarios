/* Row 20 - Add grouped grid headers
   Survey 37 (JS set 3) | Q34b
   Header rows wanted above the column labels (Study | Research | Leisure | Fun):
       Reading Purpose (all 4 columns)
       Learning (Study, Research)  |  Entertainment (Leisure, Fun)
   JS inserts the two rows above the grid's own header row; radios are untouched.
   Banner: Q34b.Banners.AddNew("Q34b_Head", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q34b',
              rows: [ [['', 1], ['Reading Purpose', 4]],
                      [['', 1], ['Learning', 2], ['Entertainment', 2]] ] };
  var D = DimJS, first = D.inputs(CFG.q, 'radio')[0];
  if (!first) return;
  var table = first.closest('table'), head = table.rows[0];
  CFG.rows.slice().reverse().forEach(function (spec) {
    var tr = document.createElement('tr');
    tr.className = 'djs-group-head';
    spec.forEach(function (c) {
      var th = document.createElement('th');
      th.textContent = c[0]; th.colSpan = c[1];
      th.style.textAlign = 'center'; th.style.borderBottom = c[0] ? '1px solid #999' : '';
      tr.appendChild(th);
    });
    head.parentNode.insertBefore(tr, head);
  });
});
