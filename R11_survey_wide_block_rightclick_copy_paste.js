/* Row 11 - Disable right-click and cut/copy/paste (whole survey)
   Survey 34 | Scenario #6
   Banner: once at the top of routing, so it is on every page:
           IOM.Banners.AddNew("NoCopy", "<script>...</script>")
   Note  : best effort only - it cannot stop screenshots, developer tools or disabled JS. */
DimJS.ready(function () {
  var block = function (e) { e.preventDefault(); return false; };
  ['contextmenu', 'copy', 'cut', 'paste', 'dragstart', 'drop'].forEach(function (t) {
    document.addEventListener(t, block, true);
  });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'v', 'a', 'u', 's', 'p'].indexOf(k) >= 0) block(e);
    if ((e.shiftKey || e.ctrlKey) && k === 'insert') block(e);     // Shift+Ins paste / Ctrl+Ins copy
  }, true);
  DimJS.css('djsNoSelect',
    'body{-webkit-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none}' +
    'input,textarea{-webkit-user-select:text;-ms-user-select:text;user-select:text}');
});
