/* Row 32 - Clickable ranking for the selected grid rows
   Survey 37 | Q36c (Genre | Select | Rank)
   Setup : Q36c = loop over genres with Sel categorical [0..1] {_1} and Rank long [1..5]
           (MustAnswer = False) so both render in the same row.
   Routing: validation - ranks given only for selected rows, unique and 1..N (N = rows selected).
   Behaviour: ticking a genre gives it the next rank; unticking removes it and closes the gap.
           Clicking the rank box of a selected genre moves it up one place.
   Banner: Q36c.Banners.AddNew("Q36c_Rank", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q36c' };
  var D = DimJS, rows = [];
  D.inputs(CFG.q, 'checkbox').forEach(function (cb) {
    var rank = D.inputs(CFG.q, 'text', D.row(cb))[0];
    if (rank) { rank.readOnly = true; rank.style.cursor = 'pointer'; rank.style.width = '3em'; rows.push({ cb: cb, rank: rank }); }
  });
  if (!rows.length) return;

  function ordered() {
    return rows.filter(function (r) { return r.cb.checked && !isNaN(D.num(r.rank.value)); })
               .sort(function (a, b) { return D.num(a.rank.value) - D.num(b.rank.value); });
  }
  function renumber(list) {
    rows.forEach(function (r) { if (!r.cb.checked) r.rank.value = ''; r.rank.style.background = r.cb.checked ? '' : '#eee'; });
    list.forEach(function (r, i) { r.rank.value = i + 1; });
  }
  rows.forEach(function (r) {
    r.cb.addEventListener('change', function () {
      var list = ordered().filter(function (x) { return x !== r; });
      if (r.cb.checked) list.push(r);                       // new selection goes to the bottom
      renumber(list);
    });
    r.rank.addEventListener('click', function () {
      if (!r.cb.checked) return;
      var list = ordered(), i = list.indexOf(r);
      if (i > 0) { list.splice(i, 1); list.splice(i - 1, 0, r); renumber(list); }
    });
  });
  renumber(ordered().concat(rows.filter(function (r) { return r.cb.checked && isNaN(D.num(r.rank.value)); })));
});
