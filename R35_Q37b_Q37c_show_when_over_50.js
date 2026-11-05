/* Row 35 - Show the follow-up when the numeric answer is over 50
   Survey 37 | Q37b -> Q37c (same page)
   Setup : Q37b long and Q37c categorical [1..1] in one block (Block_Q37b);
           Q37c label starts with <span class="djs-q-Q37c"></span>.
   Routing: Q37c.MustAnswer = False + validation (required only when Q37b > 50);
           after the ask set Q37c = NULL when Q37b <= 50.
   Banner: Block_Q37b.Banners.AddNew("Q37c_Show", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { num: 'Q37b', follow: 'Q37c', over: 50 };
  var D = DimJS, box = D.inputs(CFG.num, 'text')[0];
  if (!box) return;
  function sync() {
    var on = D.num(box.value) > CFG.over;
    D.show(CFG.follow, on);
    if (!on) D.inputs(CFG.follow, 'radio,checkbox').forEach(D.clear);
  }
  box.addEventListener('input', sync);
  sync();
});
