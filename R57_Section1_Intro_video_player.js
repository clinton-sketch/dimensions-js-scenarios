/* Row 57 (scenario 56) - Open the instruction video from the "click here" link, in a player box on the page
   Survey PC1 | Section 1 introduction (Section1_Intro)
   Setup : Section1_Intro label holds the link as an mrRef, so the player turns the path into a working URL:
             <mrRef RefType='a' href='js_files/R57_instruction_video.mp4' target='_blank'>click here</mrRef>
           Without JS the link simply opens the video in a new browser tab.
   Behaviour: the link opens a box over the page with the video player (title, x and Close; also closes
           on Esc or a click outside the box). Closing pauses the video. Nothing is posted and Next is
           never hidden (the QNR does not ask for full-playback tracking).
   Banner: Section1_Intro is an info screen shown on its own, so the file goes on IOM.Banners:
           IOM.Banners.AddNew("R57_Video", "<mrRef RefType = ""script"" src = ""js_files/R57_Section1_Intro_video_player.js"" ...>")
           before Section1_Intro.Show(), IOM.Banners.Remove("R57_Video") after. */
DimJS.ready(function () {
  var CFG = { file: /R57_instruction_video/i, title: 'Instruction video' };
  var D = DimJS;
  var links = D.all('a').filter(function (a) {
    var h = a.getAttribute('href') || '';
    try { h = decodeURIComponent(h); } catch (e) {}
    return CFG.file.test(h);
  });
  if (!links.length) return;

  D.css('djsVideoPop',
    '.djs-vov{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(0,0,0,.6);' +
      'display:none;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}' +
    '.djs-vov.on{display:flex}' +
    '.djs-vdlg{background:#fff;max-width:900px;width:100%;max-height:95%;overflow:auto;border-radius:8px;' +
      'padding:16px 18px;box-shadow:0 8px 30px rgba(0,0,0,.4);position:relative;box-sizing:border-box}' +
    '.djs-vdlg h3{margin:0 30px 10px 0;font-size:110%}' +
    '.djs-vdlg video{display:block;width:100%;max-height:70vh;background:#000}' +
    '.djs-vdlg .djs-vmsg{display:none;color:#c00020;margin-top:8px}' +
    '.djs-vdlg .djs-x{position:absolute;right:10px;top:4px;font-size:26px;line-height:1;cursor:pointer;color:#555;background:none;border:0}' +
    '.djs-vdlg .djs-close{margin-top:12px;background:#00868b;color:#fff;border:0;border-radius:4px;padding:6px 16px;cursor:pointer}');

  var ov = document.createElement('div'); ov.className = 'djs-vov';
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
  var dlg = document.createElement('div'); dlg.className = 'djs-vdlg';
  var x = document.createElement('button'); x.type = 'button'; x.className = 'djs-x';
  x.textContent = String.fromCharCode(215); x.setAttribute('aria-label', 'Close');
  var h = document.createElement('h3'); h.textContent = CFG.title;
  var vid = document.createElement('video'); vid.controls = true; vid.preload = 'metadata';
  vid.setAttribute('playsinline', '');
  var msg = document.createElement('div'); msg.className = 'djs-vmsg';
  msg.textContent = 'The video could not be loaded. Please try the link again later.';
  var close = document.createElement('button'); close.type = 'button'; close.className = 'djs-close';
  close.textContent = 'Close';
  dlg.appendChild(x); dlg.appendChild(h); dlg.appendChild(vid); dlg.appendChild(msg); dlg.appendChild(close);
  ov.appendChild(dlg); document.body.appendChild(ov);   /* outside the form: never posted */
  vid.addEventListener('error', function () { msg.style.display = 'block'; });

  var last = null;
  function open(e) {
    if (e) e.preventDefault();
    var a = e ? e.currentTarget : links[0];
    if (vid.getAttribute('src') !== a.href) { msg.style.display = 'none'; vid.src = a.href; }
    last = document.activeElement;
    ov.classList.add('on');
    close.focus();
    var p = vid.play(); if (p && p.catch) p.catch(function () {});   /* autoplay may be refused: controls stay */
  }
  function shut() { vid.pause(); ov.classList.remove('on'); if (last && last.focus) last.focus(); }
  links.forEach(function (a) { a.setAttribute('role', 'button'); a.addEventListener('click', open); });
  x.addEventListener('click', shut);
  close.addEventListener('click', shut);
  ov.addEventListener('click', function (e) { if (e.target === ov) shut(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('on')) shut(); });
});
