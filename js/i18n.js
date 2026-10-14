/* Đa ngôn ngữ (tiếng Việt gốc + English, Русский…) — tiendu
 * Từ điển mỗi ngôn ngữ nằm trong thư mục /i18n/<mã ngôn ngữ>/ gồm các file:
 *   ui.json, policies.json, products.json, posts.json, jobs.json
 * Mỗi file:  { "câu tiếng Việt nguyên văn": "bản dịch" }
 * Có thể chứa tham số {0} {1}…, ví dụ "Hiển thị {0} / {1} sản phẩm": "Showing {0} of {1} products".
 * Khoá đặc biệt (trong ui.json): "_months" (12 tên tháng) và "_date_format" (vd "{m} {d}, {y}").
 * Chữ nào không có trong từ điển sẽ giữ nguyên tiếng Việt.
 * Thêm ?i18n-debug=1 vào URL, rồi gõ TienduI18n.missing() trong Console để xem các câu chưa dịch.
 * Thêm ngôn ngữ mới: xem i18n/README.md.
 */
(function () {
  var KEY = 'tiendu-lang';
  var LANGS = ['en', 'ru'];                     // mã các ngôn ngữ đã có thư mục /i18n/<mã>/
  var FILES = ['ui', 'policies', 'products', 'posts', 'jobs'];
  var lang = 'vi';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'vi' || LANGS.indexOf(q) >= 0) localStorage.setItem(KEY, q);
    lang = localStorage.getItem(KEY) || 'vi';
  } catch (e) {}
  if (LANGS.indexOf(lang) < 0) lang = 'vi';

  var api = window.TienduI18n = { lang: lang, missing: function () { return []; } };
  if (lang === 'vi') return;

  // Ẩn trang tới khi dịch xong lần đầu để không nháy tiếng Việt
  var hide = document.createElement('style');
  hide.textContent = 'html.i18n-pending body{visibility:hidden}';
  document.head.appendChild(hide);
  document.documentElement.classList.add('i18n-pending');
  document.documentElement.lang = lang;
  var reveal = function () { document.documentElement.classList.remove('i18n-pending'); };
  var failsafe = setTimeout(reveal, 2500);

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, TEXTAREA: 1 };
  var ATTRS = ['placeholder', 'alt', 'title', 'aria-label'];
  var META = { description: 1, 'og:title': 1, 'og:description': 1, 'twitter:title': 1, 'twitter:description': 1 };
  var MONTHS = null;
  var DATE_FORMAT = '{m} {d}, {y}';
  var VI = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;   // chữ có dấu tiếng Việt (để báo câu chưa dịch)
  var exact = Object.create(null);
  var patterns = [];
  var missing = {};
  var debug = /[?&]i18n-debug=1/.test(location.search);

  var norm = function (s) { return s.replace(/\s+/g, ' ').trim(); };

  function translateString(raw) {
    var n = norm(raw);
    if (!n) return null;
    var out = exact[n];
    if (out === undefined) {
      for (var i = 0; i < patterns.length; i++) {
        var m = patterns[i].re.exec(n);
        if (m) {
          out = patterns[i].to.replace(/\{(\d+)\}/g, function (_, k) { return m[+k + 1] !== undefined ? m[+k + 1] : ''; });
          break;
        }
      }
    }
    if (out === undefined) {
      var d = /^(\d{1,2}) tháng (\d{1,2}), (\d{4})$/.exec(n);   // ngày dạng "1 tháng 10, 2026"
      if (d && MONTHS && MONTHS[+d[2] - 1]) {
        out = DATE_FORMAT.replace('{d}', d[1]).replace('{m}', MONTHS[+d[2] - 1]).replace('{y}', d[3]);
      }
    }
    if (out === undefined) {
      if (debug && VI.test(n)) missing[n] = 1;
      return null;
    }
    var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    return lead + out + trail;
  }

  function skipEl(el) {
    for (var p = el; p && p.nodeType === 1; p = p.parentNode) {
      if (SKIP[p.tagName] || p.hasAttribute('data-no-i18n') || p.classList.contains('notranslate')) return true;
    }
    return false;
  }

  function doText(node) {
    var p = node.parentNode;
    if (!p || skipEl(p)) return;
    var t = translateString(node.nodeValue);
    if (t !== null && t !== node.nodeValue) node.nodeValue = t;
  }

  function doAttrs(el) {
    if (el.nodeType !== 1 || skipEl(el)) return;
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a);
      if (v) { var t = translateString(v); if (t !== null && t !== v) el.setAttribute(a, t); }
    });
    if (el.tagName === 'META') {
      var k = el.getAttribute('name') || el.getAttribute('property');
      var c = el.getAttribute('content');
      if (META[k] && c) { var t2 = translateString(c); if (t2 !== null && t2 !== c) el.setAttribute('content', t2); }
    }
  }

  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) doText(n); else doAttrs(n);
    }
  }

  function start(dict) {
    if (Array.isArray(dict._months) && dict._months.length === 12) MONTHS = dict._months;
    if (typeof dict._date_format === 'string') DATE_FORMAT = dict._date_format;
    Object.keys(dict).forEach(function (k) {
      if (k.charAt(0) === '_' || typeof dict[k] !== 'string' || !dict[k]) return;   // bỏ khoá ghi chú / chưa dịch
      var nk = norm(k);
      if (/\{\d+\}/.test(nk)) {
        var src = nk.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{(\d+)\\?\}/g, '(.+?)');
        patterns.push({ re: new RegExp('^' + src + '$'), to: dict[k] });
      } else {
        exact[nk] = dict[k];
      }
    });
    api.missing = function () { return Object.keys(missing); };
    walk(document.documentElement);
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === 'characterData') doText(m.target);
        else if (m.type === 'attributes') doAttrs(m.target);
        else m.addedNodes.forEach(walk);
      });
    }).observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS.concat(['content'])
    });
    clearTimeout(failsafe);
    reveal();
  }

  function boot() {
    // Tải song song các file của ngôn ngữ; file nào lỗi/thiếu thì bỏ qua
    Promise.all(FILES.map(function (f) {
      return fetch('/i18n/' + lang + '/' + f + '.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : {}; })
        .catch(function () { return {}; });
    }))
      .then(function (list) { return Object.assign.apply(null, [{}].concat(list)); })
      .then(start)
      .catch(function () { clearTimeout(failsafe); reveal(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
