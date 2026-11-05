/* Row 64 - Enable the symptom-trajectory radios only for selected rows
   PC1-Modified | A3_1 (symptom | selected | Worsening / Stable / Improving)
   Setup : A3_1 = loop over symptoms with Sel categorical [0..1] {_1} and
           Traj categorical [0..1] {_1 Worsening, _2 Stable, _3 Improving} in one row.
   Routing: validation - trajectory required for ticked rows only; NULL Traj on unticked rows
           after the ask.
   Banner: A3_1.Banners.AddNew("A3_1_Traj", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'A3_1' };
  var D = DimJS;
  D.inputs(CFG.q, 'checkbox').forEach(function (sel) {
    var radios = D.inputs(CFG.q, 'radio', D.row(sel));
    function sync() {
      radios.forEach(function (r) { if (!sel.checked) r.checked = false; D.disable(r, !sel.checked); });
    }
    sel.addEventListener('change', sync);
    sync();
  });
});
