/* Row 62 - Pairwise comorbidity exclusion and exclusive None
   PC1-Modified | A1_6
   Setup : A1_6 categorical [1..]; "No comorbid conditions" marked exclusive in metadata
           (server-side); malignancy type and Other as specify boxes (other / text questions
           A1_6_Malig, A1_6_Oth on the same page, MustAnswer = False).
   Routing: validation - Type 1 and Type 2 diabetes together is an error; specify boxes
           required when their code is ticked.
   CFG   : set the real codes from the questionnaire.
   Banner: A1_6 (or its block).Banners.AddNew("A1_6_Rules", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'A1_6', none: '_99', pairs: [['_1', '_2']],              // Type 1 vs Type 2 diabetes
              specify: [{ code: '_12', q: 'A1_6_Malig' }, { code: '_96', q: 'A1_6_Oth' }] };
  var D = DimJS, boxes = D.inputs(CFG.q, 'checkbox'), none = D.cat(CFG.q, CFG.none);

  boxes.forEach(function (b) {
    b.addEventListener('change', function () {
      if (!b.checked) return sync();
      if (b === none) boxes.forEach(function (x) { if (x !== none) x.checked = false; });
      else if (none) none.checked = false;
      CFG.pairs.forEach(function (p) {
        var i = p.indexOf(b.value);
        if (i >= 0) { var other = D.cat(CFG.q, p[1 - i]); if (other) other.checked = false; }
      });
      sync();
    });
  });
  function sync() {
    CFG.specify.forEach(function (s) {
      var on = D.isOn(CFG.q, s.code);
      var t = D.inputs(s.q, 'text')[0] || D.inputs(CFG.q, 'text').filter(function (x) { return D.norm(x.name).slice(-s.code.length) === s.code; })[0];
      if (!t) return;
      (D.boxes(s.q).length ? D.boxes(s.q) : [t]).forEach(function (el) { el.style.display = on ? '' : 'none'; });
      if (!on) t.value = '';
    });
  }
  sync();
});
