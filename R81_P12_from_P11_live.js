/* Row 81 (scenario 80) - P12 lists only the treatments ticked in P11, with the P11 specify texts shown, live on the page
   Survey PC3 | Patient Record Form, P11 -> P12 (QNR: ONLY SHOW CODES SELECTED IN P11).
           Clinton (18 Nov): what is typed in P11's SGLT2 / Other boxes is shown in P12 ("Other: <text>"), not asked again.
   Setup : PRF loop fields P11 and P12 with the same codes _1 .. _12 on the same page;
           P12 labels for _11 / _12 end with <span class='djs-p12-11'></span> / <span class='djs-p12-12'></span>;
           P11 boxes P11_11bis / P11_Oth placed by R80 (loaded before this file).
   Behaviour: each P12 answer is shown only while the same code is ticked in P11; a hidden answer is unticked,
           so it is never saved. 'SGLT2 inhibitors' and 'Other' show the text typed at P11 (": dapagliflozin"),
           updated as the respondent types. A note is shown instead of P12 while nothing is ticked in P11.
           Nothing is ticked automatically, even when only one answer is left.
           Rebuilt on every P11 / P4 change and when the page is shown again.
           Server: ValPRF (ERR_P12) rejects a P12 answer that is not in P11.
   Banner: PRF[..].P1.Banners.AddNew("R81_P1", "<mrRef RefType = ""script"" src = ""js_files/R81_P12_from_P11_live.js"" ...>")
           before each PRF iteration Ask, removed after. */
DimJS.ready(function () {
  var CFG = { from: 'P11', to: 'P12', texts: { _11: 'P11_11bis', _12: 'P11_Oth' },
              spans: { _11: '.djs-p12-11', _12: '.djs-p12-12' }, empty: 'Please first select the current treatment(s) in P11.' };
  var D = DimJS, p12 = D.inputs(CFG.to, 'checkbox');
  if (!p12.length || !D.inputs(CFG.from, 'checkbox').length) return;
  var list = p12[0].closest('table') || p12[0].parentNode;

  function nChoices(n) { return D.all('input[type=checkbox],input[type=radio]', n).length; }
  /* the element holding one answer (its cell / span), plus a <br> right after it */
  function optBox(el) {
    var n = el;
    while (n.parentElement && !/^(TABLE|TBODY|FORM|BODY)$/.test(n.parentElement.tagName) &&
           nChoices(n.parentElement) === 1) n = n.parentElement;
    var out = [n];
    if (n === el) { var l = D.labelEl(el); if (l) out.push(l); }
    var nx = (out[out.length - 1]).nextElementSibling;
    if (nx && nx.tagName === 'BR') out.push(nx);
    return out;
  }
  function code(el) { return '_' + D.norm(el.value).replace(/^_/, ''); }

  function update() {
    var any = false;
    p12.forEach(function (el) {
      var c = code(el), src = D.cat(CFG.from, c), on = !!(src && src.checked);
      optBox(el).forEach(function (x) { x.style.display = on ? '' : 'none'; });
      if (!on && el.checked) { el.checked = false; D.fire(el, 'change'); }   /* never saved */
      if (on) any = true;
      if (CFG.spans[c]) {
        var t = D.inputs(CFG.texts[c], 'text')[0];
        var v = t && t.style.display !== 'none' ? t.value.trim() : '';
        D.all(CFG.spans[c]).forEach(function (s) { s.textContent = v ? ': ' + v : ''; });
      }
    });
    if (list) D.message(list, 'djs_msg_p12', any ? '' : CFG.empty).style.color = '#555';
  }
  D.inputs(CFG.from, 'checkbox').forEach(function (b) { b.addEventListener('change', function () { setTimeout(update, 0); }); });
  Object.keys(CFG.texts).forEach(function (c) {
    var t = D.inputs(CFG.texts[c], 'text')[0];
    if (t) ['input', 'change'].forEach(function (ev) { t.addEventListener(ev, function () { setTimeout(update, 0); }); });
  });
  /* P4 / P4bis / P4ter can hide the SGLT2 box (R80) - refresh the shown text then too */
  D.all('input').forEach(function (e) {
    if (/_QP4/.test(D.norm(e.name))) ['input', 'change'].forEach(function (ev) { e.addEventListener(ev, function () { setTimeout(update, 0); }); });
  });
  update();
  setTimeout(update, 350);   /* after R80 has placed / hidden the specify boxes and values were restored */
});
