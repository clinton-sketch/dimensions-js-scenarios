/* Row 10 - Grouped None-of-the-above behaviour
   Survey 34 | S12 (TNF Inhibitors group / Anti-IL group, each with its own "None of the above")
   Setup : S12 categorical with two sublists; do NOT mark the Nones "exclusive" (that is
           question-wide in Dimensions). Fix the codes first (Other Anti-IL is uncoded; None = 8
           clashes with Q3's code 8).
   Routing: validation - a group's None cannot be combined with any other code of the same group.
   Each box unticked by this file also gets a 'change' event, so the template (ipsosfi.js) clears
   its blue row / tick too - otherwise the box is unticked in the data but still looks ticked.
   Banner: S12.Banners.AddNew("S12_Groups", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = {
    q: 'S12',
    groups: [
      { none: '_91', items: ['_1', '_2', '_3', '_4', '_5'] },
      { none: '_8',  items: ['_6', '_7', '_9'] }          // _9 = Other Anti-IL (code to confirm)
    ]
  };
  var D = DimJS;
  function untick(el) {
    if (!el.checked) return;
    el.checked = false;
    D.fire(el, 'change');                     /* lets the template update the row's look */
  }
  CFG.groups.forEach(function (g) {
    var none = D.cat(CFG.q, g.none);
    var items = g.items.map(function (c) { return D.cat(CFG.q, c); }).filter(Boolean);
    if (!none) return;
    none.addEventListener('change', function () {
      if (none.checked) items.forEach(untick);
    });
    items.forEach(function (i) {
      i.addEventListener('change', function () { if (i.checked) untick(none); });
    });
  });
});
