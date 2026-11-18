/* Row 59 (scenario 58) - Avatar choice and patient code on the same screen
   Survey PC1 | PT1 (choose an icon, 10 avatars) + PT2 (patient code), asked for each qualified chart
   Setup : PC1Chart loop (charts from QualifiedChart) with block PTBlk(PT1, PT2):
             PT1 categorical [1..1] {use LstPC1Avatar}  category labels are the avatar images
                 (<mrRef RefType='img' src='js_files/R59_avatarNN.png' .../>), codes _1.._10 = stable avatar ID
             PT2 text [1..20]
           The chosen avatar + code are piped into each chart header by the routing (hPC1Avatar / hPC1Code).
   Behaviour: the 10 avatars are laid out as clickable tiles side by side in a wrapping row (radio buttons
           kept for keyboard / screen readers); the chosen tile is outlined, and the chosen avatar is shown
           beside the Patient Code box, updating as soon as another tile is clicked.
           Nothing extra is posted: PT1 / PT2 are the normal Dimensions answers.
   Layout : works with both answer layouts - the plain list the SurveyTemplate_DA template builds (ipsosfi.js
           moves each radio into its <label class="InputSingle">, a full-width block, separated by <br/>) and
           a table with one answer per cell/row. The element holding one answer becomes the tile; all tiles are
           moved into one new wrapping row placed where the first avatar was, so the Patient Code question
           stays below the avatars.
   Errors : PT1 / PT2 are optional to the player; ValPC1PT gives clear messages (ERR_PT1 / ERR_PT2) instead of
           the player's "Missing answer(s)".
   Banner: PC1Chart[..].PTBlk.PT1.Banners.AddNew("R59_PT", "<mrRef RefType = ""script"" src = ""js_files/R59_PT1_PT2_avatar_tiles_with_code.js"" ...>")
           before .PTBlk.Ask(), .PTBlk.PT1.Banners.Remove("R59_PT") after. */
DimJS.ready(function () {
  var CFG = { pick: 'PT1', code: 'PT2', none: 'No icon chosen yet', size: 72 };
  var D = DimJS;
  var radios = D.inputs(CFG.pick, 'radio');
  if (!radios.length) return;
  var box = D.inputs(CFG.code, 'text')[0];

  D.css('djsR59',
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
