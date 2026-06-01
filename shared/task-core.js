// shared/task-core.js — 업무 관련 공통 로직

// ── 중요도 ──
export function priorityColor(p) {
  return ['','#c0c0bc','#378ADD','#EF9F27','#E24B4A','#A32D2D'][p||3] || '#c0c0bc';
}
export function priorityCls(p) {
  const n = Math.min(5, Math.max(1, Number(p||3)));
  return 'priority-badge p' + n;
}
export function priorityLabel(p) {
  return ['','매우 낮음','낮음','보통','긴급','매우 긴급'][p||3] || '보통';
}

// ── 상태 배지 ──
export function statusBadge(status) {
  const map = {
    todo:       { cls:'badge-todo',       label:'대기' },
    inprogress: { cls:'badge-inprogress', label:'진행 중' },
    done:       { cls:'badge-done',       label:'완료' },
  };
  return map[status] || map.todo;
}

// ── 칸반 컬럼 분류 ──
export function getKbStatus(t) {
  if (t.status === 'done') return 'done';
  if (t.due && new Date(t.due) < new Date() && t.status !== 'done') return 'overdue';
  return t.status || 'todo';
}

// ── 기한 판단 ──
export function isOverdue(t) {
  if (t.status === 'done') return false;
  return !!(t.due && new Date(t.due) < new Date());
}
export function isImminent(t) {
  if (t.status !== 'inprogress') return false;
  const due = t.due || t.startDate;
  if (!due) return false;
  const diff = (new Date(due) - new Date()) / 86400000;
  return diff >= 0 && diff <= 7;
}
export function isStale(t) {
  if (t.status === 'done') return false;
  const ref = t.updated || t.createdAt;
  if (!ref) return false;
  return (Date.now() - new Date(ref)) / 86400000 > 14;
}

// ── 공통업무 중복 제거 ──
export function dedupShared(tasks) {
  const repMap = new Map();
  tasks.forEach(t => {
    const sid = t.sharedTaskId || (t.isShared ? t._id : null);
    if (!sid) return;
    if (!repMap.has(sid)) {
      repMap.set(sid, t);
    } else {
      const rep = repMap.get(sid);
      const mems = [...new Set([...(rep.members||[rep._mid||rep.assignee||'']), t._mid||t.assignee||''].filter(Boolean))];
      rep.members = mems;
      repMap.get(sid).members = mems;
    }
  });
  const seen = new Set();
  return tasks.filter(t => {
    const sid = t.sharedTaskId || (t.isShared ? t._id : null);
    if (!sid) return true;
    const rep = repMap.get(sid);
    if (rep !== t) return false;
    if (seen.has(sid)) return false;
    seen.add(sid); return true;
  });
}

