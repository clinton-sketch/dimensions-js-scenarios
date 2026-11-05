/* Row 12 - Reveal Next after the scenario link is clicked
   Survey 36 (JS set 2) | Scenario #11 / Q4
   Setup : Q4 label contains the link:  <a id="Q4ScenarioLink" href="[scenario url]" target="_blank">click here</a>
           Add a flag question on the same page (block): Q4_LinkClicked text [0..1] (or long [0..1]).
   Routing: validation - if Q4_LinkClicked <> "1" raise "Please view the scenario before continuing"
           (covers browsers with JS switched off). Set Q4_LinkClicked.MustAnswer = False.
   Banner: Block_Q4.Banners.AddNew("Q4_Link", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { linkId: 'Q4ScenarioLink', flag: 'Q4_LinkClicked' };
  var D = DimJS;
  var link = document.getElementById(CFG.linkId), flag = D.flag(CFG.flag);
  if (!link) return;
  function clicked() { return flag ? flag.value === '1' : false; }

  D.showNext(clicked());                   // already clicked on an earlier visit -> Next visible
  link.addEventListener('click', function () {
    if (flag) flag.value = '1';
    D.showNext(true);
  });
});
