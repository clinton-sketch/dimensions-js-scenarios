/* Row 64 (scenario 63) - A3_1: trajectory radios usable only for the selected symptoms
   Survey PC1 | patient chart, A3 table, A3_1 grid: column 1 'Select all that apply' (checkbox),
           columns 2-4 Worsening / Stable / Improving (radio). QNR: enable columns 2-4 only if the
           row is selected in column 1, else disabled.
   Setup : A3Blk field A3_1 loop (9 symptoms, _9 = Other) with Sel categorical [0..1] {_1} and
           Traj categorical [0..1] {_1 Worsening, _2 Stable, _3 Improving}; A3_1_Oth text for Other
           (label carries <span class='djs-q-A3_1_Oth'></span>); routing: all MustAnswer = False.
   Behaviour: in a row whose symptom is not selected the three radios are disabled, greyed and cleared
           (disabled fields are not posted); selecting the symptom enables them. The Other box sits in the
           Other row and is shown only while Other is selected (emptied otherwise). Restored answers on a
           page return are kept for selected rows. Selection and trajectory stay separate answers.
           Server: ValPC1A3 (ERR_A3_1_TRAJ / _NONE / _Oth) checks the same rules; routing clears the rest.
   Banner: PC1Chart[..].A3Blk.A3_1.Banners.AddNew("R64_A3", "<mrRef RefType = ""script"" src = ""js_files/R64_A3_1_enable_trajectory.js"" ...>")
           before .A3Blk.Ask(), removed after. */
DimJS.ready(function () {
  var CFG = { q: 'A3_1', sel: 'Sel', traj: 'Traj', other: '_9', otherText: 'A3_1_Oth' };
  var D = DimJS, rows = {}, order = [];
  var re = new RegExp('_Q' + CFG.q + '_Q(_?[A-Za-z0-9]+)_Q(' + CFG.sel + '|' + CFG.traj + ')');
  D.inputs(CFG.q, 'checkbox,radio').forEach(function (el) {
    var m = D.norm(el.name).match(re);
    if (!m) return;
    var k = '_' + m[1].replace(/^_/, '');
    if (!rows[k]) { rows[k] = { sel: null, traj: [] }; order.push(k); }
    if (m[2] === CFG.sel) rows[k].sel = el; else rows[k].traj.push(el);
  });
  if (!order.length) return;

  var oth = D.inputs(CFG.otherText, 'text')[0], othRow = rows[CFG.other];
  if (oth && othRow && othRow.sel) {
    var blocks = D.boxes(CFG.otherText);
    var lab = D.row(othRow.sel) ? D.row(othRow.sel).cells[0] : null;
    oth.style.marginLeft = '8px'; oth.style.width = '12em'; oth.placeholder = 'please specify';
    oth.setAttribute('aria-label', 'Other symptom - please specify');
    if (lab) lab.appendChild(oth);
    D.show(blocks, false);
    oth.addEventListener('input', function () {
      if (oth.value.trim() !== '' && !othRow.sel.checked) { othRow.sel.checked = true; D.fire(othRow.sel, 'change'); }
    });
  }

  function update() {
    order.forEach(function (k) {
      var r = rows[k], on = !!(r.sel && r.sel.checked);
      r.traj.forEach(function (t) {
        if (!on && t.checked) t.checked = false;            /* not applicable: never saved */
        D.disable(t, !on);
      });
    });
    if (oth && othRow && othRow.sel) {
      oth.style.display = othRow.sel.checked ? '' : 'none';
      if (!othRow.sel.checked && oth.value !== '') oth.value = '';
    }
  }
  order.forEach(function (k) { if (rows[k].sel) rows[k].sel.addEventListener('change', update); });
  update();
  setTimeout(update, 300);   /* after the template / browser restored values */
});
