/* Row 24 - Keep the desktop grid layout for one question on mobile
   Survey 37 | Q35a
   How   : responsive templates turn grid tables into stacked blocks with CSS media queries.
           This forces normal table display for THIS question's table only and lets it scroll
           sideways on narrow screens. If the template rebuilds the grid with its own JS
           (card/accordion widgets), also switch that widget off for Q35a in routing/template.
   Banner: Q35a.Banners.AddNew("Q35a_Desktop", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { q: 'Q35a' };
  var first = DimJS.inputs(CFG.q, 'radio')[0];
  if (!first) return;
  var table = first.closest('table');
  table.classList.add('djs-keep-table');

  var wrap = document.createElement('div');
  wrap.style.overflowX = 'auto'; wrap.style.webkitOverflowScrolling = 'touch';
  table.parentNode.insertBefore(wrap, table); wrap.appendChild(table);

  DimJS.css('djsKeepTable',
    'table.djs-keep-table{display:table!important;width:auto!important;min-width:520px}' +
    'table.djs-keep-table thead{display:table-header-group!important}' +
    'table.djs-keep-table tbody{display:table-row-group!important}' +
    'table.djs-keep-table tr{display:table-row!important}' +
    'table.djs-keep-table td,table.djs-keep-table th{display:table-cell!important;width:auto!important}' +
    'table.djs-keep-table td:before{content:none!important}' +      // mobile card labels
    'table.djs-keep-table input[type=radio]{width:22px;height:22px}');  // usable touch target
});
