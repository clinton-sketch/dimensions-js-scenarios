/* Row 39 - Selecting Purchase automatically selects Read
   Survey 37 | Q39a (Genre | Read | Purchase)
   Setup : Q39a = multi-select grid (rows = genres, columns {_1 Read, _2 Purchase}).
   Routing: validation per row - Purchase without Read is an error.
   Behaviour: Purchase ticks Read; Read cannot be unticked while Purchase is ticked.
           Unticking Purchase leaves Read as it is.
   Banner: Q39a.Banners.AddNew("Q39a_Read", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q39a', read: '_1', purchase: '_2' };
  var D = DimJS, seen = [];
  D.inputs(CFG.q, 'checkbox').forEach(function (b) {
    var tr = D.row(b); if (!tr || seen.indexOf(tr) >= 0) return; seen.push(tr);
    var read = D.cat(CFG.q, CFG.read, tr), buy = D.cat(CFG.q, CFG.purchase, tr);
    if (!read || !buy) return;
    buy.addEventListener('change', function () { if (buy.checked) read.checked = true; });
    read.addEventListener('click', function (e) { if (buy.checked && !read.checked) { e.preventDefault(); read.checked = true; } });
  });
});
