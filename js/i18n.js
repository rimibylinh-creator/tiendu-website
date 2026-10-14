/* Đa ngôn ngữ (Việt / English) — tiendu
 * Từ điển: /i18n/en.json  →  { "câu tiếng Việt nguyên văn": "English" }
 * Có thể chứa tham số {0} {1}…, ví dụ "Hiển thị {0} / {1} sản phẩm": "Showing {0} of {1} products".
 * Chữ nào không có trong từ điển sẽ giữ nguyên tiếng Việt (nội dung từ admin như tên sản phẩm, bài viết).
 * Thêm ?i18n-debug=1 vào URL, rồi gõ TienduI18n.missing() trong Console để xem các câu chưa dịch.
 */
(function () {
  var KEY = 'tiendu-lang';
  var lang = 'vi';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'vi') localStorage.setItem(KEY, q);
    lang = localStorage.getItem(KEY) || 'vi';
  } catch (e) {}
  if (lang !== 'en') lang = 'vi';

  var api = window.TienduI18n = { lang: lang, missing: function () { return []; } };
  if (lang !== 'en') return;

  // Ẩn trang tới khi dịch xong lần đầu để không nháy tiếng Việt
  var hide = document.createElement('style');
  hide.textContent = 'html.i18n-pending body{visibility:hidden}';
  document.head.appendChild(hide);
  document.documentElement.classList.add('i18n-pending');
  document.documentElement.lang = 'en';
  var reveal = function () { document.documentElement.classList.remove('i18n-pending'); };
  var failsafe = setTimeout(reveal, 2500);

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, TEXTAREA: 1 };
  var ATTRS = ['placeholder', 'alt', 'title', 'aria-label'];
  var META = { description: 1, 'og:title': 1, 'og:description': 1, 'twitter:title': 1, 'twitter:description': 1 };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var VI = /[À-ỹà-ỹ]/;
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
      if (d && MONTHS[+d[2] - 1]) out = MONTHS[+d[2] - 1] + ' ' + d[1] + ', ' + d[3];
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
    fetch('/i18n/en.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(start)
      .catch(function () { clearTimeout(failsafe); reveal(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
