/* Row 19 (scenario 18) - Restrict numeric entry to three digits
   Survey 37 | Q34a (How many books do you own? 0-999)
   Setup : Q34a long [0 .. 999] - the range in the metadata is the real check: the server rejects
           anything outside 0-999 even if JS is off.
   Behaviour: the box takes digits only and stops at 3 digits while typing, pasting, dropping text
           or using a phone keyboard; a 4th digit is never shown. Deleting / overtyping a selection
           still works. Leading zeros are allowed while typing (Dimensions saves 007 as 7).
   Banner: Q34a.Banners.AddNew("R19_Q34a", "<mrRef RefType = ""script"" src = ""js_files/R19_Q34a_three_digit_limit.js"" ...>")
           before Q34a.Ask(), Q34a.Banners.Remove("R19_Q34a") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q34a', max: 3 };
  var D = DimJS, box = D.inputs(CFG.q, 'text')[0];
  if (!box) return;
  if (box.type === 'number') box.type = 'text';      // number inputs ignore maxlength
  box.setAttribute('maxlength', CFG.max);
  box.setAttribute('inputmode', 'numeric');          // number pad on phones
  box.setAttribute('pattern', '[0-9]*');
  box.setAttribute('autocomplete', 'off');

  function clean(v) { return String(v).replace(/[^0-9]/g, '').slice(0, CFG.max); }

  /* block a key that would add a 4th digit or a non-digit (before it is shown) */
  box.addEventListener('beforeinput', function (e) {
    if (!/^insert/.test(e.inputType) || e.data == null) return;   // deletions etc. pass
    var sel = box.selectionEnd - box.selectionStart;
    var digits = String(e.data).replace(/[^0-9]/g, '');
    if (digits !== e.data || box.value.length - sel + digits.length > CFG.max) e.preventDefault();
  });
  /* safety net for paste, drop, autofill and browsers without beforeinput: keep the first 3 digits */
  box.addEventListener('input', function () {
    var v = clean(box.value);
    if (v !== box.value) {
      var pos = Math.min(box.selectionStart || v.length, v.length);
      box.value = v;
      try { box.setSelectionRange(pos, pos); } catch (err) {}
    }
  });
  box.value = clean(box.value);                       // value restored on a return visit
});
