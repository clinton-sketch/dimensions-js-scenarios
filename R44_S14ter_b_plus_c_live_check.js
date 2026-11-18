/* Row 44 (scenario 43) - Live check of the comorbidity columns in S14ter
   Survey 38 | S14ter (feedback row 3): for each patient-type row, 'With T2D' (B) + 'With CKD' (C)
           cannot be more than column A (patients with a treatment change or initiation).
   Setup : PageS13 = page(S13, S14, S14ter); S14ter loop over the 3 HF types, fields A / B / C long.
           Runs next to R43 (row filtering and totals) - rows R43 hides are skipped here.
   Behaviour: as soon as B + C goes above A in a shown row, B and C are outlined in red and a
           message is shown under the S14ter grid; it clears when fixed. Nothing extra is posted.
           The server check ValPageS13BC enforces the same rule on Next.
   Banner: S13.Banners.AddNew("R44_S13", "<mrRef RefType = ""script"" src = ""js_files/R44_S14ter_b_plus_c_live_check.js"" ...>")
           before PageS13.Ask() (next to R43_S13), S13.Banners.Remove("R44_S13") after. */
DimJS.ready(function () {
  var CFG = { q: 'S14ter', a: 'A', b: 'B', c: 'C',
    msg: "'With T2D' + 'With CKD' cannot be more than the first column for the same type of heart failure." };
  var D = DimJS, rows = {}, order = [], re = new RegExp('_Q' + CFG.q + '_Q(_?[A-Za-z0-9]+)_Q(.+)$');
  D.inputs(CFG.q, 'text').forEach(function (el) {
    var m = D.norm(el.name).match(re);
    if (!m) return;
    if (!rows[m[1]]) { rows[m[1]] = {}; order.push(m[1]); }
    rows[m[1]][m[2]] = el;
  });
  if (!order.length) return;
  var table = (rows[order[0]][CFG.a] || rows[order[0]][Object.keys(rows[order[0]])[0]]).closest('table');
  D.css('djsR44', '.djs-bc-over{outline:2px solid #c00020!important}');

  function n(el) { var v = el ? D.num(el.value) : NaN; return isNaN(v) ? 0 : v; }
  function update() {
    var bad = false;
    order.forEach(function (k) {
      var r = rows[k], tr = D.row(r[CFG.a] || r[CFG.b]);
      var shown = !tr || tr.style.display !== 'none';
      var over = shown && (r[CFG.b].value.trim() !== '' || r[CFG.c].value.trim() !== '') &&
                 n(r[CFG.b]) + n(r[CFG.c]) > n(r[CFG.a]);
      [r[CFG.b], r[CFG.c]].forEach(function (el) { if (el) el.classList.toggle('djs-bc-over', over); });
      if (over) bad = true;
    });
    if (table) D.message(table, 'djs_msg_bc', bad ? CFG.msg : '');
  }
  /* all fields on the page: S13 / S14 changes can show or hide S14ter rows (R43) */
  D.all('input[type=text],input[type=number],input[type=tel]').forEach(function (el) {
    ['input', 'change', 'keyup'].forEach(function (ev) { el.addEventListener(ev, function () { setTimeout(update, 0); }); });
  });
  update();
  setTimeout(update, 350);   /* after R43 has filtered the rows / browser restored values */
});
