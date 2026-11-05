/* =====================================================================
   DimJS - shared helper for Dimensions (Unicom Intelligence) interview pages
   ---------------------------------------------------------------------
   Load ONCE for the whole survey, at the top of routing (before any ask):

     IOM.Banners.AddNew("DimJS", "<script src=""[%ImageCacheBase%]/dim-helpers.js""></script>")

   or paste this file's text between <script> and </script> in that banner
   (inside an .mrs string every " must be doubled to "").

   Every scenario file in this folder calls DimJS.* inside DimJS.ready(),
   so it does not matter whether the scenario banner renders before or
   after this one.

   Player field names (check with View Source on the rendered page):
     _Q<Question>                 single question   e.g. _QQ8
     _Q<Block>_Q<Question>        block/page member e.g. _QPageQ47_QQ47
     _Q<Loop>_Q<Iteration>_Q<Sub> loop / grid cell  e.g. _QQ2_Q__1_QPct
   Underscores inside names are doubled by the player (Q47_Oth1 -> _QQ47__Oth1);
   DimJS.norm() undoes that, so CFG always uses the metadata names.
   Category inputs carry the category name as value (e.g. "_1").
   Next button: name "_NNext" (class "mrNext" in the default templates).
   ===================================================================== */
(function (w) {
  if (w.DimJS) return;
  var D = {};

  D.ready = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  D.all = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  // The player doubles underscores inside names/values (Q47_Oth1 -> _QQ47__Oth1, _1 -> __1);
  // compare on the single-underscore form.
  D.norm = function (s) { return String(s == null ? '' : s).replace(/__/g, '_'); };

  // True when the field belongs to question q (matches "_Q" + q, not a longer name).
  D.nameHas = function (el, q) {
    return !!el.name && new RegExp('_Q' + q + '(?![A-Za-z0-9])', 'i').test(D.norm(el.name));
  };

  // All fields of question q. types: optional "checkbox", "radio", "text" (text/number/textarea), "select".
  D.inputs = function (q, types, root) {
    return D.all('input,select,textarea', root).filter(function (e) {
      if (e.type === 'hidden' || !D.nameHas(e, q)) return false;
      if (!types) return true;
      return types.split(',').some(function (t) {
        if (t === 'text') return e.tagName === 'TEXTAREA' || /^(text|number|tel)$/.test(e.type);
        if (t === 'select') return e.tagName === 'SELECT';
        return e.type === t;
      });
    });
  };

  // Category code as Dimensions writes it ("_1"); accepts 1, "1" or "_1".
  D.code = function (c) { c = String(c); return c.charAt(0) === '_' ? c : '_' + c; };

  // The checkbox/radio of question q for category c (optionally inside root).
  D.cat = function (q, c, root) {
    c = D.code(c);
    return D.inputs(q, 'checkbox,radio', root).filter(function (e) {
      var v = D.norm(e.value);
      return v === c || v === c.slice(1) || D.norm(e.name).slice(-c.length) === c;
    })[0] || null;
  };

  D.checked = function (q, root) {
    return D.inputs(q, 'checkbox,radio', root).filter(function (e) { return e.checked; });
  };

  D.isOn = function (q, c, root) { var e = D.cat(q, c, root); return !!(e && e.checked); };

  D.num = function (v) {
    v = String(v == null ? '' : v).replace(/,/g, '').trim();
    return v === '' ? NaN : Number(v);
  };

  D.row = function (el) { return el ? el.closest('tr') : null; };
  D.col = function (el) { var c = el ? el.closest('td,th') : null; return c ? c.cellIndex : -1; };

  D.labelEl = function (el) { return el && el.id ? document.querySelector('label[for="' + el.id + '"]') : null; };
  D.label = function (el) { var l = D.labelEl(el); return l ? l.textContent.trim() : (el.title || el.value); };

  // Largest ancestor of `start` holding no fields of other questions = the question's own block.
  D.ownBlock = function (start, q) {
    var n = start;
    while (n.parentElement && n.parentElement !== document.body && n.parentElement.tagName !== 'FORM') {
      var p = n.parentElement;
      var foreign = D.all('input,select,textarea', p).some(function (e) {
        return e.name && e.type !== 'hidden' && !/^_[NI]/.test(e.name) && !D.nameHas(e, q);
      });
      if (foreign) break;
      n = p;
    }
    return n;
  };

  // Elements to show/hide for question q: its answer block, plus its text when the
  // label contains a marker <span class="djs-q-Q3A"></span> (put it in the metadata label).
  // The Dimensions player writes the questions of a page as loose siblings
  // (error text, question text, <div><br/></div>, answer span) with no wrapper per
  // question, so the answer block alone leaves the question text on screen. This also
  // takes the field-less siblings just before the answer block, back to the previous
  // question's fields. Banners and scripts are skipped. Grid cells and rows are left alone.
  D.hasFields = function (node) {
    return D.all('input,select,textarea', node).some(function (e) {
      return e.name && e.type !== 'hidden' && !/^_[NI]/.test(e.name);
    }) || (/^(INPUT|SELECT|TEXTAREA)$/.test(node.tagName) && node.type !== 'hidden');
  };
  D.lead = function (blk) {
    var out = [];
    if (!blk || /^(TD|TH|TR|TBODY|THEAD|LABEL)$/.test(blk.tagName)) return out;
    if (!blk.parentElement || /^(FORM|BODY)$/.test(blk.parentElement.tagName)) return out;
    for (var s = blk.previousElementSibling; s; s = s.previousElementSibling) {
      if (/^(SCRIPT|STYLE|LINK|MRPAGE)$/.test(s.tagName)) continue;
      if (s.classList.contains('mrBannerText') || s.querySelector('script')) continue;
      if (D.hasFields(s)) break;
      out.unshift(s);
    }
    return out;
  };

  D.boxes = function (q) {
    var out = [], f = D.inputs(q)[0], m = document.querySelector('.djs-q-' + q);
    function add(el) {
      if (el && out.indexOf(el) < 0 && !out.some(function (o) { return o.contains(el); })) out.push(el);
    }
    if (f) { var blk = D.ownBlock(f, q); D.lead(blk).forEach(add); add(blk); }
    if (m) add(D.ownBlock(m, q));
    return out;
  };

  D.show = function (target, on) {
    var list = typeof target === 'string' ? D.boxes(target) : [].concat(target);
    list.forEach(function (el) { if (el) el.style.display = on ? '' : 'none'; });
  };

  D.clear = function (el) {
    if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
    else if (el.tagName === 'SELECT') el.selectedIndex = -1;
    else el.value = '';
  };

  // disabled fields are NOT posted - use for answers that must not be saved.
  D.disable = function (el, on) {
    el.disabled = !!on;
    var l = D.labelEl(el), cell = el.closest('td') || el.parentElement;
    [l, cell].forEach(function (x) { if (x) x.style.opacity = on ? '0.45' : ''; });
  };

  // Locked but still posted (readonly text; click-blocked checkbox/radio).
  D.lock = function (el) {
    if (el.type === 'checkbox' || el.type === 'radio') {
      el.addEventListener('click', function (e) { e.preventDefault(); });
      el.setAttribute('aria-readonly', 'true');
    } else el.readOnly = true;
    el.style.backgroundColor = '#eeeeee';
    el.style.cursor = 'not-allowed';
  };

  D.fire = function (el, type) {
    var ev = document.createEvent('HTMLEvents'); ev.initEvent(type, true, true); el.dispatchEvent(ev);
  };

  D.css = function (id, text) {
    if (document.getElementById(id)) return;
    var s = document.createElement('style'); s.id = id; s.appendChild(document.createTextNode(text));
    document.head.appendChild(s);
  };

  // Create (once) an element right after `anchor`.
  D.after = function (anchor, id, tag, cls) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement(tag || 'div'); el.id = id; if (cls) el.className = cls;
      anchor.parentNode.insertBefore(el, anchor.nextSibling);
    }
    return el;
  };

  D.message = function (anchor, id, text) {
    var el = D.after(anchor, id, 'div', 'djs-msg');
    el.style.color = '#b00020'; el.style.margin = '4px 0';
    el.textContent = text || ''; el.style.display = text ? '' : 'none';
    return el;
  };

  D.nextButtons = function () {
    return D.all('input[name="_NNext"],button[name="_NNext"],.mrNext,#btnNext,#NextButton,input[name="Next"]');
  };

  D.showNext = function (on) {
    D.nextButtons().forEach(function (b) { b.style.visibility = on ? '' : 'hidden'; b.disabled = !on; });
  };

  // fn(event) returning false blocks Next. Covers button click and Enter-key submit.
  D.onNext = function (fn) {
    D.nextButtons().forEach(function (b) {
      b.addEventListener('click', function (e) {
        if (D._bypass) return;
        if (fn(e) === false) { e.preventDefault(); e.stopImmediatePropagation(); }
      }, true);
    });
    var f = document.forms[0];
    if (f) f.addEventListener('submit', function (e) {
      if (D._bypass) return;
      var s = e.submitter;
      if (s && s.name && s.name !== '_NNext') return;   // Previous / Stop etc.
      if (fn(e) === false) { e.preventDefault(); }
    }, true);
  };

  // Submit the page through the real Next button (skips onNext checks once).
  D.goNext = function () {
    var b = D.nextButtons()[0];
    D._bypass = true;
    if (b) { b.disabled = false; b.click(); } else if (document.forms[0]) document.forms[0].submit();
  };

  // Hidden flag question rendered on the same page (e.g. text/long "LinkClicked"):
  // hides its block and returns its input so JS can store a value the server keeps.
  D.flag = function (q) {
    var f = D.inputs(q, 'text')[0];
    if (f) D.show(D.boxes(q), false);
    return f || null;
  };

  // Value piped into a label as <span id="...">{#Q}</span> (or a same-page field).
  D.piped = function (spanId, q) {
    var f = q ? D.inputs(q, 'text')[0] : null;
    if (f) return D.num(f.value);
    var s = document.getElementById(spanId);
    return s ? D.num(s.textContent) : NaN;
  };

  w.DimJS = D;
})(window);
