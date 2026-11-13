/* Row 38 - Different dropdown options for each row
   Survey 37 | Q37f (Fiction / Non-Fiction / Academic / Children's Books)
   Setup : Q37f = loop over the 4 genres; cell Fmt categorical [1..1] holding the UNION of all
           options {_1 Physical, _2 E-book, _3 Audio, _4 Digital, _5 PDF, _6 Interactive},
           routing: Q37f[..].Fmt.Style.Control.Type = ControlTypes.ctDropList
           and each iteration's categories filtered in routing (the server-side list).
   JS    : safety net - removes any option a row is not allowed to show (rows matched by their
           label text). The player writes option values with doubled underscores ("__1"), so
           values are compared with DimJS.norm(); the "select" prompt option is always kept and
           a row is never left without options.
   Banner: Q37f.Banners.AddNew("R38_Q37f", "<mrRef RefType = ""script"" src = ""js_files/R38_Q37f_different_dropdown_per_row.js"" ...>")
           before Q37f.Ask(), Q37f.Banners.Remove("R38_Q37f") after. */
DimJS.ready(function () {
  var CFG = {
    q: 'Q37f',
    allowed: {                                               // row label -> allowed option codes
      'Fiction':          ['_1', '_2', '_3'],
      'Non-Fiction':      ['_1', '_2', '_3', '_4'],
      'Academic':         ['_1', '_2', '_5'],
      'Children':         ['_1', '_6', '_3']               // "Children's Books" (ASCII-safe match)
    }
  };
  var D = DimJS;
  function code(v) { v = D.norm(v); return v && v.charAt(0) !== '_' ? '_' + v : v; }
  D.inputs(CFG.q, 'select').forEach(function (sel) {
    var tr = D.row(sel), rowText = tr && tr.cells[0] ? tr.cells[0].textContent.trim() : '';
    var keep = null, best = 0;
    Object.keys(CFG.allowed).forEach(function (k) {       // longest matching label wins
      if (rowText.indexOf(k) === 0 && k.length > best) { keep = CFG.allowed[k]; best = k.length; }
    });
    if (!keep) return;
    var opts = Array.prototype.slice.call(sel.options);
    var drop = opts.filter(function (o) { return o.value && keep.indexOf(code(o.value)) < 0; });
    if (drop.length === opts.filter(function (o) { return o.value; }).length) return; /* never empty a list */
    drop.forEach(function (o) { if (o.selected) sel.selectedIndex = 0; o.remove(); });
  });
});
