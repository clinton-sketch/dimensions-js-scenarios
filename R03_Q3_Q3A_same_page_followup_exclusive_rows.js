/* Row 3 - Same-page conditional follow-up and exclusive numeric rows
   Survey 34 | Q3 / Q3A (COVID)
   Setup : Q3 and Q3A in one block/page (e.g. Block_Q3). Q3A = two numerics on one screen:
           Q3A_More long [1..999], Q3A_Fewer long [1..100]. Put <span class="djs-q-Q3A"></span>
           in the Q3A text so the question text hides with it.
   Routing: Q3A_More / Q3A_Fewer MustAnswer = False and a validation function: if Q3 = {_1}
           exactly one of More/Fewer is answered; after the ask set both to NULL when Q3 <> {_1}.
   Banner: on Q3 (the first question of the page), added before the page ask, removed after:
           Q3.Banners.AddNew("R03_Q3", "<script type=""text/javascript"" src=""<link>""></script>")
   Hiding: the player writes page questions as loose siblings, so DimJS.boxes hides each
           follow-up's text and answer box together (needs the 05-Nov fix in 00_dim-helpers.js). */
DimJS.ready(function () {
  var CFG = { trigger: 'Q3', yes: '_1', follow: ['Q3A_More', 'Q3A_Fewer'], marker: 'Q3A' };
  var D = DimJS;
  var more = D.inputs(CFG.follow[0], 'text')[0], fewer = D.inputs(CFG.follow[1], 'text')[0];
  if (!more || !fewer) return;
  var blocks = D.boxes(CFG.follow[0]).concat(D.boxes(CFG.follow[1]), D.boxes(CFG.marker));

  function toggle() {
    var on = D.isOn(CFG.trigger, CFG.yes);
    D.show(blocks, on);
    if (!on) { D.clear(more); D.clear(fewer); }
  }
  // rows are exclusive to each other: typing in one clears the other
  more.addEventListener('input', function () { if (more.value !== '') D.clear(fewer); });
  fewer.addEventListener('input', function () { if (fewer.value !== '') D.clear(more); });
  D.inputs(CFG.trigger, 'radio,checkbox').forEach(function (r) { r.addEventListener('change', toggle); });
  toggle();
});
