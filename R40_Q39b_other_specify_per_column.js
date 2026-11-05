/* Row 40 - Independent Other-specify box for each column
   Survey 37 | Q39b (Morning | Afternoon | Evening, multi-select per column)
   Setup : Q39b = loop over the formats (rows, last row _96 "Other" fix) with
           _scale categorical [0..] {_1 Morning, _2 Afternoon, _3 Evening} (each column is a
           multi-select) and three text questions Q39b_OthMor / Q39b_OthAft / Q39b_OthEve
           (MustAnswer = False) on the same page. Same pattern as the skill's
           "Multi-Select-per-Column Grid with Other-Specify Text Box Inside the Grid".
   Routing: validation - each column has at least one answer; Other ticked => its text filled;
           text without Other ticked => error.
   JS    : moves each text box into the Other row under its column, shows it only when ticked.
   Banner: Block_Q39b.Banners.AddNew("Q39b_Oth", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q39b', otherCode: '_96', texts: ['Q39b_OthMor', 'Q39b_OthAft', 'Q39b_OthEve'] };
  var D = DimJS;
  var others = D.inputs(CFG.q, 'checkbox').filter(function (b) { return new RegExp('_Q' + CFG.otherCode + '_').test(D.norm(b.name)); })
                .sort(function (a, b) { return D.col(a) - D.col(b); });
  others.forEach(function (cb, i) {
    var q = CFG.texts[i], box = q && D.inputs(q, 'text')[0];
    if (!box) return;
    var blocks = D.boxes(q);
    var cell = cb.closest('td');
    box.style.display = 'block'; box.style.marginTop = '4px'; box.style.width = '90%';
    cell.appendChild(box);                                 // still inside the form -> still posted
    D.show(blocks, false);
    function sync() { box.style.display = cb.checked ? 'block' : 'none'; if (!cb.checked) box.value = ''; }
    cb.addEventListener('change', function () { sync(); if (cb.checked) box.focus(); });
    sync();
  });
});
