/* Row 29 - Grey placeholder text for the Other category
   Survey 37 | Q35f (Fiction / Non-Fiction / Academic / Other + counts)
   Setup : Other row = native "other" category or a separate text question Q35f_OthText in the
           Other row. Metadata row label is just "Other" (no "please specify").
           Placeholder text is never posted, so nothing extra is saved.
   Banner: Q35f.Banners.AddNew("Q35f_Ph", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q35f', otherText: 'Q35f_OthText', text: 'Please specify other category' };
  var D = DimJS;
  var box = D.inputs(CFG.otherText, 'text')[0] ||
            D.inputs(CFG.q, 'text').filter(function (t) { return /_O/.test(t.name); })[0];
  if (!box) return;
  box.setAttribute('placeholder', CFG.text);
  D.css('djsPh', 'input::placeholder,textarea::placeholder{color:#9e9e9e;opacity:1}');
});
