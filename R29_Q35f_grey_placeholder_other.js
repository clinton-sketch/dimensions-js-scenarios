/* Row 29 - Grey placeholder text in the Other box, box shown inside the Other row
   Survey 37 | Q35f (Fiction / Non-Fiction / Academic / Other + counts)
   Setup : set up like Q10 / Q10_oth1:
             Q35f loop, Other row label  "Other<span id='q35f_oth'></span>"
             Q35f_OthText  text, codes NA, MustAnswer = False, on PageQ35f after Q35f
           This file moves the Q35f_OthText box into that span (no inline JS in the label).
   Prompt: the grey prompt is drawn over the box (not the HTML placeholder attribute), so it
           stays visible whenever the box is empty, also while the box has focus, and it is
           readable on the grey boxes of the debug player. It disappears as soon as text is
           typed and is never posted, so nothing extra is saved.
   Routing: ValQ35f - Other count > 0 needs the text, and the text needs an Other count > 0.
   Banner: Q35f.Banners.AddNew("R29_Q35f", "<script ... src=""<link>""></script>") before
           PageQ35f.Ask(), Q35f.Banners.Remove("R29_Q35f") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q35f', otherText: 'Q35f_OthText', slot: 'q35f_oth', text: 'Please specify other category' };
  var D = DimJS;
  var box = D.inputs(CFG.otherText, 'text')[0];
  if (!box) return;

  /* 1. Move the box into the Other row, like Q10_oth1; hide what is left of its own spot. */
  var slot = document.getElementById(CFG.slot);
  if (slot) {
    var home = box.parentElement && box.parentElement.tagName === 'SPAN' ? box.parentElement : box;
    var left = D.lead(home);
    slot.appendChild(box);
    [home].concat(left).forEach(function (el) {
      if (el !== box && !el.contains(box) && !el.querySelector('.mrNext,[name="_NNext"]')) el.style.display = 'none';
    });
  }

  /* 2. Grey prompt drawn over the box while it is empty. */
  var wrap = document.createElement('span');
  wrap.className = 'djs-ph-wrap';
  box.parentNode.insertBefore(wrap, box);
  wrap.appendChild(box);
  var tip = document.createElement('span');
  tip.className = 'djs-ph';
  tip.textContent = CFG.text;
  wrap.appendChild(tip);
  box.removeAttribute('placeholder');
  box.setAttribute('aria-label', CFG.text);

  D.css('djsPh',
    '.djs-ph-wrap{position:relative;display:inline-block;vertical-align:middle;margin-left:8px}' +
    '.djs-ph-wrap input{width:16em!important;max-width:100%;box-sizing:border-box}' +
    '.djs-ph{position:absolute;left:6px;right:6px;top:50%;transform:translateY(-50%);color:#5f5f5f;' +
      'font-style:italic;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}');

  function sync() { tip.style.display = box.value === '' ? '' : 'none'; }
  ['input', 'change', 'keyup', 'blur', 'focus'].forEach(function (ev) { box.addEventListener(ev, sync); });
  tip.addEventListener('mousedown', function (e) { e.preventDefault(); box.focus(); });
  sync();
  /* browser autofill / back button can fill the box without an input event */
  setTimeout(sync, 300); setTimeout(sync, 1500);
});
