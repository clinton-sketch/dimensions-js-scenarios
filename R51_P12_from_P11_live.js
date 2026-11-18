/* Row 51 (scenario 50) - P12 lists only the P11 treatments, with the P11 specify texts written in
   Survey 38 | Patient Record Form, P11 -> P12 (QNR: ONLY SHOW CODES SELECTED IN P11;
           feedback rows 23 / 24 / 28: the P11 Other / SGLT2 texts are shown in P12, not asked again,
           also after going back and forth).
   Setup : PRF loop fields P11 and P12 with the same codes _1 .. _12 on the same page;
           P12 labels for _11 / _12 end with <span class='djs-p12-11'></span> / <span class='djs-p12-12'></span>.
   Behaviour: each P12 answer is shown only while the same code is ticked in P11 (a hidden one is
           unticked, so it is never saved); 'SGLT2 inhibitors' and 'Other' show the text typed at P11
           (": dapagliflozin"); a note is shown instead of P12 while nothing is ticked in P11.
           Rebuilt on every P11 change and when the page is shown again.
           Server: ValPRF (ERR_P12) rejects a P12 answer that is not in P11.
   Banner: PRF[..].P1.Banners.AddNew("R51_P1", "<mrRef RefType = ""script"" src = ""js_files/R51_P12_from_P11_live.js"" ...>")
           before each PRF iteration Ask, removed after. */
DimJS.ready(function () {
  var CFG = { from: 'P11', to: 'P12', texts: { _11: 'P11_11bis', _12: 'P11_Oth' },
              spans: { _11: '.djs-p12-11', _12: '.djs-p12-12' }, empty: 'Please first select the current treatment(s) in P11.' };
  var D = DimJS, p12 = D.inputs(CFG.to, 'checkbox');
  if (!p12.length || !D.inputs(CFG.from, 'checkbox').length) return;
  var list = p12[0].closest('table') || p12[0].parentNode;

  /* the element holding one answer (its row / cell / span), plus a <br> right after it */
  function optBox(el) {
    var n = el;
    while (n.parentElement && !/^(TABLE|TBODY|FORM|BODY)$/.test(n.parentElement.tagName) &&
           D.all('input', n.parentElement).length === 1) n = n.parentElement;
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
    if (t) ['input', 'change'].forEach(function (ev) { t.addEventListener(ev, update); });
  });
  /* P4 / P4bis / P4ter can hide the SGLT2 box (R50) - refresh the piped text then too */
  D.all('input').forEach(function (e) { if (/_QP4/.test(D.norm(e.name))) e.addEventListener('change', function () { setTimeout(update, 0); }); });
  update();
  setTimeout(update, 350);   /* after R50 has placed / hidden the specify boxes and values were restored */
});
