/* Row 70 (scenario 69) - A4 migraine days checked live against the allocated patient type
   Survey PC2 | patient record, demographics table, A4 (# of migraine days in last month):
           8-31, and matching the patient type of the record - type 1: 8-12, type 2: 13-17, type 3: 18+.
   Setup : DemoBlk field A4 long [8 .. 31]; the routing writes the band of the record being asked ("8-12" /
           "13-17" / "18-31") into hPC2Band, piped into a hidden span in the A4 label:
           <span class='djs-a4-band' style='display:none'>{#\.hPC2Band}</span>.
   Behaviour: digits only; as soon as a value outside the record's band (or outside 8-31) is typed, a message is
           shown under the box naming the allowed range; it clears when fixed. The allocated type is kept - the
           patient is never re-categorised to make an answer pass. Nothing extra is posted.
           Server: the metadata range (8-31) and ValPC2Demo (ERR_A4_T1 / _T2 / _T3) enforce the same rules.
   Banner: PC2PRF[..].DemoBlk.A1.Banners.AddNew("R70_A1", "<mrRef RefType = ""script"" src = ""js_files/R70_A4_type_band_check.js"" ...>")
           before .DemoBlk.Ask() (A1 = first question of the page), removed after. */
DimJS.ready(function () {
  var CFG = { q: 'A4', band: '.djs-a4-band', min: 8, max: 31 };
  var D = DimJS, box = D.inputs(CFG.q, 'text')[0];
  if (!box) return;
  var sp = document.querySelector(CFG.band);
  var m = sp ? sp.textContent.match(/(\d+)\s*-\s*(\d+)/) : null;
  var lo = m ? Number(m[1]) : CFG.min, hi = m ? Number(m[2]) : CFG.max;
  box.setAttribute('inputmode', 'numeric'); box.maxLength = 2;

  function check() {
    var v = box.value.replace(/[^0-9]/g, '');
    if (v !== box.value) box.value = v;
    var n = D.num(box.value);
    D.message(box, 'djs_msg_a4', isNaN(n) || (n >= lo && n <= hi) ? '' :
      'For this patient type please enter between ' + lo + ' and ' + hi + ' migraine days.');
  }
  box.addEventListener('input', check);
  check();
});
