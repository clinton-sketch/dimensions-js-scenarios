/* Rows 27 and 28 - Hide Next until the video (Q35d) / audio (Q35e) has been played in full
   Survey 37 | Q35d video, Q35e audio
   Setup : label HTML holds the player, e.g.
             <video id="Q35dPlayer" controls playsinline width="640" style="max-width:100%">
               <source src="[%ImageCacheBase%]/reading.mp4" type="video/mp4"></video>
             <audio id="Q35ePlayer" controls><source src="[%ImageCacheBase%]/excerpt.mp3" type="audio/mpeg"></audio>
           Flag question on the same page: Q35d_Done / Q35e_Done text [0..1], MustAnswer = False.
   Routing: validation - flag must be "1" (also protects browsers without JS).
   JS    : counts only the time actually played (skipping ahead does not count); Next appears
           once 98% of the media has been played. A return visit with the flag set shows Next.
   Banner: on the media question (first on the page), before the page Ask, removed after:
             Q35d.Banners.AddNew("R27_Q35d", "<script ... src=""<link>""></script>")  (this file)
             Q35e.Banners.AddNew("R28_Q35e", "<script ... src=""<link>""></script>")  (R28 copy) */
DimJS.ready(function () {
  var CFG = { playerId: 'Q35dPlayer', flag: 'Q35d_Done', needed: 0.98 };
  var D = DimJS, m = document.getElementById(CFG.playerId), flag = D.inputs(CFG.flag, 'text')[0] || null;
  if (!m) return;
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
  /* capture phase: a missing file raises the error on the inner <source>, which does not bubble */
  m.addEventListener('error', function () {
    D.message(m, 'djsMediaErr', 'The media could not be loaded. Please refresh the page.');
  }, true);
  function done() { if (flag) flag.value = '1'; D.showNext(true); }
});
