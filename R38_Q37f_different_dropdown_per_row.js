/* Row 38 - Different dropdown options for each row
   Survey 37 | Q37f (Fiction / Non-Fiction / Academic / Children's Books)
   Setup : Q37f = loop over the 4 genres; cell Fmt categorical [1..1] holding the UNION of all
           options {_1 Physical, _2 E-book, _3 Audio, _4 Digital, _5 PDF, _6 Interactive},
           routing: Q37f[..].Fmt.Style.Control.Type = ControlTypes.ctDropList
           (server-side safety net: also filter each iteration's categories in routing).
   JS    : removes the options a row is not allowed to show (rows matched by their label text).
   Banner: Q37f.Banners.AddNew("Q37f_Lists", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = {
    q: 'Q37f',
    allowed: {                                               // row label -> allowed option values
      'Fiction':          ['_1', '_2', '_3'],
      'Non-Fiction':      ['_1', '_2', '_3', '_4'],
      'Academic':         ['_1', '_2', '_5'],
      "Children's Books": ['_1', '_6', '_3']
    }
  };
  var D = DimJS;
  D.inputs(CFG.q, 'select').forEach(function (sel) {
    var tr = D.row(sel), rowText = tr ? tr.cells[0].textContent.trim() : '';
    var keep = null;
    Object.keys(CFG.allowed).forEach(function (k) { if (rowText.indexOf(k) === 0) keep = CFG.allowed[k]; });
    if (!keep) return;
    Array.prototype.slice.call(sel.options).forEach(function (o) {
      if (o.value && keep.indexOf(o.value) < 0) { if (o.selected) sel.selectedIndex = 0; o.remove(); }
    });
  });
});
