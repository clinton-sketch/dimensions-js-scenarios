/* Row 59 (scenario 58) - Avatar choice and patient code on the same screen
   Survey PC1 | PT1 (choose an icon, 10 avatars) + PT2 (patient code), asked for each qualified chart
   Setup : PC1Chart loop (charts from QualifiedChart) with block PTBlk(PT1, PT2):
             PT1 categorical [1..1] {use LstPC1Avatar}  category labels are the avatar images
                 (<mrRef RefType='img' src='js_files/R59_avatarNN.png' .../>), codes _1.._10 = stable avatar ID
             PT2 text [1..20]
           The chosen avatar + code are piped into each chart header by the routing (hPC1Avatar / hPC1Code).
   Behaviour: the 10 avatars are laid out as clickable tiles in a wrapping row (radio buttons kept for
           keyboard / screen readers); the chosen tile is outlined, and the chosen avatar is shown
           beside the Patient Code box, updating as soon as another tile is clicked.
           Nothing extra is posted: PT1 / PT2 are the normal Dimensions answers.
   Banner: PC1Chart[..].PTBlk.PT1.Banners.AddNew("R59_PT", "<mrRef RefType = ""script"" src = ""js_files/R59_PT1_PT2_avatar_tiles_with_code.js"" ...>")
           before .PTBlk.Ask(), .PTBlk.PT1.Banners.Remove("R59_PT") after. */
DimJS.ready(function () {
  var CFG = { pick: 'PT1', code: 'PT2', none: 'No icon chosen yet' };
  var D = DimJS;
  var radios = D.inputs(CFG.pick, 'radio');
  if (!radios.length) return;
  var box = D.inputs(CFG.code, 'text')[0];

  D.css('djsR59',
    '.djs-av-grid,.djs-av-grid>tbody{display:flex!important;flex-wrap:wrap;gap:10px;width:auto!important}' +
    '.djs-av-grid tr{display:contents!important}' +
    '.djs-av-tile{display:flex!important;flex-direction:column;align-items:center;gap:4px;padding:6px!important;' +
      'border:2px solid #d0d0d0!important;border-radius:10px;background:#fff;cursor:pointer;min-width:0!important;width:auto!important}' +
    '.djs-av-tile:hover{border-color:#7aa7c7!important}' +
    '.djs-av-tile.djs-on{border-color:#00868b!important;box-shadow:0 0 0 3px rgba(0,134,139,.25);background:#eef8f8}' +
    '.djs-av-tile label{margin:0!important;padding:0!important;cursor:pointer}' +
    '.djs-av-tile .circlemark,.djs-av-tile .squaremark{display:none!important}' +   /* template radio mark sat on the image; the tile outline shows the choice */
    '.djs-av-tile img{display:block;width:72px;height:72px}' +
    '.djs-av-pick{display:inline-flex;align-items:center;gap:10px;margin-left:12px;vertical-align:middle;font-size:90%;color:#555}' +
    '.djs-av-pick img{width:48px;height:48px;border-radius:50%;border:2px solid #00868b}');

  var tiles = [];
  radios.forEach(function (r) {
    var cell = r.closest('td') || r.parentNode;
    cell.classList.add('djs-av-tile');
    cell.addEventListener('click', function (e) {
      if (e.target === r || e.target.closest('label')) return;     /* the label already selects it */
      if (!r.checked) { r.checked = true; D.fire(r, 'change'); }
    });
    r.addEventListener('change', sync);
    tiles.push({ r: r, cell: cell });
  });
  var tbl = radios[0].closest('table');
  if (tbl) tbl.classList.add('djs-av-grid');

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
  sync();
  setTimeout(sync, 300);   /* after the template has set its own classes / browser restored values */
});
