/* Row 7 (scenario 6) - Biosimilar definition in a pop-up box, opened from a link under the question
   Survey 34 | Q2 (biosimilar pushback) - pop-up version Q2Bio_Pop
   (the expandable-panel version Q2Bio needs no JS: it uses an HTML <details> panel in its label)
   Setup : Q2Bio_Pop label ends with
             <br/><a href='#' class='djs-def-link'>Click here to view the definition of biosimilar</a>
             <span class='djs-def'> ...definition + example HTML... </span>
           Without JS the definition simply stays visible under the question.
   Behaviour: the definition span is hidden and the link opens it in a box over the page
           (title, text, x and Close; also closes on Esc or a click outside the box).
           Nothing is posted; the answer list is untouched.
   Banner: Q2Bio_Pop.Banners.AddNew("R07_Q2Bio_Pop", "<mrRef RefType = ""script"" src = ""js_files/R07_Q2Bio_Pop_definition_popup.js"" ...>")
           before Q2Bio_Pop.Ask(), Q2Bio_Pop.Banners.Remove("R07_Q2Bio_Pop") after. */
DimJS.ready(function () {
  var CFG = { link: '.djs-def-link', text: '.djs-def', title: 'Definition of biosimilar' };
  var D = DimJS;
  var links = D.all(CFG.link), src = document.querySelector(CFG.text);
  if (!links.length || !src) return;
  src.style.display = 'none';

  D.css('djsDefPop',
    '.djs-ov{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(0,0,0,.45);' +
      'display:none;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}' +
    '.djs-ov.on{display:flex}' +
    '.djs-dlg{background:#fff;max-width:640px;width:100%;max-height:90%;overflow:auto;border-radius:8px;' +
      'padding:18px 22px;font-size:90%;line-height:1.45;box-shadow:0 8px 30px rgba(0,0,0,.35);position:relative;box-sizing:border-box}' +
    '.djs-dlg h3{margin:0 28px 10px 0;font-size:110%}' +
    '.djs-dlg .djs-x{position:absolute;right:10px;top:4px;font-size:24px;line-height:1;cursor:pointer;color:#555;background:none;border:0}' +
    '.djs-dlg .djs-close{margin-top:12px;background:#00868b;color:#fff;border:0;border-radius:4px;padding:6px 16px;cursor:pointer}' +
    CFG.link + '{color:#0b5cad;font-weight:bold;text-decoration:underline;cursor:pointer}');

  var ov = document.createElement('div'); ov.className = 'djs-ov';
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
  var dlg = document.createElement('div'); dlg.className = 'djs-dlg';
  var x = document.createElement('button'); x.type = 'button'; x.className = 'djs-x';
  x.textContent = String.fromCharCode(215); x.setAttribute('aria-label', 'Close');
  var h = document.createElement('h3'); h.textContent = CFG.title;
  var body = document.createElement('div'); body.innerHTML = src.innerHTML;
  var close = document.createElement('button'); close.type = 'button'; close.className = 'djs-close';
  close.textContent = 'Close';
  dlg.appendChild(x); dlg.appendChild(h); dlg.appendChild(body); dlg.appendChild(close);
  ov.appendChild(dlg); document.body.appendChild(ov);   /* outside the form: never posted */

  var last = null;
  function open(e) { if (e) e.preventDefault(); last = document.activeElement; ov.classList.add('on'); close.focus(); }
  function shut() { ov.classList.remove('on'); if (last && last.focus) last.focus(); }
  links.forEach(function (a) { a.setAttribute('role', 'button'); a.addEventListener('click', open); });
  x.addEventListener('click', shut);
  close.addEventListener('click', shut);
  ov.addEventListener('click', function (e) { if (e.target === ov) shut(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('on')) shut(); });
});
