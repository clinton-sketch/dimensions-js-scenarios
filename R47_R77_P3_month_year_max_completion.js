/* Rows 47 and 77 - Month/year entry (mm/yyyy) capped at the completion date
   Survey 38 / PC3 | P3 Date of HF diagnosis
   Setup : two numerics on the PRF page: P3_MM long [1..12] and P3_YYYY long [1900..2100]
           (or a DD/MM/YYYY component grid without the day row).
   Routing: validation - P3_YYYY * 12 + P3_MM <= Year(Now()) * 12 + Month(Now()).
           Compares the whole pair, so December of an earlier year is valid.
   JS    : shows them as  [mm] / [yyyy], digits only, auto-tab, live error.
   Banner: PRF page/block .Banners.AddNew("P3_Date", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { mm: 'P3_MM', yyyy: 'P3_YYYY', msg: 'The date cannot be later than this month.' };
  var D = DimJS, mm = D.inputs(CFG.mm, 'text')[0], yy = D.inputs(CFG.yyyy, 'text')[0];
  if (!mm || !yy) return;

  [[mm, 2, 'mm'], [yy, 4, 'yyyy']].forEach(function (x) {
    x[0].maxLength = x[1]; x[0].placeholder = x[2]; x[0].style.width = (x[1] + 1.5) + 'em';
    x[0].setAttribute('inputmode', 'numeric');
  });
  var slash = document.createElement('span'); slash.textContent = ' / ';
  mm.parentNode.insertBefore(slash, mm.nextSibling);
  slash.parentNode.insertBefore(yy, slash.nextSibling);   // same line: mm / yyyy (still posted)

  function check() {
    mm.value = mm.value.replace(/\D/g, ''); yy.value = yy.value.replace(/\D/g, '');
    var m = D.num(mm.value), y = D.num(yy.value), now = new Date(), msg = '';
    if (!isNaN(m) && (m < 1 || m > 12)) msg = 'Month must be 1 to 12.';
    else if (!isNaN(m) && yy.value.length === 4 && y * 12 + m > now.getFullYear() * 12 + now.getMonth() + 1) msg = CFG.msg;
    D.message(yy, 'djsP3Err', msg);
  }
  mm.addEventListener('input', function () { check(); if (mm.value.length === 2) yy.focus(); });
  yy.addEventListener('input', check);
  check();
});
