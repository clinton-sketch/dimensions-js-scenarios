/* Row 34 - Live thousands separator and decimals
   Survey 37 | Q37a (annual book budget, 1234.56 shows as 1,234.56)
   Setup : Q37a double [0..999999.99]. A Dimensions numeric field rejects commas on the server,
           so the commas are removed again just before the page is submitted.
   Banner: Q37a.Banners.AddNew("Q37a_Fmt", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q37a', decimals: 2 };
  var D = DimJS, box = D.inputs(CFG.q, 'text')[0];
  if (!box) return;
  if (box.type === 'number') box.type = 'text';             // number inputs cannot show commas
  box.setAttribute('inputmode', 'decimal');

  function format(raw) {
    var clean = raw.replace(/[^0-9.]/g, ''), dot = clean.indexOf('.');
    if (dot >= 0) clean = clean.slice(0, dot + 1) + clean.slice(dot + 1).replace(/\./g, '').slice(0, CFG.decimals);
    var parts = clean.split('.');
    parts[0] = parts[0].replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  box.addEventListener('input', function () {
    var digitsBefore = box.value.slice(0, box.selectionStart).replace(/[^0-9.]/g, '').length;
    box.value = format(box.value);
    var pos = 0, seen = 0;                                  // put the caret back after the same digit
    while (pos < box.value.length && seen < digitsBefore) { if (/[0-9.]/.test(box.value[pos])) seen++; pos++; }
    box.setSelectionRange(pos, pos);
  });
  box.value = format(box.value);                            // value restored on a return visit
  D.onNext(function () { box.value = box.value.replace(/,/g, ''); });
  var f = document.forms[0];
  if (f) f.addEventListener('submit', function () { box.value = box.value.replace(/,/g, ''); });
});
