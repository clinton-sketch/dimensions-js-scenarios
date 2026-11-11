/* Row 24 - Keep the desktop grid layout for one question on mobile
   Survey 37 | Q35a
   How   : on a phone the template (ipsosfi FI v2.0) adds the class "mobile" to grid tables,
           and its CSS then stacks every row into blocks. This keeps the class off THIS
           question's table only (also when the template re-applies it on resize), so the
           grid stays a table: rows down the side, answer columns across the top. Labels wrap
           and the grid is compacted to fit; if it is still too wide it scrolls sideways.
   Banner: Q35a.Banners.AddNew("R24_Q35a", "<script ... src=""<link>""></script>") before Q35a.Ask(),
           Q35a.Banners.Remove("R24_Q35a") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q35a' };
  var first = DimJS.inputs(CFG.q, 'radio,checkbox')[0];
  if (!first) return;
  var table = first.closest('table');
  table.classList.add('djs-keep-table');

  function keepTable() {
    if (table.classList.contains('mobile')) table.classList.remove('mobile');
  }
  keepTable();
  if (window.MutationObserver) {
    new MutationObserver(keepTable).observe(table, { attributes: true, attributeFilter: ['class'] });
  }

  var wrap = document.createElement('div');
  wrap.className = 'djs-keep-wrap';
  table.parentNode.insertBefore(wrap, table); wrap.appendChild(table);

  DimJS.css('djsKeepTable',
    '.djs-keep-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}' +
    'table.djs-keep-table{display:table!important;width:100%!important;margin:0!important;float:none!important}' +
    'table.djs-keep-table>tbody{display:table-row-group!important}' +
    'table.djs-keep-table tr{display:table-row!important}' +
    'table.djs-keep-table td,table.djs-keep-table th{display:table-cell!important;width:auto!important;margin:0!important}' +
    'table.djs-keep-table td:before{content:none!important;display:none!important}' +
    /* label inside a header cell: the template boxes it too, which overlaps when it wraps */
    'table.djs-keep-table td>span{border:0!important;padding:0!important;margin:0!important;' +
      'background:transparent!important;display:inline!important}' +
    '@media (max-width:600px){' +
      'table.djs-keep-table td,table.djs-keep-table th{padding:4px 2px!important;font-size:13px;' +
        'word-break:normal;overflow-wrap:break-word;hyphens:auto}' +
      'table.djs-keep-table td:first-child{max-width:28vw}' +
    '}');
});
