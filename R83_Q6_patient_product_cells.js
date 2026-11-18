/* Row 83 (scenario 82) - Q6: products a patient cannot have are greyed out in that patient's row
   Survey PC3 | Q6 grid (rows = the 5 patients with their PRF summary, columns = same treatment + PRODUCT V..Z,
           randomised). QNR: IF P11=3 (ARNI) no PRODUCT Z; PRODUCT V only if P4 < 45%; PRODUCT W only if P4 >= 50%.
   Setup : Q6 loop _1.._5, field Choice categorical [1..1] {_0 ... fix, _V, _W, _X, _Y, _Z} ran; every row
           keeps all columns so they stay aligned. Routing writes the products not allowed per patient into
           hQ6Deny1..5 (e.g. "_V _Z"), piped into each row label as <span class='djs-q6-deny'>{#hQ6Deny1}</span>.
   Behaviour: in each row the radio buttons of the products in that row's list are disabled and greyed
           (a disabled field is not posted); an answer already on one of them is cleared.
           Server: ValQ6 (ERR_Q6_NA) rejects the same products, so the rule holds without JS too.
   Banner: Q6.Banners.AddNew("R83_Q6", "<mrRef RefType = ""script"" src = ""js_files/R83_Q6_patient_product_cells.js"" ...>")
           before Q6.Ask(), Q6.Banners.Remove("R83_Q6") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q6', field: 'Choice', deny: '.djs-q6-deny', tip: 'Not available for this patient' };
  var D = DimJS, radios = D.inputs(CFG.q, 'radio');
  if (!radios.length) return;
  var rows = {};
  radios.forEach(function (r) { (rows[r.name] = rows[r.name] || []).push(r); });
  Object.keys(rows).forEach(function (name) {
    var tr = D.row(rows[name][0]), sp = tr ? tr.querySelector(CFG.deny) : null;
    if (!sp) return;
    var deny = sp.textContent.trim().split(/\s+/).filter(Boolean).map(function (c) { return '_' + D.norm(c).replace(/^_/, ''); });
    rows[name].forEach(function (r) {
      var c = '_' + D.norm(r.value).replace(/^_/, '');
      if (deny.indexOf(c) < 0) return;
      if (r.checked) r.checked = false;
      D.disable(r, true);
      var cell = r.closest('td');
      if (cell) { cell.title = CFG.tip; cell.style.background = '#e6e6e6'; }
      r.title = CFG.tip;
    });
  });
});
