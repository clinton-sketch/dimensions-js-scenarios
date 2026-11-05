/* Rows 27 and 28 - Hide Next until the video (Q35d) / audio (Q35e) has been played in full
   Survey 37 | Q35d video, Q35e audio
   Setup : label HTML holds the player, e.g.
             <video id="Q35dPlayer" controls playsinline width="640" style="max-width:100%">
               <source src="[%ImageCacheBase%]/reading.mp4" type="video/mp4"></video>
             <audio id="Q35ePlayer" controls><source src="[%ImageCacheBase%]/excerpt.mp3" type="audio/mpeg"></audio>
           Flag question on the same page: Q35d_Done / Q35e_Done text [0..1], MustAnswer = False.
   Routing: validation - flag must be "1" (also protects browsers without JS).
   JS    : counts only the seconds actually played (seeking ahead does not count); Next appears
           once 98% of the media has been played. A return visit with the flag set shows Next.
   Banner: Q35d.Banners.AddNew("Q35d_Gate", "<script>...</script>")   (CFG for Q35d)
           Q35e.Banners.AddNew("Q35e_Gate", "<script>...</script>")   (change CFG to Q35e) */
DimJS.ready(function () {
  var CFG = { playerId: 'Q35dPlayer', flag: 'Q35d_Done', needed: 0.98 };
  var D = DimJS, m = document.getElementById(CFG.playerId), flag = D.flag(CFG.flag);
  if (!m) return;
  if (flag && flag.value === '1') return;                 // already completed earlier
  D.showNext(false);

  var watched = {}, last = 0;                             // whole seconds actually played
  m.addEventListener('seeking', function () { last = m.currentTime; });
  m.addEventListener('timeupdate', function () {
    var t = m.currentTime;
    if (!m.seeking && t - last >= 0 && t - last < 1.5) {
      for (var s = Math.floor(last); s <= Math.floor(t); s++) watched[s] = 1;
    }
    last = t;
    var dur = m.duration;
    if (dur && Object.keys(watched).length >= Math.floor(dur * CFG.needed)) done();
  });
  m.addEventListener('ended', function () {
    if (m.duration && Object.keys(watched).length >= Math.floor(m.duration * CFG.needed)) done();
  });
  m.addEventListener('error', function () {
    D.message(m, 'djsMediaErr', 'The media could not be loaded. Please refresh the page.');
  });
  function done() { if (flag) flag.value = '1'; D.showNext(true); }
});
