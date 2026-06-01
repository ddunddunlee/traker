// shared/utils.js — 공통 유틸리티

// ── XSS 방지 ──
export function esc(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// ── Toast ──
export function toast(msg, duration = 2200) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);background:#1a1a1a;color:#fff;padding:10px 20px;border-radius:999px;font-size:13px;opacity:0;transition:opacity .25s,transform .25s;z-index:9999;pointer-events:none;white-space:nowrap';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  el.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(20px)';
  }, duration);
}

// ── 날짜 포맷 ──
export function fmtDate(d) {
  if (!d) return '';
  const dt = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(dt)) return '';
  return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,'0')}.${String(dt.getDate()).padStart(2,'0')}`;
}

export function fmtShort(d) {
  if (!d) return '';
  const s = typeof d === 'string' ? d : fmtDate(d);
  return s.slice(5).replace('-','/');
}

export function timeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = Math.floor((Date.now() - new Date(isoStr)) / 60000);
  if (diff < 1)    return '방금';
  if (diff < 60)   return `${diff}분`;
  if (diff < 1440) return `${Math.floor(diff/60)}시간`;
  return `${Math.floor(diff/1440)}일전`;
}

export function daysElapsed(startDate) {
  if (!startDate) return 0;
  return Math.floor((Date.now() - new Date(startDate)) / 86400000);
}

export function getWeekKey(date = new Date()) {
  const d = new Date(date); d.setHours(0,0,0,0);
  const day = d.getDay();
  const mon = new Date(d); mon.setDate(d.getDate() - (day===0?6:day-1));
  return mon.toISOString().slice(0,10);
}

// ── 세션 ──
export function getMe() {
  try { return JSON.parse(localStorage.getItem('tt_user') || '{}'); }
  catch { return {}; }
}

export function requireAuth(redirectTo = 'index.html') {
  const me = getMe();
  if (!me?.id) { location.href = redirectTo; throw new Error('Unauthorized'); }
  return me;
}
