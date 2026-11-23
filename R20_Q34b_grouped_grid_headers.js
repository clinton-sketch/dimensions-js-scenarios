/* Row 20 - Add grouped grid headers
   Survey 37 (JS set 3) | Q34b
   Header rows wanted above the column labels (Study | Research | Leisure | Fun):
       Reading Purpose (all 4 columns)
       Learning (Study, Research)  |  Entertainment (Leisure, Fun)
   JS puts the two rows, top row first, in their own <thead> above the grid; radios are untouched.
   They are NOT added to the <tbody>: the template (ipsosfi.js) treats the first <tbody> row as the
   column labels (it hides that row on phones and copies its labels onto each answer card).
   On phones (same 640px cut-off as the template's card layout) the two rows are hidden - each card
   already names its column. The template's "mobile" class alone is not a phone sign: it is set on desktop too.
   Banner: Q34b.Banners.AddNew("Q34b_Head", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q34b',
              rows: [ [['', 1], ['Reading Purpose', 4]],
                      [['', 1], ['Learning', 2], ['Entertainment', 2]] ] };
  var D = DimJS, first = D.inputs(CFG.q, 'radio')[0];
  if (!first) return;
  var table = first.closest('table');
  if (!table || table.querySelector('thead.djs-group-head')) return;
  var thead = document.createElement('thead');
  thead.className = 'djs-group-head';
  CFG.rows.forEach(function (spec) {             /* in order: Reading Purpose, then Learning / Entertainment */
    var tr = thead.insertRow();
    tr.className = 'djs-group-head';
    spec.forEach(function (c) {
      var th = document.createElement('th');
      th.textContent = c[0]; th.colSpan = c[1];
      th.style.textAlign = 'center'; th.style.borderBottom = c[0] ? '1px solid #999' : '';
      tr.appendChild(th);
    });
  });
  table.insertBefore(thead, table.tBodies[0] || table.firstChild);
  D.css('djsGroupHead', '@media only screen and (max-width: 640px){' +
    '.mrQuestionTable.mobile > thead.djs-group-head{display:none}}');
});
