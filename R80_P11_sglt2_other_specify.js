/* Row 80 (scenario 79) - P11: SGLT2 'please specify which treatment' box (live against the EF answers) and the Other box
   Survey PC3 | Patient Record Form, P11 (multiple answer); QNR: SGLT2 inhibitors
           [IF CODE 11 SELECTED, SHOW: EXCEPT IF P4 OR P4TER>40 P11_11bis "please specify which treatment"]; Other (please specify).
           P12: the P11 texts are shown in P12's answers by R81 (Clinton, 18 Nov) - no separate P12 boxes.
   Setup : PRF loop fields P11 categorical [1..] (LstHFTreat _1 .. _11, _12 "Other (please specify)"),
           text fields P11_11bis and P11_Oth (labels with <span class='djs-q-...'></span>);
           routing: both MustAnswer = False. P4 / P4bis / P4ter are on the same page.
   Behaviour: each box sits next to its answer ('SGLT2 inhibitors' / 'Other').
           SGLT2 box: shown only while that answer is ticked AND neither P4 nor P4ter (when asked) is above 40
           (40 itself still asks - literal '>40'); it reacts live to P4 / P4bis / P4ter.
           Other box: shown only while 'Other' is ticked.
           A hidden box is emptied, so it is never saved. Typing in a box ticks its answer.
           Server: ValPRF (ERR_P11_11bis / ERR_P11_Oth) uses the same rules; routing clears what does not apply.
   Banner: PRF[..].P1.Banners.AddNew("R80_P1", "<mrRef RefType = ""script"" src = ""js_files/R80_P11_sglt2_other_specify.js"" ...>")
           before each PRF iteration Ask, removed after (R81 is loaded after this file). */
DimJS.ready(function () {
  var CFG = { boxes: [ { q: 'P11', cat: '_11', box: 'P11_11bis', ef: true,  ph: 'please specify which treatment', aria: 'P11 - SGLT2 inhibitor: please specify which treatment' },
                        { q: 'P11', cat: '_12', box: 'P11_Oth',   ef: false, ph: 'please specify',                 aria: 'P11 - Other treatment: please specify' } ],
              ef: 'P4', bis: 'P4bis', ter: 'P4ter', yes: '_1', limit: 40 };
  var D = DimJS;
  var ef = D.inputs(CFG.ef, 'text')[0], ter = D.inputs(CFG.ter, 'text')[0];
  var list = [];
  CFG.boxes.forEach(function (c) {
    var cb = D.cat(c.q, c.cat), box = D.inputs(c.box, 'text')[0];
    if (!cb || !box) return;
    var blocks = D.boxes(c.box);
    box.style.marginLeft = '8px'; box.style.width = '16em'; box.style.verticalAlign = 'middle';
    box.placeholder = c.ph;
    box.setAttribute('aria-label', c.aria);
    function place() {
      var anchor = cb.closest('label') || D.labelEl(cb) || cb;   /* the template moves the checkbox into its label */
      if (anchor !== cb) { anchor.style.display = 'inline-block'; anchor.style.verticalAlign = 'middle'; }
      if (anchor.nextSibling !== box) anchor.parentNode.insertBefore(box, anchor.nextSibling);
    }
    place();
    D.show(blocks, false);
    box.addEventListener('input', function () {
      if (box.value.trim() !== '' && !cb.checked) { cb.checked = true; D.fire(cb, 'change'); }
    });
    list.push({ c: c, cb: cb, box: box, place: place });
  });
  if (!list.length) return;

  function over(el) { var v = el ? D.num(el.value) : NaN; return !isNaN(v) && v > CFG.limit; }
  function efOk() { return !over(ef) && !(D.isOn(CFG.bis, CFG.yes) && over(ter)); }
  function update() {
    var ok = efOk();
    list.forEach(function (p) {
      var on = p.cb.checked && (!p.c.ef || ok);
      p.box.style.display = on ? '' : 'none';
      if (!on && p.box.value !== '') { p.box.value = ''; D.fire(p.box, 'change'); }
    });
  }
  ['P11'].forEach(function (q) {
    D.inputs(q, 'checkbox').forEach(function (b) { b.addEventListener('change', function () { setTimeout(update, 0); }); });
  });
  [ef, ter].forEach(function (el) { if (el) ['input', 'change'].forEach(function (ev) { el.addEventListener(ev, update); }); });
  D.inputs(CFG.bis, 'radio').forEach(function (r) { r.addEventListener('change', function () { setTimeout(update, 0); }); });
  update();
  setTimeout(function () { list.forEach(function (p) { p.place(); }); update(); }, 300);   /* after the template rebuilt the answers */
});
