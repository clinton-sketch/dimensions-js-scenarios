/* Row 69 (scenario 68) - Unique avatar selector with patient descriptor
   Survey PC2 | P0 (select an avatar + type a descriptor), asked for each patient record (PC2PRF loop)
   QNR: use the full range of avatars; once an avatar has been selected, remove it from subsequent selections so
        each patient has a unique avatar.
   Setup : PC2PRF[..].P0Blk with P0 categorical [1..1] {use LstPC2Avatar} (labels = avatar images
           js_files/R69_avatarNN.png, codes _1.._10 = stable avatar ID) and P0_Desc text [0..30].
           Uniqueness is done by the routing: before each record, P0's categories are filtered to all avatars minus
           the ones chosen in the OTHER records (the record being edited keeps its own avatar; an avatar changed in
           an earlier record is offered again). ValPC2P0 gives clear messages for a missing avatar / descriptor.
   Behaviour: the avatars still offered are laid out as clickable tiles side by side in their own wrapping row
           (radio buttons kept for keyboard / screen readers), the descriptor stays below them, the chosen tile is
           outlined and the chosen avatar is shown beside the descriptor box. Nothing extra is posted.
   Layout : same as R59 - works with the SurveyTemplate_DA list (ipsosfi.js moves each radio into its full-width
           <label class="InputSingle">) and with a table layout; the tiles are moved into one new row container.
   Banner: PC2PRF[..].P0Blk.P0.Banners.AddNew("R69_P0", "<mrRef RefType = ""script"" src = ""js_files/R69_P0_unique_avatar_tiles_with_descriptor.js"" ...>")
           before .P0Blk.Ask(), .P0Blk.P0.Banners.Remove("R69_P0") after. */
DimJS.ready(function () {
  var CFG = { pick: 'P0', code: 'P0_Desc', none: 'No avatar selected yet', size: 72 };
  var D = DimJS;
  var radios = D.inputs(CFG.pick, 'radio');
  if (!radios.length) return;
  var box = D.inputs(CFG.code, 'text')[0];

  D.css('djsR69',
    '.djs-av-row{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch;margin:6px 0 14px}' +
    '.djs-av-tile{display:flex!important;flex:0 0 auto!important;align-items:center;justify-content:center;' +
      'width:auto!important;min-width:0!important;margin:0!important;padding:6px!important;' +
      'border:2px solid #d0d0d0!important;border-radius:10px;background:#fff;cursor:pointer;box-sizing:border-box}' +
    '.djs-av-tile:hover{border-color:#7aa7c7!important}' +
    '.djs-av-tile.djs-on{border-color:#00868b!important;box-shadow:0 0 0 3px rgba(0,134,139,.25);background:#eef8f8!important}' +
    '.djs-av-tile label,.djs-av-tile .InputSingle{display:flex!important;flex-direction:column;align-items:center;' +
      'margin:0!important;padding:0!important;width:auto!important;background:transparent!important;cursor:pointer}' +
    '.djs-av-tile .circlemark,.djs-av-tile .squaremark{display:none!important}' +   /* template radio mark sat on the image; the tile outline shows the choice */
    '.djs-av-tile img{display:block;width:' + CFG.size + 'px;height:' + CFG.size + 'px}' +
    '.djs-av-pick{display:inline-flex;align-items:center;gap:10px;margin-left:12px;vertical-align:middle;font-size:90%;color:#555}' +
    '.djs-av-pick img{width:48px;height:48px;border-radius:50%;border:2px solid #00868b}');

  /* the element holding exactly one avatar: climb while the parent still holds only this radio
     (inside a table: the content of the answer's cell) */
  function tileOf(r) {
    var n = r;
    while (n.parentElement && !/^(TABLE|TBODY|TR|TD|FORM|BODY)$/.test(n.parentElement.tagName) &&
           !n.parentElement.classList.contains('mrQuestionTable') &&
           n.parentElement.querySelectorAll('input[type=radio]').length === 1) n = n.parentElement;
    return n;
  }

  var tiles = radios.map(function (r) { return { r: r, cell: tileOf(r) }; });

  /* the tiles get their own row container placed where the first avatar was, so the next
     question (Patient Code) stays below the avatars instead of joining the row */
  var wrap = null;
  function layout() {
    tiles.forEach(function (t) { t.cell = tileOf(t.r); t.cell.classList.add('djs-av-tile'); });
    if (!wrap) {
      wrap = document.createElement('div'); wrap.className = 'djs-av-row';
      wrap.setAttribute('role', 'radiogroup');
      var first = tiles[0].cell;
      first.parentNode.insertBefore(wrap, first);
    }
    var oldTables = [];
    tiles.forEach(function (t) {
      var nx = t.cell.nextElementSibling;
      if (nx && nx.tagName === 'BR' && nx.parentNode !== wrap) nx.style.display = 'none';   /* line break after each answer */
      var tbl = t.cell.closest('table');
      if (tbl && !wrap.contains(tbl) && oldTables.indexOf(tbl) < 0) oldTables.push(tbl);
      wrap.appendChild(t.cell);
    });
    oldTables.forEach(function (tb) { if (!tb.querySelector('input')) tb.style.display = 'none'; });   /* emptied answer table */
  }

  /* clicking anywhere on the tile selects it (the label already does this for the image) */
  tiles.forEach(function (t) {
    t.cell.addEventListener('click', function (e) {
      if (e.target === t.r || (e.target.closest && e.target.closest('label'))) return;
      if (!t.r.checked) { t.r.checked = true; D.fire(t.r, 'change'); }
    });
    t.r.addEventListener('change', sync);
  });

  /* chosen avatar shown beside the Patient Code box */
  var pick = null;
  if (box) {
    pick = document.createElement('span'); pick.className = 'djs-av-pick';
    pick.setAttribute('aria-live', 'polite');
    box.parentNode.insertBefore(pick, box.nextSibling);
  }

  function sync() {
    var on = null;
    tiles.forEach(function (t) {
      t.cell.classList.toggle('djs-on', t.r.checked);
      if (t.r.checked) on = t;
    });
    if (!pick) return;
    pick.innerHTML = '';
    var img = on && on.cell.querySelector('img');
    if (img) {
      var c = img.cloneNode(false); c.removeAttribute('width'); c.removeAttribute('height');
      c.alt = img.alt || 'Chosen icon';
      pick.appendChild(c);
    } else {
      pick.textContent = CFG.none;
    }
  }
  layout(); sync();
  setTimeout(function () { layout(); sync(); }, 300);   /* after the template has rebuilt the answers / restored values */
});
