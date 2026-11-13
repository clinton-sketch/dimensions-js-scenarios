/* Row 40 - Other-specify box beside "Other" (set up like Q10 / Q10_oth1)
   Survey 37 | Q39b (Morning | Afternoon | Evening, multi-select per column)
   Setup : Q39b loop over the formats, Other row label  _96 "Other<span id='q39b_oth'></span>" fix,
           _scale categorical [0..] {_1 Morning, _2 Afternoon, _3 Evening} (each column a multi-select)
           Q39b_Oth1  text, style Width 6em / SingleLineEdit, codes NA, MustAnswer = False,
           on PageQ39b after Q39b.
           This file moves the Q39b_Oth1 box into that span (no inline JS in the label), the way
           Q10's label moves Q10_oth1 into <span id='oth1'>. The box is always visible.
   Routing: ValQ39b - at least one answer per column (ERR_Q39b); Other ticked in any column needs
           the Other text (ERR_Q39b_2); Other text needs Other ticked (ERR_Q39b_3).
   Banner: Q39b.Banners.AddNew("R40_Q39b", "<mrRef RefType = ""script"" src = ""js_files/R40_Q39b_other_specify_per_column.js"" ...>")
           before PageQ39b.Ask(), Q39b.Banners.Remove("R40_Q39b") after. */
DimJS.ready(function () {
  var CFG = { otherText: 'Q39b_Oth1', slot: 'q39b_oth' };
  var D = DimJS;
  var box = D.inputs(CFG.otherText, 'text')[0];
  var slot = document.getElementById(CFG.slot);
  if (!box || !slot) return;

  var home = box.parentElement && box.parentElement.tagName === 'SPAN' ? box.parentElement : box;
  var left = D.lead(home);                         /* its (empty) question text / spacers below the grid */
  slot.appendChild(box);                           /* still inside the form -> still posted */
  [home].concat(left).forEach(function (el) {
    if (el !== box && !el.contains(box) && !el.querySelector('.mrNext,[name="_NNext"]')) el.style.display = 'none';
  });
  box.setAttribute('aria-label', 'Other, please specify');
  box.addEventListener('click', function (e) { e.stopPropagation(); });
  D.css('djsQ39bOth', '#' + CFG.slot + ' input{margin-left:8px;vertical-align:middle}');
});
