/* Row 66 (scenario 65) - S10 patient counts: running total with live mismatch feedback against S9_1
   Survey PC2 | S10 (8-12 / 13-17 / 18+ migraine days per month): QNR must sum to S9_1;
           terminate if the sum of codes 1-3 < 4 (routing).
   Setup : S10 loop over the 3 bands with _scale long [0 .. 999]; the S9_1 number is piped into the question text
           as <span id='djs_s9_1'>{#S9_1}</span>; routing: S10.Validation.Function = "ValS10".
   Behaviour: a 'Total' row under the grid adds the three counts as they are typed and shows how many patients
           are still to allocate (or how many too many) against S9_1, in red until the total matches, green when
           it does. Digits only. Nothing extra is posted.
           Server: ValS10 (ERR_S10, with the S9_1 number) enforces total = S9_1; the < 4 screen-out stays in routing.
   Banner: S10.Banners.AddNew("R66_S10", "<mrRef RefType = ""script"" src = ""js_files/R66_S10_running_total.js"" ...>")
           before S10.Ask(), S10.Banners.Remove("R66_S10") after. */
DimJS.ready(function () {
  var CFG = { q: 'S10', target: 'djs_s9_1' };
  var D = DimJS, cells = D.inputs(CFG.q, 'text');
  if (!cells.length) return;
  var table = cells[0].closest('table');
  var target = D.piped(CFG.target);
  var out = D.after(table || cells[cells.length - 1], 'djs_s10_total', 'div');
  out.style.margin = '8px 0'; out.style.fontWeight = 'bold';
  out.setAttribute('aria-live', 'polite');

  function update() {
    var sum = 0, any = false;
    cells.forEach(function (c) {
      var v = c.value.replace(/[^0-9]/g, '');
      if (v !== c.value) c.value = v;
      var n = D.num(c.value);
      if (!isNaN(n)) { sum += n; any = true; }
    });
    var msg = 'Total: ' + sum;
    if (!isNaN(target)) {
      var diff = target - sum;
      msg += ' of ' + target + (diff === 0 ? ' - matches' : diff > 0 ? ' - ' + diff + ' still to allocate' : ' - ' + (-diff) + ' too many');
      out.style.color = diff === 0 ? '#1b5e20' : (any ? '#b00020' : '#555');
    }
    out.textContent = msg;
  }
  cells.forEach(function (c) {
    c.setAttribute('inputmode', 'numeric');
    c.addEventListener('input', update);
  });
  update();
});
