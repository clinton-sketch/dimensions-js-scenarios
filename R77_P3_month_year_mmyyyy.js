/* Row 77 (scenario 76) - Date of HF diagnosis as mm/yyyy, capped at the completion month
   Survey PC3 | Patient Record Form, P3 "Date of HF diagnosis (mm/yyyy): __[1-12]/____ [Max: completion date]"
   Setup : PRF loop fields P3M long [1 .. 12] and P3Y long [1900 .. 2100] (label has <span class='djs-q-P3Y'></span>).
   Behaviour: the year box is moved next to the month box as  [mm] / [yyyy]  and its own question
           text is hidden; digits only (2 for the month, 4 for the year). When both are filled, a
           date after the current month is flagged at once (month and year compared together, so
           12/1993 is fine). The server check ValPRF (ERR_P3) enforces the same rule on Next.
           The year's own error texts (missing / out of range) are moved under the date, so they
           stay visible when the year's question text is hidden (also any error text the player
           writes between the month box and the year box). While typing, a year outside 1900 - 2100
           (e.g. 0202), a year of fewer than 4 digits (on leaving the box) or a month outside 1 - 12
           gets a message at once (not repeated while the value is unchanged since the page came
           back with the server's own message).
   Banner: PRF[..].P1.Banners.AddNew("R77_P1", "<mrRef RefType = ""script"" src = ""js_files/R77_P3_month_year_mmyyyy.js"" ...>")
           before each PRF iteration Ask (P1 = first question of the page), removed after. */
DimJS.ready(function () {
  var CFG = { m: 'P3M', y: 'P3Y', yMin: 1900, yMax: 2100,
              msg: 'The date of diagnosis cannot be after the current month.',
              msgYear: 'Please enter the year as 4 digits between 1900 and 2100 (yyyy).',
              msgMonth: 'Please enter a month between 1 and 12 (mm).' };
  var D = DimJS, mm = D.inputs(CFG.m, 'text')[0], yy = D.inputs(CFG.y, 'text')[0];
  if (!mm || !yy) return;
  var yBlocks = D.boxes(CFG.y);                       /* year question text + answer block */
  /* the year's own error texts (e.g. missing / out of range) sit in the block hidden below:
     collect them first and show them under the date instead */
  var yErrs = [];
  yBlocks.forEach(function (b) {
    (b.classList.contains('mrErrorText') ? [b] : D.all('.mrErrorText', b)).forEach(function (e) {
      if (e.textContent.trim() && yErrs.indexOf(e) < 0) yErrs.push(e);
    });
  });
  /* ... and any error text the player wrote between the month box and the year box (P3Y's error
     comes just before P3Y's question text, whatever wrapper the player uses) */
  D.all('.mrErrorText').forEach(function (e) {
    var afterM = mm.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING;
    var beforeY = yy.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING;
    if (afterM && beforeY && e.textContent.trim() && yErrs.indexOf(e) < 0) yErrs.push(e);
  });
  [[mm, 2, 'mm', '3.2em'], [yy, 4, 'yyyy', '4.6em']].forEach(function (a) {
    var el = a[0];
    if (el.type === 'number') el.type = 'text';
    el.maxLength = a[1]; el.placeholder = a[2]; el.style.width = a[3];
    el.setAttribute('inputmode', 'numeric'); el.setAttribute('autocomplete', 'off');
    el.addEventListener('input', function () {
      var v = el.value.replace(/[^0-9]/g, '').slice(0, a[1]);
      if (v !== el.value) el.value = v;
      check(false);
    });
    el.addEventListener('blur', function () { check(true); });
  });
  var sep = document.createElement('span'); sep.textContent = ' / '; sep.style.fontWeight = 'bold';
  mm.parentNode.insertBefore(sep, mm.nextSibling);
  sep.parentNode.insertBefore(yy, sep.nextSibling);   /* year box now sits after the month box */
  D.show(yBlocks, false);                             /* its empty block / text are hidden */
  if (yErrs.length) {
    var eBox = D.after(yy, 'djs_err_p3y', 'div', 'djs-year-err');
    yErrs.forEach(function (e) { eBox.appendChild(e); e.style.display = ''; });
  }
  yy.setAttribute('aria-label', 'Year of HF diagnosis (yyyy)');
  mm.setAttribute('aria-label', 'Month of HF diagnosis (mm)');

  var yStart = yy.value, mStart = mm.value;   /* as they came back from the server */
  var pageErr = D.all('.mrErrorText').some(function (e) { return e.textContent.trim() !== ''; });
  var now = new Date(), nowM = now.getFullYear() * 12 + now.getMonth() + 1;
  function check(left) {
    var m = D.num(mm.value), y = D.num(yy.value), txt = '';
    var mBad = mm.value !== '' && !(m >= 1 && m <= 12)
               && !(pageErr && mm.value === mStart);   /* server's month message already shown */
    var yBad = yy.value !== '' && (yy.value.length === 4 || left) && !(y >= CFG.yMin && y <= CFG.yMax)
               && !(yErrs.length && yy.value === yStart);   /* server's own year message already shown */
    if (mBad) txt = CFG.msgMonth;
    else if (yBad) txt = CFG.msgYear;
    else if (!isNaN(m) && !isNaN(y) && yy.value.length === 4 && y * 12 + m > nowM) txt = CFG.msg;
    D.message(yy, 'djs_msg_p3', txt);
  }
  check(yy.value !== '');
});
