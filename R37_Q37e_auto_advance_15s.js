/* Row 37 - Page advances automatically after 15 seconds
   Survey 37 | Q37e (info page)
   Setup : Q37e = info item (nothing mandatory on the page, otherwise the auto-submit only
           returns a mandatory error). Optional countdown: <span id="Q37eTimer">15</span> in the text.
   Banner: Q37e.Banners.AddNew("Q37e_Timer", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { seconds: 15, spanId: 'Q37eTimer', hideNext: false };
  var D = DimJS, start = Date.now(), fired = false, span = document.getElementById(CFG.spanId);
  if (CFG.hideNext) D.showNext(false);
  var t = setInterval(function () {
    var left = Math.max(0, CFG.seconds - Math.floor((Date.now() - start) / 1000));
    if (span) span.textContent = left;
    if (left === 0 && !fired) { fired = true; clearInterval(t); D.goNext(); }
  }, 250);
  window.addEventListener('pagehide', function () { clearInterval(t); });
});
