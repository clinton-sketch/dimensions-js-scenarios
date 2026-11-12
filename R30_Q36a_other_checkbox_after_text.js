/* Row 30 - "Other" checkbox selectable only after text is typed in its box
   Survey 37 | Q36a
   Setup : Q36a categorical with  _96 "Other [Please specify]" other fix  (native other-specify box).
   Routing: Dimensions already rejects Other without text and text without Other.
   Behaviour: the text box can always be typed in. The checkbox cannot be ticked until the box
           has text (it is not ticked automatically); it is unticked and blocked again when the
           text is removed.
   Note  : the ipsosfi template moves the text box INSIDE the Other label, so only clicks on the
           checkbox / label text are blocked here - never the label as a whole.
   Banner: Q36a.Banners.AddNew("R30_Q36a", "<script ... src=""<link>""></script>") before Q36a.Ask(),
           Q36a.Banners.Remove("R30_Q36a") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q36a', otherCode: '_96' };
  var D = DimJS, cb = D.cat(CFG.q, CFG.otherCode);
  var box = D.inputs(CFG.q, 'text')[0];
  if (!cb || !box) return;

  D.css('djsOthLock', '.djs-oth-off{opacity:.45;cursor:not-allowed}');

  function has() { return box.value.trim() !== ''; }
  function lab() { return D.labelEl(cb) || cb.closest('label'); }
  /* parts of the Other choice that are not the text box: checkbox, tick mark, label text */
  function parts() {
    var out = [cb], l = lab();
    if (l) D.all('.mrMultipleText,.squaremark', l).forEach(function (el) {
      if (!el.contains(box)) out.push(el);
    });
    var cell = cb.closest('td');
    if (cell) D.all('.squaremark', cell).forEach(function (el) { if (out.indexOf(el) < 0) out.push(el); });
    return out;
  }
  function untick() {
    if (!cb.checked) return;
    cb.checked = false;
    if (window.jQuery) jQuery(cb).trigger('change'); /* template redraws its tick */
    else cb.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function sync() {
    var on = has();
    if (!on) untick();
    cb.tabIndex = on ? 0 : -1;
    cb.setAttribute('aria-disabled', on ? 'false' : 'true');
    parts().forEach(function (el) { el.classList.toggle('djs-oth-off', !on); });
  }
  /* block ticking while the box is empty; clicks inside the text box always go through */
  document.addEventListener('click', function (e) {
    if (has()) return;
    var t = e.target, l = lab();
    if (t === box || box.contains(t)) return;
    if (t === cb || (l && l.contains(t))) { e.preventDefault(); e.stopPropagation(); box.focus(); }
  }, true);
  cb.addEventListener('keydown', function (e) { if (!has() && (e.key === ' ' || e.key === 'Enter')) e.preventDefault(); });
  cb.addEventListener('change', function () { if (!has() && cb.checked) untick(); });
  ['input', 'change', 'keyup'].forEach(function (ev) { box.addEventListener(ev, sync); });
  sync();
  setTimeout(sync, 300); /* after the template has rebuilt the label */
});
