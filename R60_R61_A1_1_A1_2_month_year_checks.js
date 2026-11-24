/* Rows 60 / 61 (scenarios 59 / 60) - A1_1 and A1_2 as mm/yyyy with live date checks
   Survey PC1 | patient chart, A1 table:
     A1_1 date of diagnosis       - at least 12 months ago                       (scenario 59)
     A1_2 date of last consultation - within the last 12 months, not in the future (scenario 60)
     A1_1 not after A1_2                                                          (scenario 60)
   Setup : A1Blk fields A1_1M / A1_2M long [1 .. 12] and A1_1Y / A1_2Y long [1900 .. 2099]
           (year labels carry <span class='djs-q-A1_1Y'></span> / djs-q-A1_2Y).
   Behaviour: each year box is moved next to its month box as  [mm] / [yyyy]  and the year question
           text is hidden; digits only (2 for month, 4 for year). Complete month + year pairs are
           compared (year * 12 + month) and a message is shown under the date at once; nothing extra
           is posted. The server check ValPC1A1 (ERR_A1_1 / ERR_A1_2 / ERR_A1_3) enforces the same rules.
           Each year's own error texts (missing / out of range) are moved under its date, so they
           stay visible when the year's question text is hidden (also any error text the player
           writes between the month box and the year box). While typing, a year outside 1900 - 2099
           (e.g. 0202), a year of fewer than 4 digits (on leaving the box) or a month outside 1 - 12
           gets a message at once, before the date checks (not repeated while the value is unchanged
           since the page came back with the server's own message).
   Banner: PC1Chart[..].A1Blk.A1_1M.Banners.AddNew("R60_A1", "<mrRef RefType = ""script"" src = ""js_files/R60_R61_A1_1_A1_2_month_year_checks.js"" ...>")
           before .A1Blk.Ask() (A1_1M = first question of the page after the info texts), removed after. */
DimJS.ready(function () {
  var CFG = {
    yMin: 1900, yMax: 2099,
    dx: { m: 'A1_1M', y: 'A1_1Y', label: 'diagnosis' },
    lv: { m: 'A1_2M', y: 'A1_2Y', label: 'last consultation' },
    msg: {
      dx: 'The date of diagnosis must be at least 12 months ago.',
      lv: 'The date of the last consultation must be within the last 12 months and not in the future.',
      order: 'The date of diagnosis cannot be after the date of the last consultation.',
      year: 'Please enter the year as 4 digits between 1900 and 2099 (yyyy).',
      month: 'Please enter a month between 1 and 12 (mm).'
    }
  };
  var D = DimJS;
  function pair(p, id) {
    var mm = D.inputs(p.m, 'text')[0], yy = D.inputs(p.y, 'text')[0];
    if (!mm || !yy) return null;
    var yBlocks = D.boxes(p.y);
    /* the year's own error texts (e.g. missing / out of range) sit in the block hidden below:
       collect them first and show them under the date instead */
    var yErrs = [];
    yBlocks.forEach(function (b) {
      (b.classList.contains('mrErrorText') ? [b] : D.all('.mrErrorText', b)).forEach(function (e) {
        if (e.textContent.trim() && yErrs.indexOf(e) < 0) yErrs.push(e);
      });
    });
    /* ... and any error text the player wrote between the month box and the year box (the year's
       error comes just before its question text, whatever wrapper the player uses) */
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
    sep.parentNode.insertBefore(yy, sep.nextSibling);
    D.show(yBlocks, false);
    if (yErrs.length) {
      var eBox = D.after(yy, id + '_err', 'div', 'djs-year-err');
      yErrs.forEach(function (e) { eBox.appendChild(e); e.style.display = ''; });
    }
    mm.setAttribute('aria-label', 'Month of ' + p.label + ' (mm)');
    yy.setAttribute('aria-label', 'Year of ' + p.label + ' (yyyy)');
    return { mm: mm, yy: yy, id: id, hasErr: yErrs.length > 0, yStart: yy.value, mStart: mm.value };
  }
  function months(p) {               /* year * 12 + month, or NaN while incomplete */
    var m = D.num(p.mm.value), y = D.num(p.yy.value);
    return isNaN(m) || isNaN(y) || m < 1 || m > 12 || p.yy.value.length !== 4 ? NaN : y * 12 + m;
  }
  var pageErr = D.all('.mrErrorText').some(function (e) { return e.textContent.trim() !== ''; });
  var dx = pair(CFG.dx, 'djs_msg_a1_1'), lv = pair(CFG.lv, 'djs_msg_a1_2');
  if (!dx && !lv) return;
  var now = new Date(), nNow = now.getFullYear() * 12 + now.getMonth() + 1;

  /* month / year format message for one pair, or '' (the year message is left to the server's own
     text while the year is unchanged since the page came back with it) */
  function format(p, left) {
    var m = D.num(p.mm.value), y = D.num(p.yy.value);
    if (p.mm.value !== '' && !(m >= 1 && m <= 12)
        && !(pageErr && p.mm.value === p.mStart)) return CFG.msg.month;   /* server's month message shown */
    if (p.yy.value !== '' && (p.yy.value.length === 4 || left) && !(y >= CFG.yMin && y <= CFG.yMax)
        && !(p.hasErr && p.yy.value === p.yStart)) return CFG.msg.year;
    return '';
  }
  function check(left) {
    var nDx = dx ? months(dx) : NaN, nLv = lv ? months(lv) : NaN;
    var fDx = dx ? format(dx, left) : '', fLv = lv ? format(lv, left) : '';
    if (fDx || (dx && dx.yy.value !== '' && !(D.num(dx.yy.value) >= CFG.yMin && D.num(dx.yy.value) <= CFG.yMax))) nDx = NaN;
    if (fLv || (lv && lv.yy.value !== '' && !(D.num(lv.yy.value) >= CFG.yMin && D.num(lv.yy.value) <= CFG.yMax))) nLv = NaN;
    if (dx) D.message(dx.yy, dx.id, fDx || (!isNaN(nDx) && nDx > nNow - 12 ? CFG.msg.dx :
                                     !isNaN(nDx) && !isNaN(nLv) && nDx > nLv ? CFG.msg.order : ''));
    if (lv) D.message(lv.yy, lv.id, fLv || (!isNaN(nLv) && (nLv < nNow - 12 || nLv > nNow) ? CFG.msg.lv : ''));
  }
  check(true);
});
