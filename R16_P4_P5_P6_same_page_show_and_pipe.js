/* Row 16 - Same-page conditional question and live text piping
   Survey 36 | Scenario #15 / P4-P6
   Setup : P4, P5, P6 in one block (Block_P4). P5 label starts with <span class="djs-q-P5"></span>.
           P6 label: "When was <span id="P6Pipe">{#P5}</span> first suspected for this patient?"
           (server pipe fills it on a return visit; JS refreshes it live).
   Routing: P5.MustAnswer = False + validation (P5 required only if P4 = {_2}); after the ask
           set P5 = NULL when P4 <> {_2}.
   Banner: on the block's FIRST QUESTION, not the block (a banner on the block itself is not
           rendered by the player):
             Block_P4.P4.Banners.AddNew("R16_BlockP4", "<script ... src=""<link>""></script>")
             Block_P4.Ask()
             Block_P4.P4.Banners.Remove("R16_BlockP4") */
DimJS.ready(function () {
  var CFG = { p4: 'P4', ckd: '_1', ascvd: '_2', p5: 'P5', pipeId: 'P6Pipe', ckdText: 'CKD' };
  var D = DimJS, pipe = document.getElementById(CFG.pipeId);
  var p5Radios = D.inputs(CFG.p5, 'radio');

  function update() {
    var ascvd = D.isOn(CFG.p4, CFG.ascvd), ckd = D.isOn(CFG.p4, CFG.ckd);
    D.show(CFG.p5, ascvd);
    if (!ascvd) p5Radios.forEach(D.clear);                    /* ignore a P5 answer after P4 changes */
    var picked = p5Radios.filter(function (r) { return r.checked; })[0];
    if (pipe) pipe.textContent = ckd ? CFG.ckdText : (picked ? D.label(picked) : '...');
  }
  D.inputs(CFG.p4, 'radio').concat(p5Radios).forEach(function (r) { r.addEventListener('change', update); });
  update();
});
