/* Rows 50 and 80 - Conditional SGLT2 "please specify" boxes
   Survey 38 / PC3 | P11 / P12 code 11 (SGLT2 inhibitors) -> P11_11bis / P12_11bis
   Source rule: "IF CODE 11 SELECTED, SHOW: EXCEPT IF P4 OR P4TER > 40".
           Read literally here: show the box when code 11 is ticked AND neither P4 nor P4ter is
           above 40. Change CFG.exceptAbove if the client confirms a different reading.
   Setup : P11_11bis / P12_11bis text (MustAnswer = False) on the PRF page, labels start with
           <span class="djs-q-P11_11bis"></span> / <span class="djs-q-P12_11bis"></span>.
   Routing: validation - text required only when the same condition holds; NULL it otherwise.
   Banner: PRF page/block .Banners.AddNew("SGLT2_Spec", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { code: '_11', exceptAbove: 40, ef: ['P4', 'P4ter'],
              pairs: [{ q: 'P11', spec: 'P11_11bis' }, { q: 'P12', spec: 'P12_11bis' }] };
  var D = DimJS;
  function efAbove() {
    return CFG.ef.some(function (q) { var b = D.inputs(q, 'text')[0]; return b && D.num(b.value) > CFG.exceptAbove; });
  }
  function sync() {
    var blocked = efAbove();
    CFG.pairs.forEach(function (p) {
      var on = D.isOn(p.q, CFG.code) && !blocked;
      D.show(p.spec, on);
      if (!on) D.inputs(p.spec, 'text').forEach(D.clear);
    });
  }
  CFG.pairs.forEach(function (p) { D.inputs(p.q, 'checkbox').forEach(function (b) { b.addEventListener('change', sync); }); });
  CFG.ef.forEach(function (q) { D.inputs(q, 'text').forEach(function (b) { b.addEventListener('input', sync); }); });
  sync();
});
