/* Row 39 - Selecting Purchase automatically selects Read
   Survey 37 | Q39a (Genre | Read | Purchase)
   Setup : Q39a = multi-select grid (rows = genres, columns {_1 Read, _2 Purchase}).
   Routing: ValQ39a - Purchase without Read is an error (server-side safety net).
   Behaviour: Purchase ticks Read; Read cannot be unticked while Purchase is ticked.
           Unticking Purchase leaves Read as it is.
   Note  : the ipsosfi template draws its own tick (.squaremark) and the cell highlight in a
           change handler, so after ticking Read from code a change event is fired on Read,
           otherwise the box is ticked but shown empty.
   Banner: Q39a.Banners.AddNew("R39_Q39a", "<mrRef RefType = ""script"" src = ""js_files/R39_Q39a_purchase_auto_selects_read.js"" ...>")
           before Q39a.Ask(), Q39a.Banners.Remove("R39_Q39a") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q39a', read: '_1', purchase: '_2' };
  var D = DimJS, seen = [];
  function fire(el) {                                    /* let the template redraw the tick */
    if (window.jQuery) jQuery(el).trigger('change');
    else el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function tick(el) { if (!el.checked) { el.checked = true; fire(el); } }
  D.inputs(CFG.q, 'checkbox').forEach(function (b) {
    var tr = D.row(b); if (!tr || seen.indexOf(tr) >= 0) return; seen.push(tr);
    var read = D.cat(CFG.q, CFG.read, tr), buy = D.cat(CFG.q, CFG.purchase, tr);
    if (!read || !buy) return;
    buy.addEventListener('change', function () { if (buy.checked) tick(read); });
    read.addEventListener('click', function (e) {
      /* the click has already flipped the box: undo an untick while Purchase is ticked */
      if (buy.checked && !read.checked) { e.preventDefault(); setTimeout(function () { tick(read); }, 0); }
    });
    read.addEventListener('change', function () { if (buy.checked && !read.checked) tick(read); });
    if (buy.checked) tick(read);                          /* page re-shown with Purchase only */
  });
});
