/* Rows 60 and 61 - Month/year diagnosis date (at least 12 months ago) and
                    last-consultation date (not before the diagnosis)
   PC1-Modified | A1_1 / A1_2
   Setup : A1_1_MM long [1..12], A1_1_YYYY long [1900..2025], A1_2_MM, A1_2_YYYY long [2024..2025]
           on the same page. Confirm with the client whether 2025 / 2024 are fixed or rolling.
   Routing: same checks in a validation function (JS only gives instant feedback).
   Banner: page/block .Banners.AddNew("A1_Dates", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { dxMM: 'A1_1_MM', dxYY: 'A1_1_YYYY', lvMM: 'A1_2_MM', lvYY: 'A1_2_YYYY', minMonths: 12 };
  var D = DimJS;
  function box(q) { return D.inputs(q, 'text')[0]; }
  var dm = box(CFG.dxMM), dy = box(CFG.dxYY), lm = box(CFG.lvMM), ly = box(CFG.lvYY);
  if (!dm || !dy) return;
  function ym(m, y) {
    var mv = D.num(m.value), yv = D.num(y.value);
    return (isNaN(mv) || y.value.length !== 4 || mv < 1 || mv > 12) ? NaN : yv * 12 + mv;
  }
  [dm, lm].forEach(function (b) { if (b) { b.maxLength = 2; b.placeholder = 'mm'; } });
  [dy, ly].forEach(function (b) { if (b) { b.maxLength = 4; b.placeholder = 'yyyy'; } });

  function check() {
    var now = new Date(), today = now.getFullYear() * 12 + now.getMonth() + 1;
    var dx = ym(dm, dy), lv = lm && ly ? ym(lm, ly) : NaN;
    D.message(dy, 'djsDxErr', !isNaN(dx) && today - dx < CFG.minMonths
      ? 'The diagnosis must be at least ' + CFG.minMonths + ' months ago.' : '');
    if (ly) D.message(ly, 'djsLvErr', !isNaN(dx) && !isNaN(lv) && lv < dx
      ? 'The last consultation cannot be before the diagnosis date.' : (!isNaN(lv) && lv > today ? 'The date cannot be in the future.' : ''));
  }
  [dm, dy, lm, ly].forEach(function (b) {
    if (b) b.addEventListener('input', function () { b.value = b.value.replace(/\D/g, ''); check(); });
  });
  check();
});
