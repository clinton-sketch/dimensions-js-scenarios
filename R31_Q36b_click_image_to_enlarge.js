/* Row 31 - Click the image to enlarge it in a pop-up
   Survey 37 | Q36b (e-reader concept)
   Setup : label HTML  <img class="djs-zoom" src="[%ImageCacheBase%]/concept.jpg" alt="Concept"
                        style="max-width:300px;cursor:zoom-in"><br/><i>Click to enlarge</i>
   Banner: Q36b.Banners.AddNew("Q36b_Zoom", "<script>...</script>") */
DimJS.ready(function () {
  var D = DimJS;
  D.css('djsZoom', '.djs-zoom-ov{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;' +
    'align-items:center;justify-content:center;z-index:9999}.djs-zoom-ov img{max-width:95vw;max-height:90vh;' +
    'background:#fff}.djs-zoom-x{position:absolute;top:12px;right:16px;font-size:28px;color:#fff;' +
    'background:none;border:0;cursor:pointer}');
  D.all('img.djs-zoom').forEach(function (img) {
    img.setAttribute('tabindex', '0');
    function open() {
      var ov = document.createElement('div');
      ov.className = 'djs-zoom-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
      ov.innerHTML = '<button type="button" class="djs-zoom-x" aria-label="Close">&times;</button>';
      var big = document.createElement('img'); big.src = img.getAttribute('data-large') || img.src; big.alt = img.alt;
      ov.appendChild(big);
      function close() { ov.remove(); document.removeEventListener('keydown', esc); img.focus(); }
      function esc(e) { if (e.key === 'Escape') close(); }
      ov.addEventListener('click', function (e) { if (e.target !== big) close(); });
      document.addEventListener('keydown', esc);
      document.body.appendChild(ov);
      ov.firstChild.focus();
    }
    img.addEventListener('click', open);
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
  });
});
