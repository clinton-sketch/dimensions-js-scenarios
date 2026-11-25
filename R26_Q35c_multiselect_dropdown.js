/* Row 26 - Multi-select shown as a dropdown with checkboxes
   Survey 37 | Q35c (6 genres)
   Setup : Q35c categorical [1..] as usual. JS MOVES the real checkboxes into a dropdown panel,
           so Dimensions still posts and restores the answers. The dropdown sits outside the
           template's phone scroll box (div.wrap), and genre names come from the answer text only.
           On phones the open list pushes the page down instead of covering the buttons below it.
   Banner: Q35c.Banners.AddNew("R26_Q35c", "<script ... src=""<link>""></script>") before Q35c.Ask(),
           Q35c.Banners.Remove("R26_Q35c") after. */
DimJS.ready(function () {
  var CFG = { q: 'Q35c', placeholder: 'Select genres' };
  var D = DimJS, boxes = D.inputs(CFG.q, 'checkbox');
  if (!boxes.length) return;
  /* The answer list only: the smallest element holding every checkbox and its label.
     (D.ownBlock climbs to the whole page when Q35c is alone on it, hiding the question
     text and the Next button too.) Never hide anything holding the question text or nav. */
  var parts = boxes.concat(boxes.map(D.labelEl).filter(Boolean)), oldBlock = boxes[0].parentElement;
  while (oldBlock && !parts.every(function (x) { return oldBlock.contains(x); })) oldBlock = oldBlock.parentElement;
  if (!oldBlock || oldBlock.querySelector('.mrQuestionText,.mrNext,[name="_NNext"]') || /^(FORM|BODY)$/.test(oldBlock.tagName)) {
    oldBlock = null;
  }

  D.css('djsMulti', '.djs-ms{position:relative;display:inline-block;min-width:280px}' +
    '.djs-ms-btn{width:100%;text-align:left;padding:6px 28px 6px 8px;border:1px solid #888;background:#fff;cursor:pointer}' +
    '.djs-ms-btn:after{content:"\\25BE";position:absolute;right:10px}' +
    '.djs-ms-list{display:none;position:absolute;left:0;right:0;background:#fff;border:1px solid #888;z-index:50;max-height:240px;overflow:auto}' +
    '.djs-ms.open .djs-ms-list{display:block}.djs-ms-list label{display:block;padding:5px 8px;cursor:pointer}' +
    '.djs-ms-list label:hover{background:#eef}' +
    /* phones: the open list pushes the page down instead of covering the buttons below it */
    '@media only screen and (max-width: 640px){.djs-ms{display:block;min-width:0}' +
    '.djs-ms-list{position:static;max-height:none}}');

  var wrap = document.createElement('div');
  wrap.className = 'djs-ms';
  wrap.innerHTML = '<button type="button" class="djs-ms-btn" aria-haspopup="listbox"></button><div class="djs-ms-list" role="listbox"></div>';
  var anchor = oldBlock || boxes[0];
  /* On phones the template (ipsosfi.js) puts the answer list in <div class="wrap"> (overflow:auto),
     which would clip the open list to a tiny scroll box: place the dropdown before that box. */
  var clip = anchor.parentNode;
  while (clip && clip !== document.body && !(clip.classList && clip.classList.contains('wrap'))) clip = clip.parentNode;
  if (clip && clip !== document.body && !clip.querySelector('.mrQuestionText,.mrNext,[name="_NNext"]')) anchor = clip;
  anchor.parentNode.insertBefore(wrap, anchor);
  var leftovers = boxes.map(function (b) { return b.closest('td,li') || b.parentElement; });
  var btn = wrap.firstChild, list = wrap.lastChild;

  boxes.forEach(function (b) {
    var row = document.createElement('label');
    /* answer text only: on page return the template writes a tick (&#10004;) into the label's
       .squaremark, which must not become part of the genre name */
    var lab = D.labelEl(b), txt = lab && lab.querySelector('.mrMultipleText');
    var text = txt ? txt.textContent.trim() : D.label(b).replace(/✔/g, '').trim();
    row.appendChild(b); row.appendChild(document.createTextNode(' ' + text));
    list.appendChild(row);
    b.addEventListener('change', paint);
  });
  if (oldBlock) oldBlock.style.display = 'none';
  else leftovers.forEach(function (el) { if (el && !el.contains(wrap)) el.style.display = 'none'; });

  function paint() {
    var picked = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.parentNode.textContent.trim(); });
    btn.textContent = picked.length ? picked.join(', ') : CFG.placeholder;
  }
  btn.addEventListener('click', function () { wrap.classList.toggle('open'); });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) wrap.classList.remove('open'); });
  wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape') { wrap.classList.remove('open'); btn.focus(); } });
  paint();
});
