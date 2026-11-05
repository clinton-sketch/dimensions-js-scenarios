/* Rows 55 and 84 - Q7: show the replacement list inside the patient's row when
                    "in place of the current treatment" is chosen
   Survey 38 / PC3 | Q7 (per patient who chose a new product at Q6)
   Setup : Q7 = loop over patients (filtered in routing to those with a product at Q6) with
             How categorical [1..1] {_1 "in combination", _2 "in place of"}  and
             Repl categorical [0..] = P11 treatment list (MustAnswer = False).
           Routing per iteration (before the ask):
             - filter How: remove _1 when that patient's P11 has ARNI (code _3)
             - filter Repl.Categories to that patient's P11 answers; label inserts for the
               P11_11bis / Other texts
             - ARNI pre-tick: Q7[pat].Repl = {_3} when P11 contains ARNI (Response.Initial)
             - a flag per patient whether P11 has > 1 code: put <span class="djs-multi" data-pat="_1">
               in that patient's row label when it does.
   Routing: validation - Repl required only when How = {_2} and P11 has > 1 code; NULL otherwise.
   Banner: Q7.Banners.AddNew("Q7_Repl", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q7', howSub: 'How', replSub: 'Repl', inPlace: '_2' };
  var D = DimJS;
  // group fields by patient iteration: everything before "_Q<Sub>" in the field name
  function iterKey(el, sub) { var m = D.norm(el.name).match(new RegExp('^(.*)_Q' + sub + '(?![A-Za-z0-9])', 'i')); return m ? m[1] : null; }
  var groups = {};
  D.inputs(CFG.howSub, 'radio').forEach(function (r) { var k = iterKey(r, CFG.howSub); if (k) (groups[k] = groups[k] || { how: [], repl: [] }).how.push(r); });
  D.inputs(CFG.replSub, 'checkbox').forEach(function (c) { var k = iterKey(c, CFG.replSub); if (k && groups[k]) groups[k].repl.push(c); });

  Object.keys(groups).forEach(function (k) {
    var g = groups[k];
    if (!g.repl.length) return;
    var box = D.ownBlock(g.repl[0], CFG.replSub);
    if (box.contains(g.how[0])) box = g.repl[0].closest('td') || g.repl[0].parentElement;
    var row = D.row(g.how[0]);
    var multi = !row || !!row.querySelector('.djs-multi') || !document.querySelector('.djs-multi');
    var firstShow = true;
    function sync() {
      var on = multi && g.how.some(function (r) { return r.checked && r.value === CFG.inPlace; });
      box.style.display = on ? '' : 'none';
      if (!on && !firstShow) g.repl.forEach(D.clear);       // keep the routing ARNI pre-tick on first load
      firstShow = false;
    }
    g.how.forEach(function (r) { r.addEventListener('change', sync); });
    sync();
  });
});
