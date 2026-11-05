/* Row 59 - Avatar selection and patient code on the same screen
   PC1-Modified | PT1 (10 avatars) / PT2 (patient code)
   Setup : PT1 categorical [1..1] whose labels are images
             _1 "<img src=""[%ImageCacheBase%]/avatar1.png"" alt=""Avatar 1"">" ...
           PT2 text, both in one block (Block_PT). Pipe both into each chart header via label inserts.
   JS    : turns the radios into clickable image tiles (radios stay in the page, so they post)
           and shows the chosen avatar beside the code box.
   Banner: Block_PT.Banners.AddNew("PT_Avatar", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { avatar: 'PT1', code: 'PT2' };
  var D = DimJS, radios = D.inputs(CFG.avatar, 'radio'), code = D.inputs(CFG.code, 'text')[0];
  if (!radios.length) return;
  D.css('djsAv', '.djs-av{display:inline-block;margin:6px;padding:4px;border:3px solid transparent;' +
    'border-radius:8px;cursor:pointer}.djs-av img{width:80px;height:80px;object-fit:cover;display:block}' +
    '.djs-av.on{border-color:#1565c0}.djs-av input{position:absolute;opacity:0}' +
    '.djs-av-pick img{width:48px;height:48px;vertical-align:middle;margin-right:8px;border-radius:50%}');

  radios.forEach(function (r) {
    var l = D.labelEl(r); if (!l) return;
    l.classList.add('djs-av');
    l.insertBefore(r, l.firstChild);                         // radio inside its label = whole tile clickable
    r.addEventListener('change', paint);
  });
  var pick = code ? D.after(code, 'djsAvPick', 'span', 'djs-av-pick') : null;
  if (pick) code.parentNode.insertBefore(pick, code);

  function paint() {
    radios.forEach(function (r) { var l = D.labelEl(r) || r.parentNode; l.classList.toggle('on', r.checked); });
    var on = radios.filter(function (r) { return r.checked; })[0];
    var img = on && (D.labelEl(on) || on.parentNode).querySelector('img');
    if (pick) pick.innerHTML = img ? '<img src="' + img.src + '" alt="">' : '';
  }
  paint();
});
