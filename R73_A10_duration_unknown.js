/* Row 73 (scenario 72) - A10 duration: weeks / months / years, Unknown exclusive to the three boxes
   Survey PC2 | patient record, treatment history table, A10 Duration of most recent treatment:
           weeks 0-52, months 0-12, years 0-10, Unknown [mutually exclusive]; do not allow 0 at all three.
   Setup : TreatBlk fields A10W long [0 .. 52], A10M long [0 .. 12], A10Y long [0 .. 10] (labels of A10M / A10Y carry
           <span class='djs-q-A10M'></span> / djs-q-A10Y) and A10_Unk categorical [0..] {_4 "Unknown"}
           (a tick box the respondent can untick - [0..1] made it a radio that could not be unticked);
           routing: all MustAnswer = False.
   Behaviour: the three boxes are shown on one line as  [__] weeks  [__] months  [__] years  [ ] Unknown.
           Ticking Unknown empties and disables the three boxes (disabled = not posted); unticking it enables
           them again (a value restored into a box on page return unticks Unknown). The three units are NOT exclusive to each other. When all three are 0 a message is shown at
           once. Digits only.
           Only the three boxes and their unit words are greyed while locked (not Unknown). The unit
           word 'weeks' comes from this file only (A10W's question text no longer ends with it).
           Server: ValPC2Treat (ERR_A10_UNK / ERR_A10_ZERO) enforces the same rules (a blank unit counts as 0).
   Banner: PC2PRF[..].TreatBlk.A9.Banners.AddNew("R73_A9", "<mrRef RefType = ""script"" src = ""js_files/R73_A10_duration_unknown.js"" ...>")
           before .TreatBlk.Ask() (A9 = first question of the page), removed after. */
DimJS.ready(function () {
  var CFG = { units: [['A10W', 'weeks', 2], ['A10M', 'months', 2], ['A10Y', 'years', 2]], unk: 'A10_Unk', code: '_4',
              zero: 'Weeks, months and years cannot all be 0 - please enter the duration or select Unknown.' };
  var D = DimJS;
  var boxes = CFG.units.map(function (u) { return { el: D.inputs(u[0], 'text')[0], q: u[0], word: u[1], len: u[2] }; })
                       .filter(function (b) { return b.el; });
  var unk = D.cat(CFG.unk, CFG.code);
  if (!boxes.length) return;
  var first = boxes[0].el;

  /* one line: [weeks] [months] [years] [Unknown] - the later boxes are moved after the first */
  var line = document.createElement('span'); line.className = 'djs-a10-line';
  first.parentNode.insertBefore(line, first);
  boxes.forEach(function (b, i) {
    var blocks = i ? D.boxes(b.q) : [];
    b.el.style.width = '3.5em'; b.el.maxLength = b.len; b.el.setAttribute('inputmode', 'numeric');
    b.el.setAttribute('aria-label', 'Duration in ' + b.word);
    line.appendChild(b.el);
    var w = document.createElement('span'); w.textContent = ' ' + b.word; w.style.margin = '0 18px 0 4px';
    line.appendChild(w);
    b.word = w;
    if (i) D.show(blocks, false);
  });
  if (unk) {
    var ublocks = D.boxes(CFG.unk);
    var ulab = unk.closest('label') || D.labelEl(unk);
    if (ulab && ulab.contains(unk)) {                 /* template: the checkbox sits inside its label */
      ulab.style.display = 'inline-block'; ulab.style.verticalAlign = 'middle';
      line.appendChild(ulab);
    } else {                                          /* plain player markup: checkbox, then its label */
      line.appendChild(unk);
      if (ulab) line.appendChild(ulab);
    }
    D.show(ublocks, false);
  }

  function update(src) {
    if (unk && src === unk && unk.checked) boxes.forEach(function (b) { b.el.value = ''; });
    if (unk && src && src !== unk && src.value !== '' && unk.checked) { unk.checked = false; D.fire(unk, 'change'); }
    var on = !!(unk && unk.checked);
    /* lock (disabled = not posted) and grey only the box and its unit word - D.disable would grey the
       box's parent, which is now the whole line, Unknown included */
    boxes.forEach(function (b) { b.el.disabled = on; b.el.style.opacity = b.word.style.opacity = on ? '0.45' : ''; });
    var filled = boxes.filter(function (b) { return b.el.value !== ''; });
    var allZero = !on && filled.length === boxes.length && filled.every(function (b) { return D.num(b.el.value) === 0; });
    D.message(line, 'djs_msg_a10', allZero ? CFG.zero : '');
  }
  boxes.forEach(function (b) {
    b.el.addEventListener('input', function () {
      var v = b.el.value.replace(/[^0-9]/g, '');
      if (v !== b.el.value) b.el.value = v;
      update(b.el);
    });
  });
  if (unk) unk.addEventListener('change', function () { update(unk); });
  update(null);
  setTimeout(function () { update(null); }, 300);
});
