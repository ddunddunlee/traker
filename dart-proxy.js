/* ═══════════════════════════════════════════════════════════════════════
   GZ Plan — DART 프록시 (Cloudflare Worker)
   ───────────────────────────────────────────────────────────────────────
   역할:
     - DART OpenAPI 키를 Worker Secret(DART_API_KEY)에 숨겨 보관
     - 브라우저 CORS 우회 (ddunddunlee.github.io 만 허용)
     - 회사명 → corp_code 매핑(하드코딩) → 재무제표·감사의견·공시목록 조회
     - LLM 호출 없음. 순수 DART 데이터만 중계. (추가 비용 0)

   배포:
     1. Cloudflare → Workers & Pages → Create → 이름: gz-dart
     2. 이 파일 내용을 통째로 붙여넣기 → Deploy
     3. Settings → Variables and Secrets → Secret 추가:
          이름  DART_API_KEY
          값    (DART 포털에서 재발급받은 새 키)
     4. 배포 URL을 dart.html 의 WORKER_URL 에 입력

   엔드포인트:
     GET ?company=크리에이츠&year=2025
     GET ?list=1                      (조회 가능한 회사 목록 반환)
   ═══════════════════════════════════════════════════════════════════════ */

/* ── 분석 대상 회사 corp_code (하드코딩) ──────────────────────────────────
   추가하려면: DART 포털(opendart.fss.or.kr) → 공시정보 → 고유번호 다운로드
   또는 dart.fss.or.kr 에서 회사 검색 후 8자리 고유번호 확인.
   key 는 검색에 쓸 회사명(별칭 가능), value.corp_code 는 DART 8자리 고유번호. */
const COMPANIES = {
  "크리에이츠":     { corp_code: "01133217", name: "크리에이츠",       listed: false },
  "골프존":         { corp_code: "01180242", name: "골프존",           listed: true  },
  "골프존뉴딘홀딩스": { corp_code: "00499226", name: "골프존뉴딘홀딩스", listed: true  },
  "카카오vx":       { corp_code: "01345812", name: "카카오VX",         listed: false },
  // ↑ corp_code 는 예시값입니다. 배포 전 반드시 실제 고유번호로 교체하세요.
  // 새 경쟁사 추가는 여기에 한 줄씩.
};

const ALLOWED_ORIGINS = [
  "https://ddunddunlee.github.io",
  "http://localhost",       // 로컬 테스트용
  "http://127.0.0.1",
];

const DART = "https://opendart.fss.or.kr/api";

function corsHeaders(origin) {
  const ok = ALLOWED_ORIGINS.some(o => origin && origin.startsWith(o));
  return {
    "Access-Control-Allow-Origin": ok ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };
}

function json(obj, origin, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: corsHeaders(origin) });
}

/* 회사명 정규화: 공백·대소문자·(주) 제거 후 매칭 */
function normalize(s) {
  return (s || "").toLowerCase().replace(/\s|\(주\)|주식회사/g, "");
}
function findCompany(query) {
  const q = normalize(query);
  for (const [k, v] of Object.entries(COMPANIES)) {
    if (normalize(k) === q || normalize(v.name) === q) return v;
  }
  // 부분 일치 폴백
  for (const [k, v] of Object.entries(COMPANIES)) {
    if (normalize(k).includes(q) || q.includes(normalize(k))) return v;
  }
  return null;
}

async function dartGet(path, params, key) {
  const url = new URL(`${DART}/${path}`);
  url.searchParams.set("crtfc_key", key);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString());
  return r.json();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const key = env.DART_API_KEY;
    if (!key) return json({ error: "DART_API_KEY 미설정" }, origin, 500);

    const url = new URL(request.url);

    // 회사 목록 반환
    if (url.searchParams.get("list")) {
      return json({
        companies: Object.entries(COMPANIES).map(([k, v]) => ({ alias: k, name: v.name, listed: v.listed }))
      }, origin);
    }

    const company = url.searchParams.get("company");
    const year    = url.searchParams.get("year") || String(new Date().getFullYear() - 1);
    if (!company) return json({ error: "company 파라미터 필요" }, origin, 400);

    const co = findCompany(company);
    if (!co) {
      return json({
        error: `'${company}' 은(는) 등록되지 않은 회사입니다.`,
        hint: "Worker 의 COMPANIES 에 corp_code 를 추가하세요.",
        available: Object.keys(COMPANIES),
      }, origin, 404);
    }

    const base = { corp_code: co.corp_code, bsns_year: year, reprt_code: "11011" };

    try {
      // 1) 재무제표 — 연결(CFS) 우선, 없으면 별도(OFS)
      let fin = await dartGet("fnlttSinglAcntAll.json", { ...base, fs_div: "CFS" }, key);
      let fsBasis = "연결";
      if (fin.status !== "000") {
        fin = await dartGet("fnlttSinglAcntAll.json", { ...base, fs_div: "OFS" }, key);
        fsBasis = "별도";
      }

      // 2) 감사의견·감사인
      const audit = await dartGet("accnutAdtorNmNdAdtOpinion.json", base, key)
        .catch(() => ({ status: "x" }));

      // 3) 최근 공시 목록 (해당 연도)
      const filings = await dartGet("list.json", {
        corp_code: co.corp_code,
        bgn_de: `${year}0101`,
        end_de: `${year}1231`,
        page_count: "30",
      }, key).catch(() => ({ status: "x" }));

      if (fin.status !== "000") {
        return json({
          error: `재무제표 없음 (status ${fin.status}: ${fin.message || ""})`,
          company: co.name, year,
        }, origin, 404);
      }

      return json({
        company: co.name,
        corp_code: co.corp_code,
        year,
        fsBasis,
        finance: fin.list || [],
        audit: audit.status === "000" ? (audit.list || []) : [],
        filings: filings.status === "000" ? (filings.list || []) : [],
      }, origin);

    } catch (e) {
      return json({ error: "조회 실패: " + e.message }, origin, 500);
    }
  }
};
