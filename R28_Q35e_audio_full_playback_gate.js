/* Row 28 - Hide Next until the audio (Q35e) has been played in full
   (Q35e copy of R27_R28_Q35d_Q35e_media_full_playback_gate.js - CFG set for Q35e)
   Survey 37 | Q35d video, Q35e audio
   Setup : label HTML holds an empty player plus an mrRef link to the local file in js_files
           (the player turns the mrRef path into a working URL; a plain <source src> pointing
           outside does not play in Professional):
             <video id='Q35dPlayer' controls='controls' playsinline='playsinline' width='640' style='max-width:100%'></video>
             <mrRef RefType='a' href='js_files/R27_Q35d_reading_video.mp4' target='_blank'>Open the video</mrRef>
             <audio id='Q35ePlayer' controls='controls'></audio>
             <mrRef RefType='a' href='js_files/R28_Q35e_audio_excerpt.wav' target='_blank'>Open the audio</mrRef>
           JS hides the link and plays its file in the player. Without JS the link opens the file.
   Flag question on the same page: Q35d_Done / Q35e_Done text [0..1], MustAnswer = False.
   Routing: validation - flag must be "1" (also protects browsers without JS).
   JS    : counts only the time actually played (skipping ahead does not count); Next appears
           once 98% of the media has been played. A return visit with the flag set shows Next.
   Banner: on the media question (first on the page), before the page Ask, removed after:
             Q35d.Banners.AddNew("R27_Q35d", "<script ... src=""<link>""></script>")  (this file)
             Q35e.Banners.AddNew("R28_Q35e", "<script ... src=""<link>""></script>")  (R28 copy) */
DimJS.ready(function () {
  var CFG = { playerId: 'Q35ePlayer', flag: 'Q35e_Done', needed: 0.98,
              file: /R2[78]_Q35[de]_/i };
  var D = DimJS, m = document.getElementById(CFG.playerId), flag = D.inputs(CFG.flag, 'text')[0] || null;
  if (!m) return;
  /* media file: from the mrRef link (resolved by the player) - hidden, its URL fed to the player */
  var link = D.all('a').filter(function (a) { return CFG.file.test(a.getAttribute('href') || ''); })[0];
  m.addEventListener('error', function () {      /* capture: errors on an inner <source> do not bubble */
    D.message(m, 'djsMediaErr', 'The media could not be loaded. Please refresh the page.');
  }, true);
  if (link) {
    link.style.display = 'none';
    if (!m.getAttribute('src') && !m.querySelector('source')) { m.preload = 'metadata'; m.src = link.href; }
  }
  /* Hide only the flag's own box and its (empty) label. D.flag would hide the flag's whole
     area, and when the flag is the only answer field on the page (the media question is an
     info item) that area is the entire page: player, text and Next. */
  if (flag) {
    var box = flag.parentElement && flag.parentElement.tagName === 'SPAN' ? flag.parentElement : flag;
    [box].concat(D.lead(box)).forEach(function (el) {
      if (!el.contains(m) && !el.querySelector('.mrNext,[name="_NNext"]')) el.style.display = 'none';
    });
  }
  if (flag && flag.value === '1') return;                 /* already completed earlier */
  D.showNext(false);

  /* Seconds actually played, from the browser's own record of played ranges (m.played):
     skipping ahead adds nothing, replaying a part does not count twice. */
  function playedSeconds() {
    var r = m.played, t = 0;
    for (var k = 0; r && k < r.length; k++) t += r.end(k) - r.start(k);
    return t;
  }
  function check() {
    var dur = m.duration;
    if (dur && isFinite(dur) && playedSeconds() >= dur * CFG.needed) done();
  }
  m.addEventListener('timeupdate', check);
  m.addEventListener('ended', check);
  function done() { if (flag) flag.value = '1'; D.showNext(true); }
});
