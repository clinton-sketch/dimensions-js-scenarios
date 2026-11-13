/* Row 40 - Independent Other-specify box for each column, shown in the Other row
   Survey 37 | Q39b (Morning | Afternoon | Evening, multi-select per column)
   Setup : set up like Q10 / Q10_oth1:
             Q39b loop over the formats, Other row label  _96 "Other<span id='q39b_oth'></span>" fix,
             _scale categorical [0..] {_1 Morning, _2 Afternoon, _3 Evening} (each column a multi-select)
             Q39b_OthMor / Q39b_OthAft / Q39b_OthEve  text, codes NA, MustAnswer = False,
             on PageQ39b after Q39b.
           This file moves the three text boxes into that span (no inline JS in the label).
   Behaviour: a column's box is shown in the Other row only while that column's Other checkbox
           is ticked; unticking hides AND empties it, so a hidden box never blocks the page.
   Routing: ValQ39b - at least one answer per column (ERR_Q39b); Other ticked in a column needs
           that column's text (ERR_Q39b_2); text needs Other ticked in that column (ERR_Q39b_3).
   Banner: Q39b.Banners.AddNew("R40_Q39b", "<mrRef RefType = ""script"" src = ""js_files/R40_Q39b_other_specify_per_column.js"" ...>")
           before PageQ39b.Ask(), Q39b.Banners.Remove("R40_Q39b") after. */
DimJS.ready(function () {
  var CFG = {
    q: 'Q39b', otherCode: '_96', slot: 'q39b_oth',
    texts: ['Q39b_OthMor', 'Q39b_OthAft', 'Q39b_OthEve'],     // column order: Morning, Afternoon, Evening
    names: ['Morning', 'Afternoon', 'Evening']
  };
  var D = DimJS;
  var slot = document.getElementById(CFG.slot);
  var others = D.inputs(CFG.q, 'checkbox').filter(function (b) {
    return new RegExp('_Q' + CFG.otherCode + '_').test(D.norm(b.name));
  }).sort(function (a, b) { return D.col(a) - D.col(b); });
  if (!slot || !others.length) return;

  D.css('djsQ39bOth',
    '#' + CFG.slot + '{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:6px;max-width:100%}' +
    '#' + CFG.slot + ' .djs-oth-item{display:flex;align-items:center;gap:6px;max-width:100%;min-width:0}' +
    '#' + CFG.slot + ' .djs-oth-item span{font-size:90%;white-space:nowrap}' +
    '#' + CFG.slot + ' input{width:12em!important;flex:0 1 12em;min-width:3em;box-sizing:border-box;margin:0!important}');

  others.forEach(function (cb, i) {
    var q = CFG.texts[i], box = q && D.inputs(q, 'text')[0];
    if (!box) return;
    var hide = D.boxes(q);                        /* the box's own question text + spot below the grid */
    var item = document.createElement('span');
    item.className = 'djs-oth-item';
    var cap = document.createElement('span');
    cap.textContent = CFG.names[i] + ':';
    item.appendChild(cap);
    item.appendChild(box);                        /* still inside the form -> still posted */
    slot.appendChild(item);
    hide.forEach(function (el) {
      if (!el.contains(box) && !el.querySelector('.mrNext,[name="_NNext"]')) el.style.display = 'none';
    });
    box.setAttribute('aria-label', 'Other - ' + CFG.names[i]);
    box.addEventListener('click', function (e) { e.stopPropagation(); });
    function sync(focus) {
      item.style.display = cb.checked ? '' : 'none';
      if (!cb.checked) box.value = '';
      else if (focus) box.focus();
    }
    cb.addEventListener('change', function () { sync(true); });
    sync(false);
    setTimeout(function () { sync(false); }, 300);  /* after the template has redrawn the grid */
  });
});
