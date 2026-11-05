/* Row 18 - Short-answer elaboration prompt with Yes / No
   Survey 36 | Scenario #17 / Q22
   Setup : Q22 text (no maximum length). Optional flag question on the same page:
           Q22_Prompted text [0..1] - records that the respondent chose "No, I have nothing to add".
   Behaviour: on Next, if the answer has 1-19 characters show the pop-up.
           Yes -> back to the box to edit.  No -> the page is submitted.
           A blank answer is left to the normal mandatory error.
   Banner: Q22.Banners.AddNew("Q22_Elaborate", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q22', flag: 'Q22_Prompted', min: 20,
              text: 'Would you please elaborate on your response?',
              yes: 'Yes, I will elaborate', no: 'No, I have nothing to add' };
  var D = DimJS, box = D.inputs(CFG.q, 'text')[0], flag = D.flag(CFG.flag);
  if (!box) return;

  D.css('djsModal', '.djs-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;' +
    'align-items:center;justify-content:center;z-index:9999}.djs-dlg{background:#fff;padding:20px;' +
    'max-width:420px;width:90%;border-radius:6px;font-size:15px}.djs-dlg button{margin:12px 8px 0 0;padding:6px 14px}');

  function ask() {
    var ov = document.createElement('div');
    ov.className = 'djs-ov';
    ov.innerHTML = '<div class="djs-dlg" role="dialog" aria-modal="true"><p></p>' +
      '<button type="button" class="y"></button><button type="button" class="n"></button></div>';
    ov.querySelector('p').textContent = CFG.text;
    ov.querySelector('.y').textContent = CFG.yes;
    ov.querySelector('.n').textContent = CFG.no;
    document.body.appendChild(ov);
    ov.querySelector('.y').focus();
    ov.querySelector('.y').onclick = function () { ov.remove(); box.focus(); };
    ov.querySelector('.n').onclick = function () { ov.remove(); if (flag) flag.value = '1'; D.goNext(); };
  }

  D.onNext(function () {
    var len = box.value.trim().length;
    if (len > 0 && len < CFG.min) { ask(); return false; }
  });
});
