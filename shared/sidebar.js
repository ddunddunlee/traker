/* ═══════════════════════════════════════════════════════════════
   GZ Plan — 공통 사이드바 모듈
   ---------------------------------------------------------------
   사용법:
     1. HTML body 최상단에 플레이스홀더 추가:
        <div id="gz-sidebar" data-active="member.html"></div>

     2. </body> 직전에 script 로드:
        <script src="./shared/sidebar.js"></script>

   admin 전용 (메뉴 구성 다름):
     <div id="gz-sidebar" data-active="admin.html" data-variant="admin"></div>
   ═══════════════════════════════════════════════════════════════ */

(function () {

  /* ── 메뉴 정의 ─────────────────────────────────────────────── */
  var MENUS = {

    /* 일반/팀장 공통 메뉴 */
    default: {
      sections: [
        {
          label: '메뉴',
          items: [
            {
              nav: 'dashboard.html', label: '홈',
              icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>'
            },
            {
              nav: 'member.html', label: '업무 트래커',
              icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/>',
              badge: 'urgentBadge'   /* 긴급 배지 ID */
            },
            {
              nav: 'report.html', label: '주간보고',
              icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'
            },
            {
              nav: 'report_all.html', label: '주간보고(전체)',
              icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
            }
          ]
        },
        {
          label: '도구',
          items: [
            {
              nav: 'calendar.html', label: '캘린더',
              icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'
            },
            {
              nav: 'weekly.html', label: '주간 스케줄',
              icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>'
            },
            {
              nav: 'memo.html', label: '메모장',
              icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'
            }
          ]
        }
      ]
    },

    /* 관리자 전용 메뉴 */
    admin: {
      sections: [
        {
          label: '관리',
          items: [
            {
              nav: 'dashboard.html', label: '홈',
              icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>'
            },
            {
              nav: 'admin.html', label: '관리자',
              icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
            }
          ]
        }
      ]
    }
  };

  /* ── 사이드바 CSS ───────────────────────────────────────────── */
  var CSS = [
    ':root{--sw:220px;--sw-col:56px;--sb-ease:.22s cubic-bezier(.4,0,.2,1)}',
    '.sidebar{',
    '  width:var(--sw,220px);flex-shrink:0;',
    '  background:#0C447C;color:#fff;',
    '  display:flex;flex-direction:column;',
    '  position:fixed;top:0;left:0;height:100vh;z-index:300;',
    '  transition:width var(--sb-ease,.22s cubic-bezier(.4,0,.2,1));overflow:hidden;',
    '}',
    '.sb-brand{display:flex;align-items:center;gap:10px;padding:18px 16px 14px;border-bottom:1px solid rgba(255,255,255,.15);flex-shrink:0}',
    '.sb-mark{width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0}',
    '.sb-brand-texts{flex:1;min-width:0}',
    '.sb-brand-name{font-size:14px;font-weight:700;color:#fff;letter-spacing:-.2px}',
    '.sb-brand-sub{font-size:11px;color:rgba(255,255,255,.5);margin-top:1px}',
    '.sb-toggle-btn{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;background:rgba(255,255,255,.1);transition:background .15s}',
    '.sb-toggle-btn:hover{background:rgba(255,255,255,.2)}',
    '.sb-toggle-btn svg{transition:transform var(--sb-ease,.22s cubic-bezier(.4,0,.2,1))}',
    '.sb-user{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.15);flex-shrink:0}',
    '.sb-avatar{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}',
    '.sb-user-info{flex:1;min-width:0}',
    '.sb-user-name{font-size:13px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.sb-user-role{font-size:11px;color:rgba(255,255,255,.5);margin-top:1px}',
    '.sb-nav{flex:1;overflow-y:auto;padding:8px 0}',
    '.sb-sec{font-size:10px;font-weight:700;letter-spacing:.06em;color:rgba(255,255,255,.4);padding:10px 16px 4px;text-transform:uppercase}',
    '.sb-item{display:flex;align-items:center;gap:10px;padding:9px 16px;cursor:pointer;margin:1px 8px;border-radius:6px;color:rgba(255,255,255,.7);font-size:13px;transition:background .12s,color .12s;white-space:nowrap;overflow:hidden}',
    '.sb-item:hover{background:rgba(255,255,255,.1);color:#fff}',
    '.sb-item.active{background:rgba(255,255,255,.15);color:#fff;font-weight:500}',
    '.sb-icon{width:20px;flex-shrink:0;display:flex;align-items:center;justify-content:center}',
    '.sb-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}',
    '.sb-badge{font-size:10px;font-weight:700;background:#EF4444;color:#fff;border-radius:999px;min-width:16px;height:16px;display:flex;align-items:center;justify-content:center;padding:0 4px}',
    '.sb-bottom{padding:8px;border-top:1px solid rgba(255,255,255,.1);flex-shrink:0}',
    '.sb-logout{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:6px;cursor:pointer;color:rgba(255,255,255,.5);font-size:13px;transition:background .12s,color .12s}',
    '.sb-logout:hover{background:rgba(255,255,255,.08);color:#fff}',
    '.sb-logout-lbl{white-space:nowrap;overflow:hidden}',
    /* collapsed */
    '.sidebar.collapsed{width:var(--sw-col,56px)}',
    '.sidebar.collapsed~.main-wrap{margin-left:var(--sw-col,56px) !important}',
    '.sidebar.collapsed .sb-brand-texts,.sidebar.collapsed .sb-user-info,.sidebar.collapsed .sb-sec,.sidebar.collapsed .sb-label,.sidebar.collapsed .sb-logout-lbl,.sidebar.collapsed .sb-mark{display:none}',
    '.sidebar.collapsed .sb-brand{justify-content:center;padding:10px 0}',
    '.sidebar.collapsed .sb-mark{display:none}',
    '.sidebar.collapsed .sb-toggle-btn svg{transform:rotate(180deg)}',
    '.sidebar.collapsed .sb-user{justify-content:center;padding:10px 0}',
    '.sidebar.collapsed .sb-item{justify-content:center;padding:10px 0;margin:1px 4px}',
    '.sidebar.collapsed .sb-badge{display:none !important}',
    '.sidebar.collapsed .sb-logout{justify-content:center;padding:10px 0}',
  ].join('\n');

  /* ── SVG 아이콘 헬퍼 ────────────────────────────────────────── */
  function icon(paths) {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
      + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }

  /* ── 사이드바 HTML 조립 ─────────────────────────────────────── */
  function buildHTML(activeNav, variant) {
    var menu = MENUS[variant] || MENUS.default;
    var nav  = '';

    menu.sections.forEach(function (sec) {
      nav += '<div class="sb-sec">' + sec.label + '</div>';
      sec.items.forEach(function (item) {
        var badge = item.badge
          ? '<div class="sb-badge" id="' + item.badge + '" style="display:none"></div>'
          : '';
        nav += '<div class="sb-item' + (item.nav === activeNav ? ' active' : '') + '" '
          + 'data-nav="' + item.nav + '" data-label="' + item.label + '">'
          + '<div class="sb-icon">' + icon(item.icon) + '</div>'
          + '<div class="sb-label">' + item.label + '</div>'
          + badge
          + '</div>';
      });
    });

    return '<div class="sidebar" id="sidebar">'
      + '<div class="sb-brand">'
      + '<div class="sb-mark">GZ</div>'
      + '<div class="sb-brand-texts">'
      + '<div class="sb-brand-name">GZ Plan</div>'
      + '<div class="sb-brand-sub">경영기획팀</div>'
      + '</div>'
      + '<div class="sb-toggle-btn" id="sbToggleBtn">' + icon('<path d="M10 3L5 8l5 5"/>') + '</div>'
      + '</div>'
      + '<div class="sb-user">'
      + '<div class="sb-avatar" id="sbAvatar">—</div>'
      + '<div class="sb-user-info">'
      + '<div class="sb-user-name" id="sbUserName"></div>'
      + '<div class="sb-user-role" id="sbUserRole">팀원</div>'
      + '</div>'
      + '</div>'
      + '<nav class="sb-nav" id="sbNav">' + nav + '</nav>'
      + '<div class="sb-bottom">'
      + '<div class="sb-logout" id="logoutBtn">'
      + '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
      + '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>'
      + '<polyline points="16,17 21,12 16,7"/>'
      + '<line x1="21" y1="12" x2="9" y2="12"/>'
      + '</svg>'
      + '<span class="sb-logout-lbl">로그아웃</span>'
      + '</div>'
      + '</div>'
      + '</div>';
  }

  /* ── 이벤트 바인딩 ──────────────────────────────────────────── */
  function bindEvents() {
    /* 토글 */
    var sb  = document.getElementById('sidebar');
    var btn = document.getElementById('sbToggleBtn');
    if (sb && btn) {
      if (localStorage.getItem('gz_sb_collapsed') === '1') sb.classList.add('collapsed');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        sb.classList.toggle('collapsed');
        localStorage.setItem('gz_sb_collapsed', sb.classList.contains('collapsed') ? '1' : '0');
      });
    }

    /* 메뉴 클릭 → 페이지 이동 */
    document.querySelectorAll('#sidebar .sb-item[data-nav]').forEach(function (el) {
      el.addEventListener('click', function () { location.href = el.dataset.nav; });
    });

    /* 로그아웃 */
    var lo = document.getElementById('logoutBtn');
    if (lo) lo.addEventListener('click', function () {
      localStorage.removeItem('tt_user');
      sessionStorage.clear();
      location.href = 'index.html';
    });

    /* 유저 정보 표시 */
    try {
      var u  = JSON.parse(localStorage.getItem('tt_user') || '{}');
      var av = document.getElementById('sbAvatar');
      var nm = document.getElementById('sbUserName');
      var rl = document.getElementById('sbUserRole');
      if (av && u.displayName) av.textContent = u.displayName.slice(0, 1);
      if (nm && u.displayName) nm.textContent = u.displayName;
      if (rl && u.role) rl.textContent = u.role === 'manager' ? '팀장' : u.role === 'admin' ? '관리자' : '팀원';
    } catch (e) { console.error('[GZPlan sidebar]', e); }
  }

  /* ── 진입점 ─────────────────────────────────────────────────── */
  function init() {
    var placeholder = document.getElementById('gz-sidebar');
    if (!placeholder) return;

    var activeNav = placeholder.getAttribute('data-active') || '';
    var variant   = placeholder.getAttribute('data-variant') || 'default';

    /* CSS 주입 (중복 방지) */
    if (!document.getElementById('gz-sidebar-css')) {
      var styleEl = document.createElement('style');
      styleEl.id  = 'gz-sidebar-css';
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
    }

    /* 플레이스홀더를 사이드바 HTML로 교체 */
    var tmp = document.createElement('div');
    tmp.innerHTML = buildHTML(activeNav, variant);
    placeholder.parentNode.replaceChild(tmp.firstChild, placeholder);

    /* 이벤트 바인딩 */
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
