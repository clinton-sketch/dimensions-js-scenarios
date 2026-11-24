/* Row 74 (scenario 73) - Conditional numeric rows and piped totals, all on ONE page
   Survey PC3 | S13 -> S14 -> S14ter (rows = LstHFType: HFpEF / HFmrEF / HFrEF)
   Setup : PageS13 = page(S13, S14, S14ter).  (QNR: S14 shown only if S13.1 or S13.2 > 0)
             S13    loop, _scale long [0..9999]                    (all rows asked)
             S14    loop, _scale long [0..9999]                    label has <span id='djs_tot_s13'></span>
             S14ter loop, A long [0..9999], B / C long [0..100]    label has <span id='djs_tot_s14'></span>,
                    row labels "<span class='djs-s14n'></span> HFpEF patients currently treated" (S14 count written in)
           Routing: S14 / S14ter cells MustAnswer = False; PageS13.Validation.Function = "ValPageS13";
                    after the page, cells of rows not shown are set to NULL; then the QNR screen-out
                    (S13.1 + S13.2 < 3) and terminations (S14ter A < 3 / < 3 / < 2) run.
           PC3 has no B + C <= A rule (that came from the Survey 38 feedback) - With T2D / With CKD keep 0 - 100.
   Behaviour (live, as the respondent types):
           - S14 is shown only while S13.1 or S13.2 is > 0, and then an S14 row only while the
             matching S13 count is > 0;
             an S14ter row only while the matching S14 count is > 0;
             a question with no rows left is hidden completely (text + grid);
           - a hidden row is emptied, so it is never saved and never blocks the page;
           - the totals of S13 and S14 are written into the S14 / S14ter question text, and each
             S14 count into its S14ter row text;
           - a cell above its earlier count (S14 vs S13, S14ter column A vs S14) is outlined in red
             with a message under the grid. The server check ValPageS13 enforces the same rules.
           - phones: each answer card is labelled from its own grid's column labels (the template
             mixes the labels of the three grids on this page).
   Banner: S13.Banners.AddNew("R74_S13", "<mrRef RefType = ""script"" src = ""js_files/R74_S13_S14_S14ter_same_page_filter_and_totals.js"" ...>")
           before PageS13.Ask(), S13.Banners.Remove("R74_S13") after. */
DimJS.ready(function () {
  var CFG = {
    steps: [
      { q: 'S14', from: 'S13', fromField: '_scale', limitField: '_scale', tot: 'djs_tot_s13',
        gate: ['_1', '_2'],                                   /* QNR: SHOW IF S13.1 or S13.2 > 0 */
        msg: 'The number of treated patients cannot be more than the number of patients given in the first table.' },
      { q: 'S14ter', from: 'S14', fromField: '_scale', limitField: 'A', tot: 'djs_tot_s14',
        pipe: '.djs-s14n',                                    /* S14 count shown in the row text */
        msg: 'The number of patients with a treatment decision cannot be more than the number of treated patients.' }
    ]
  };
  var D = DimJS;

  D.css('djsR43', '.djs-over{outline:2px solid #c00020!important}');

  /* cells(q) -> { '_1': { _scale: <input>, ... }, ... } plus the row order */
  function cells(q) {
    var map = {}, order = [], re = new RegExp('_Q' + q + '_Q(_?[A-Za-z0-9]+)_Q(.+)$');
    D.inputs(q, 'text').forEach(function (el) {
      var m = D.norm(el.name).match(re);
      if (!m) return;
      if (!map[m[1]]) { map[m[1]] = {}; order.push(m[1]); }
      map[m[1]][m[2]] = el;
    });
    return { map: map, order: order };
  }
  function n(el) { var v = el ? D.num(el.value) : NaN; return isNaN(v) ? 0 : v; }

  var all = {};
  ['S13'].concat(CFG.steps.map(function (s) { return s.q; })).forEach(function (q) { all[q] = cells(q); });
  if (!all.S13.order.length) return;

  CFG.steps.forEach(function (s) {
    var c = all[s.q];
    s.blocks = D.boxes(s.q);
    s.table = null;
    c.order.forEach(function (cat) {
      var any = c.map[cat][s.limitField] || c.map[cat][Object.keys(c.map[cat])[0]];
      if (!s.table && any) s.table = any.closest('table');
    });
  });

  function update() {
    CFG.steps.forEach(function (s) {
      var src = all[s.from], c = all[s.q], shown = 0, over = false, tot = 0;
      var open = !s.gate || s.gate.some(function (cat) { return n(src.map[cat] && src.map[cat][s.fromField]) > 0; });
      src.order.forEach(function (cat) { tot += n(src.map[cat] && src.map[cat][s.fromField]); });
      var span = document.getElementById(s.tot);
      if (span) span.textContent = String(tot);
      c.order.forEach(function (cat) {
        var limit = n(src.map[cat] && src.map[cat][s.fromField]);
        var row = c.map[cat], first = row[Object.keys(row)[0]], tr = D.row(first);
        var on = open && limit > 0;
        if (tr) tr.style.display = on ? '' : 'none';
        if (s.pipe && tr) D.all(s.pipe, tr).forEach(function (sp) { sp.textContent = String(limit); });
        Object.keys(row).forEach(function (f) {
          if (!on && row[f].value !== '') row[f].value = '';     /* hidden row: never saved */
          row[f].classList.remove('djs-over');
        });
        if (on) {
          shown++;
          var lim = row[s.limitField];
          if (lim && lim.value.trim() !== '' && n(lim) > limit) { lim.classList.add('djs-over'); over = true; }
        }
      });
      D.show(s.blocks, shown > 0);
      if (s.table) D.message(s.table, 'djs_msg_' + s.q, shown > 0 && over ? s.msg : '');
    });
  }

  Object.keys(all).forEach(function (q) {
    all[q].order.forEach(function (cat) {
      Object.keys(all[q].map[cat]).forEach(function (f) {
        ['input', 'change', 'keyup'].forEach(function (ev) { all[q].map[cat][f].addEventListener(ev, update); });
      });
    });
  });
  update();
  setTimeout(update, 300);   /* after the template has rebuilt the grids / browser restored values */

  /* Phone card labels: the template (ipsosfi.js stackTable) collects the column labels of ALL grids
     on the page into one list, so with three grids the S14ter cards were labelled '#' / nothing.
     Re-label each answer cell from its OWN grid's label row; again after the template's resize
     handler (it re-runs stackTable 500 ms after a resize). */
  function cardLabels() {
    Object.keys(all).forEach(function (q) {
      var c = all[q], first = c.order.length && c.map[c.order[0]][Object.keys(c.map[c.order[0]])[0]];
      var t = first && first.closest('table'), body = t && t.tBodies[0];
      if (!body || !body.rows.length) return;
      var head = Array.prototype.map.call(body.rows[0].cells, function (h) { return h.textContent.trim(); });
      Array.prototype.forEach.call(body.rows, function (tr) {
        Array.prototype.forEach.call(tr.cells, function (td) {
          if (td.querySelector('input,select,textarea') && head[td.cellIndex]) td.setAttribute('data-th', head[td.cellIndex]);
        });
      });
    });
  }
  cardLabels();
  setTimeout(cardLabels, 300);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(cardLabels, 800); });
});
