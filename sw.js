// GZ Plan Service Worker
const CACHE_NAME = 'gzplan-v1';

// 캐싱할 정적 파일 목록
const STATIC_FILES = [
  '/traker/',
  '/traker/index.html',
  '/traker/dashboard.html',
  '/traker/member.html',
  '/traker/manager.html',
  '/traker/admin.html',
  '/traker/calendar.html',
  '/traker/weekly.html',
  '/traker/memo.html',
  '/traker/report.html',
  '/traker/report_all.html',
  '/traker/shared/sidebar.js',
  '/traker/manifest.json',
];

// 설치 - 정적 파일 캐싱
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_FILES).catch(err => {
        console.warn('[SW] 일부 파일 캐싱 실패:', err);
      });
    })
  );
  self.skipWaiting();
});

// 활성화 - 이전 캐시 삭제
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 요청 처리 - Network First (Firebase 실시간 연동 유지)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Firebase, gstatic 등 외부 요청은 캐시 안 함
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('gstatic') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('firebaseapp') ||
    event.request.method !== 'GET'
  ) {
    return; // 기본 fetch 동작
  }

  // GZplan 정적 파일: Cache First
  if (url.pathname.startsWith('/traker/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached); // 오프라인 시 캐시 반환

        return cached || networkFetch;
      })
    );
  }
});
