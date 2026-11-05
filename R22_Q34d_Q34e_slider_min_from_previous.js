/* Row 22 - Slider range driven by the previous numeric answer
   Survey 37 | Q34d -> Q34e (slider min = Q34d, max = 240)
   Setup : Q34d long [0..240] and Q34e long [0..240] in one block (Block_Q34d).
           If Q34d is on an earlier page instead, pipe it into the Q34e label as
           <span id="Q34dVal" style="display:none">{#Q34d}</span>  and set the range in routing:
           Q34e.Validation.MinValue = Q34d
   Routing: validation - Q34e >= Q34d (same-page case).
   JS    : adds a range slider bound to the real Q34e box (the box keeps the posted value).
   Banner: Block_Q34d.Banners.AddNew("Q34e_Slider", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { min: 'Q34d', minSpan: 'Q34dVal', target: 'Q34e', max: 240 };
  var D = DimJS, box = D.inputs(CFG.target, 'text')[0];
  if (!box) return;
  var minBox = D.inputs(CFG.min, 'text')[0];

  var wrap = D.after(box, 'djsQ34eWrap', 'div');
  wrap.innerHTML = '<input type="range" id="djsQ34eRange" style="width:320px;vertical-align:middle">' +
                   ' <b id="djsQ34eVal"></b> <span id="djsQ34eNote" style="color:#b00020"></span>';
  var range = document.getElementById('djsQ34eRange'), val = document.getElementById('djsQ34eVal'),
      note = document.getElementById('djsQ34eNote');
  box.style.display = 'none';

  function setRange() {
    var mn = D.piped(CFG.minSpan, CFG.min);
    if (isNaN(mn)) mn = 0;
    var bad = mn > CFG.max;
    range.min = bad ? CFG.max : mn; range.max = CFG.max; range.disabled = bad;
    note.textContent = bad ? 'Minimum goal is above ' + CFG.max + ' minutes - please check it.' : '';
    var v = D.num(box.value);
    if (isNaN(v) || v < mn) v = Math.min(mn, CFG.max);        // keep the answer inside the new range
    range.value = v; box.value = v; val.textContent = v + ' minutes';
  }
  range.addEventListener('input', function () { box.value = range.value; val.textContent = range.value + ' minutes'; });
  if (minBox) minBox.addEventListener('input', setRange);
  setRange();
});
