/* Row 25 - Freeze (sticky) grid headers while scrolling
   Survey 37 | Q35b
   CSS position:sticky does the work. If a template wrapper has overflow set (which breaks
   sticky), the JS falls back to a fixed copy of the header shown while the table is scrolled.
   Banner: Q35b.Banners.AddNew("Q35b_Sticky", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q35b', top: 0, bg: '#ffffff' };
  var first = DimJS.inputs(CFG.q, 'checkbox')[0];
  if (!first) return;
  var table = first.closest('table'), head = table.rows[0];

  Array.prototype.forEach.call(head.cells, function (c) {
    c.style.position = 'sticky'; c.style.top = CFG.top + 'px';
    c.style.background = CFG.bg; c.style.zIndex = 2; c.style.boxShadow = '0 1px 0 #ccc';
  });

  // fallback: an ancestor with overflow other than visible stops sticky from working
  var n = table.parentElement, blocked = false;
  while (n && n !== document.body) {
    var o = getComputedStyle(n).overflowY;
    if (o === 'hidden' || o === 'auto' || o === 'scroll') { blocked = n.scrollHeight <= n.clientHeight; if (blocked) break; }
    n = n.parentElement;
  }
  if (!blocked) return;
  var clone = document.createElement('table');
  clone.className = table.className; clone.style.position = 'fixed'; clone.style.top = CFG.top + 'px';
  clone.style.display = 'none'; clone.style.background = CFG.bg; clone.style.zIndex = 1000;
  clone.appendChild(head.cloneNode(true));
  document.body.appendChild(clone);
  function place() {
    var r = table.getBoundingClientRect(), on = r.top < CFG.top && r.bottom > head.offsetHeight;
    clone.style.display = on ? '' : 'none';
    if (!on) return;
    clone.style.left = r.left + 'px'; clone.style.width = r.width + 'px';
    Array.prototype.forEach.call(head.cells, function (c, i) { clone.rows[0].cells[i].style.width = c.getBoundingClientRect().width + 'px'; });
  }
  window.addEventListener('scroll', place); window.addEventListener('resize', place);
});
