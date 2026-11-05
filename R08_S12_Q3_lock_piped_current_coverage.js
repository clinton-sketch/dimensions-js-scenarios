/* Row 8 - Display prior checkbox selections beside new responses
   Survey 34 | S12 -> Q3 (column A "Current coverage", column B "Change in Q4 2022")
   Setup : Q3 = loop over the S12 treatments (same category list and order as S12) with
             Cur categorical [0..1] {_1}  (column A)   and   Fut categorical [0..1] {_1}  (column B)
   Routing (before the ask) - tick column A from S12:
           For Each cat In Q3.Categories
               If S12.ContainsAny(CCategorical(cat.Name)) Then Q3[cat.Name].Cur = {_1}
           Next
   JS    : locks column A (still posted, cannot be changed); column B stays free.
   Banner: Q3.Banners.AddNew("Q3_LockA", "<script>...</script>") */
DimJS.ready(function () {
  var CFG = { lockedSub: 'Cur' };
  DimJS.inputs(CFG.lockedSub, 'checkbox').forEach(function (cb) { DimJS.lock(cb); });
});
