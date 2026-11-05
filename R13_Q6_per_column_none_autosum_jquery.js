/* Row 13 - Per-column exclusive None with numeric autosums (jQuery, as the scenario asks)
   Survey 36 | Scenario #12 / Q6 (Medicare / Commercial)
   Setup : Q6 = numeric grid (rows = 9 factors, columns Medicare / Commercial, long [0..100],
           MustAnswer = False) + Q6_NoneMed and Q6_NoneCom categorical [0..1] {_1 "None of these"}
           on the same page (block). Q9 results shown via label inserts on the right.
   Routing: validation per column - None ticked => no numbers in that column; otherwise sum = 100.
   Needs : jQuery in the template (Dimensions default templates normally load it; else add a
           <script src> to jQuery in the banner first).
   Banner: Block_Q6.Banners.AddNew("Q6_Sum", "<script>...</script>") */
$(function () {
  var CFG = { grid: 'Q6', columns: [{ none: 'Q6_NoneMed', label: 'Medicare' },
                                    { none: 'Q6_NoneCom', label: 'Commercial' }] };
  var D = DimJS;
  var $cells = $(D.inputs(CFG.grid, 'text'));
  if (!$cells.length) return;
  var colIdx = [];                                         // table column index of each grid column
  $cells.each(function () { var c = D.col(this); if (colIdx.indexOf(c) < 0) colIdx.push(c); });
  colIdx.sort(function (a, b) { return a - b; });
  var $table = $cells.first().closest('table');
  var $tot = $('<tr class="djs-total"><td><b>Total</b></td></tr>').appendTo($table);

  CFG.columns.forEach(function (col, i) {
    var $col = $cells.filter(function () { return D.col(this) === colIdx[i]; });
    var $none = $(D.inputs(col.none, 'checkbox'));
    var $sum = $('<td style="font-weight:bold"></td>').appendTo($tot);

    function update() {
      var noneOn = $none.is(':checked'), sum = 0;
      $col.each(function () {
        if (noneOn) this.value = '';
        D.disable(this, noneOn);
        var v = D.num(this.value); if (!isNaN(v)) sum += v;
      });
      $sum.text(noneOn ? '-' : sum + ' %').css('color', noneOn || sum === 100 ? '#1b5e20' : '#b00020');
    }
    $col.on('input change', function () { if (this.value !== '') $none.prop('checked', false); update(); });
    $none.on('change', update);
    update();
  });
});
