/* Row 30 - "Other" checkbox selectable only after text is typed in its box
   Survey 37 | Q36a
   Setup : Q36a categorical with  _96 "Other" other  (native other-specify box).
   Routing: Dimensions already rejects Other without text; validation also rejects text without Other.
   Behaviour: the checkbox cannot be clicked until the box has text (it is not ticked
           automatically); it is cleared and blocked again when the text is removed.
   Banner: Q36a.Banners.AddNew("Q36a_Other", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q36a', otherCode: '_96' };
  var D = DimJS, cb = D.cat(CFG.q, CFG.otherCode);
  var box = D.inputs(CFG.q, 'text')[0];
  if (!cb || !box) return;
  function sync() {
    var has = box.value.trim() !== '';
    if (!has) cb.checked = false;
    // keep it enabled-but-blocked rather than disabled so a saved Other still posts
    cb.style.pointerEvents = has ? '' : 'none';
    cb.tabIndex = has ? 0 : -1;
    var l = D.labelEl(cb); if (l) { l.style.opacity = has ? '' : '0.45'; l.style.pointerEvents = has ? '' : 'none'; }
    cb.style.opacity = has ? '' : '0.45';
  }
  box.addEventListener('input', sync);
  sync();
});
