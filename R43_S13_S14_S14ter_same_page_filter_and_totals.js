/* Row 43 (scenario 42) - Conditional numeric rows and piped totals, all on ONE page
   Survey 38 | S13 -> S14 -> S14ter (rows = LstHFType: HFpEF / HFmrEF / HFrEF)
   Setup : PageS13 = page(S13, S14, S14ter).
             S13    loop, _scale long [0..]                       (all rows asked)
             S14    loop, _scale long [0..] codes NA              label has <span id='djs_tot_s13'></span>
             S14ter loop, A / B / C long codes NA                  label has <span id='djs_tot_s14'></span>
           Routing: S14 / S14ter cells MustAnswer = False; PageS13.Validation.Function = "ValPageS13";
                    after the page, cells of rows whose earlier count is 0 are set to NULL.
   Behaviour (live, as the respondent types):
           - an S14 row is shown only while the matching S13 count is > 0;
             an S14ter row only while the matching S14 count is > 0;
             a question with no rows left is hidden completely (text + grid);
           - a hidden row is emptied, so it is never saved and never blocks the page;
           - the totals of S13 and S14 are written into the S14 / S14ter question text;
           - a cell above its earlier count (S14 vs S13, S14ter column A vs S14) is outlined in red
             with a message under the grid. The server check ValPageS13 enforces the same rules.
   Banner: S13.Banners.AddNew("R43_S13", "<mrRef RefType = ""script"" src = ""js_files/R43_S13_S14_S14ter_same_page_filter_and_totals.js"" ...>")
           before PageS13.Ask(), S13.Banners.Remove("R43_S13") after. */
DimJS.ready(function () {
  var CFG = {
    steps: [
      { q: 'S14', from: 'S13', fromField: '_scale', limitField: '_scale', tot: 'djs_tot_s13',
        msg: 'The number of treated patients cannot be more than the number of patients given in the first table.' },
      { q: 'S14ter', from: 'S14', fromField: '_scale', limitField: 'A', tot: 'djs_tot_s14',
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
      src.order.forEach(function (cat) { tot += n(src.map[cat] && src.map[cat][s.fromField]); });
      var span = document.getElementById(s.tot);
      if (span) span.textContent = String(tot);
      c.order.forEach(function (cat) {
        var limit = n(src.map[cat] && src.map[cat][s.fromField]);
        var row = c.map[cat], first = row[Object.keys(row)[0]], tr = D.row(first);
        var on = limit > 0;
        if (tr) tr.style.display = on ? '' : 'none';
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
});
