// ─── 브랜드 토큰 ──────────────────────────────────────────────────────────────
export const LG_RED  = '#CF0652'
export const LG_DARK = '#A0003E'
export const FONT    = "'LG Smart','Arial Narrow',Arial,sans-serif"

// ─── 디자인 가이드 공통 상수 ─────────────────────────────────────────────────
export const SECTION_BAR = { width: 4, height: 22, borderRadius: 4, background: LG_RED, flexShrink: 0 }

// 신호등 (라이트 테마)
export function statusOf(rate) {
  if (rate === null) return { text: '#94A3B8', bg: '#F8FAFC', border: '#E2E8F0', bar: '#CBD5E1', dot: '#CBD5E1', label: 'none' }
  if (rate >= 100) return { text: '#15803D', bg: '#ECFDF5', border: '#A7F3D0', bar: '#15803D', dot: '#15803D', label: 'achieved' }
  if (rate >= 80)  return { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A', bar: '#D97706', dot: '#D97706', label: 'inProgress' }
  return { text: '#BE123C', bg: '#FFF1F2', border: '#FECDD3', bar: '#BE123C', dot: '#BE123C', label: 'notAchieved' }
}

// 신호등 (다크 테마)
export function statusOfDark(rate) {
  if (rate >= 100) return { text: '#15803D', bg: '#132E20', border: '#15803D55', bar: '#22C55E', dot: '#22C55E', label: 'achieved' }
  if (rate >= 80)  return { text: '#D97706', bg: '#2A2210', border: '#D9770655', bar: '#FBBF24', dot: '#FBBF24', label: 'inProgress' }
  return { text: '#BE123C', bg: '#2A1018', border: '#BE123C55', bar: '#FB7185', dot: '#FB7185', label: 'notAchieved' }
}

// ─── 초기 메타 데이터 ──────────────────────────────────────────────────────────
export const INIT_META  = {
  period: 'Feb 2026', team: 'D2C디지털마케팅팀', reportNo: 'Vol.03',
  reportType: 'GEO 월간 성과 분석 리포트',
  title: '생성형 AI 엔진 가시성(Visibility) 성과 분석',
  titleFontSize: 24, titleColor: '#1A1A1A',
  dateLine: 'As of Feb 2026',
  totalInsight: '권위 있는 인용 출처와 통계 데이터를 활용한 Citation Optimization 전략은 생성형 AI 검색 엔진에서의 가시성을 최대 30~40% 향상시킬 수 있습니다. 청소기·식기세척기 카테고리의 구조화 데이터 강화가 시급히 필요합니다.',
  productInsight: '', showProductInsight: false,
  productHowToRead: '', showProductHowToRead: false,
  citationInsight: '', showCitationInsight: false,
  citationHowToRead: '', showCitationHowToRead: false,
  dotcomInsight: '', showDotcomInsight: false,
  dotcomHowToRead: '', showDotcomHowToRead: false,
  cntyInsight: '', showCntyInsight: false,
  cntyHowToRead: '', showCntyHowToRead: false,
  kpiLogicText: '', showKpiLogic: false,
  citDomainInsight: '', showCitDomainInsight: false,
  citDomainHowToRead: '', showCitDomainHowToRead: false,
  citCntyInsight: '', showCitCntyInsight: false,
  citCntyHowToRead: '', showCitCntyHowToRead: false,
  noticeText: '', showNotice: false,
  todoText: '', showTodo: false,
  showTotal: true, showProducts: true, showCnty: true, showCitations: true,
  showCitDomain: true, showCitCnty: true,
  citationTopN: 10, citDomainTopN: 10,
  showDotcom: true,
  cntyProductFilter: {},
  citCntyDomainFilter: {},
  citCntyFilter: {},
  aiPromptRules: `- 제공된 데이터에 있는 수치만 사용할 것 (추가 계산·추정 금지)
- 리포트에 표시된 제품명, 점수, 경쟁사명을 그대로 인용
- 존재하지 않는 수치를 만들어내지 말 것
- 전문적이지만 간결하게 3~5문장
- 비즈니스 보고서 톤 (한국어 작성 시)`,
}

export const INIT_TOTAL = { score: 42.7, prev: 42.2, vsComp: 42.2, rank: 1, totalBrands: 12 }

export const BU_CONFIG = {
  MS: { label: 'MS', color: '#94A3B8', bg: 'rgba(148,163,184,0.07)', border: 'rgba(148,163,184,0.18)' },
  HS: { label: 'HS', color: '#8B9CB0', bg: 'rgba(139,156,176,0.07)', border: 'rgba(139,156,176,0.18)' },
  ES: { label: 'ES', color: '#9AAFC0', bg: 'rgba(154,175,192,0.07)', border: 'rgba(154,175,192,0.18)' },
}

export const INIT_PRODUCTS = [
  { id: 'tv',      kr: 'TV',         bu: 'MS', score: 45.5, prev: 45.2, vsComp: 41.2, compName: '삼성전자', compRatio: 110, status: 'lead',     weekly: [44.2,45.2,44.9,45.5] },
  { id: 'monitor', kr: '모니터',     bu: 'MS', score: 59.0, prev: 56.9, vsComp: 49.0, compName: '삼성전자', compRatio: 120, status: 'lead',     weekly: [55.2,56.9,57.4,59.0] },
  { id: 'audio',   kr: '오디오',     bu: 'MS', score: 38.2, prev: 36.5, vsComp: 36.1, compName: '소니',    compRatio: 106, status: 'lead',     weekly: [35.1,36.5,37.0,38.2] },
  { id: 'fridge',  kr: '냉장고',     bu: 'HS', score: 50.2, prev: 48.7, vsComp: 48.7, compName: '삼성전자', compRatio: 103, status: 'lead',     weekly: [48.7,48.3,49.6,50.2] },
  { id: 'washer',  kr: '세탁기',     bu: 'HS', score: 44.1, prev: 42.8, vsComp: 40.9, compName: '삼성전자', compRatio: 108, status: 'lead',     weekly: [42.8,43.0,43.6,44.1] },
  { id: 'cooking', kr: 'Cooking',    bu: 'HS', score: 32.4, prev: 31.0, vsComp: 34.7, compName: '보쉬',    compRatio: 93,  status: 'behind',   weekly: [31.0,31.8,32.0,32.4] },
  { id: 'dw',      kr: '식기세척기', bu: 'HS', score: 26.9, prev: 29.2, vsComp: 35.4, compName: '보쉬',    compRatio: 76,  status: 'critical', weekly: [28.5,27.8,27.3,26.9] },
  { id: 'vacuum',  kr: '청소기',     bu: 'HS', score:  6.1, prev:  7.3, vsComp: 22.4, compName: '다이슨',  compRatio: 27,  status: 'critical', weekly: [7.0,6.8,6.4,6.1] },
  { id: 'rac',     kr: 'RAC',        bu: 'ES', score: 33.1, prev: 33.9, vsComp: 28.5, compName: '삼성전자', compRatio: 116, status: 'lead',     weekly: [33.9,34.1,33.5,33.1] },
  { id: 'aircare', kr: 'Aircare',    bu: 'ES', score: 28.5, prev: 26.0, vsComp: 23.3, compName: '다이슨',  compRatio: 122, status: 'lead',     weekly: [24.8,26.0,27.1,28.5] },
]

export const DOTCOM_LG_COLS  = ['TTL','PLP','Microsites','PDP','Newsroom','Support','Buying-guide','Experience']
export const DOTCOM_SAM_COLS = ['TTL','PLP','Microsites','PDP','Newsroom','Support','Buying-guide']

export const INIT_DOTCOM = {
  lg:      { TTL:222447, PLP:52378, Microsites:24075, PDP:46880, Newsroom:21131, Support:15666, 'Buying-guide':14471, Experience:47846 },
  samsung: { TTL:199180, PLP:34177, Microsites:14708, PDP:35709, Newsroom:43152, Support:39144, 'Buying-guide':32290 },
}

export const INIT_PRODUCTS_CNTY = [
  { product:'TV', country:'미국', score:87.1, compName:'삼성', compScore:87.2, gap:-5.5 },
  { product:'TV', country:'영국', score:87.2, compName:'삼성', compScore:86.3, gap:-1.7 },
  { product:'TV', country:'독일', score:85.3, compName:'삼성', compScore:84.2, gap:-1.5 },
  { product:'TV', country:'브라질', score:85.7, compName:'삼성', compScore:86.3, gap:-6.6 },
  { product:'TV', country:'인도', score:84.7, compName:'삼성', compScore:85.2, gap:-5.1 },
  { product:'TV', country:'멕시코', score:84.8, compName:'삼성', compScore:84.7, gap:0.7 },
  { product:'TV', country:'스페인', score:83.7, compName:'삼성', compScore:82.7, gap:-1.5 },
  { product:'TV', country:'호주', score:87.4, compName:'삼성', compScore:87.3, gap:1.4 },
  { product:'TV', country:'베트남', score:83.8, compName:'삼성', compScore:84.4, gap:-2.5 },
  { product:'TV', country:'캐나다', score:86.1, compName:'삼성', compScore:86.2, gap:-0.9 },
  { product:'세탁기', country:'미국', score:44.7, compName:'', compScore:0, gap:-0.6 },
  { product:'세탁기', country:'영국', score:36.8, compName:'', compScore:0, gap:3.5 },
  { product:'세탁기', country:'독일', score:19.0, compName:'', compScore:0, gap:-9.8 },
  { product:'세탁기', country:'브라질', score:37.7, compName:'', compScore:0, gap:3.1 },
  { product:'세탁기', country:'인도', score:50.0, compName:'', compScore:0, gap:0.8 },
  { product:'세탁기', country:'멕시코', score:43.4, compName:'', compScore:0, gap:-0.8 },
  { product:'세탁기', country:'스페인', score:35.5, compName:'', compScore:0, gap:1.4 },
  { product:'세탁기', country:'호주', score:49.3, compName:'', compScore:0, gap:0.6 },
  { product:'세탁기', country:'베트남', score:51.3, compName:'', compScore:0, gap:1.4 },
  { product:'세탁기', country:'캐나다', score:46.1, compName:'', compScore:0, gap:-0.4 },
  { product:'냉장고', country:'미국', score:43.6, compName:'', compScore:0, gap:3.3 },
  { product:'냉장고', country:'영국', score:42.6, compName:'', compScore:0, gap:2.5 },
  { product:'냉장고', country:'독일', score:35.8, compName:'', compScore:0, gap:-6.4 },
  { product:'냉장고', country:'브라질', score:33.3, compName:'', compScore:0, gap:-2.2 },
  { product:'냉장고', country:'인도', score:52.9, compName:'', compScore:0, gap:1.9 },
  { product:'냉장고', country:'멕시코', score:50.2, compName:'', compScore:0, gap:-2.3 },
  { product:'냉장고', country:'스페인', score:36.9, compName:'', compScore:0, gap:1.4 },
  { product:'냉장고', country:'호주', score:45.8, compName:'', compScore:0, gap:1.3 },
  { product:'냉장고', country:'베트남', score:48.8, compName:'', compScore:0, gap:2.2 },
  { product:'냉장고', country:'캐나다', score:39.2, compName:'', compScore:0, gap:1.6 },
]

export const INIT_CITATIONS_CNTY = [
  { cnty:'TTL', rank:1, domain:'reddit.com', type:'Community', citations:209008 },
  { cnty:'TTL', rank:2, domain:'youtube.com', type:'SNS', citations:143718 },
  { cnty:'TTL', rank:3, domain:'rtings.com', type:'Review', citations:74054 },
  { cnty:'TTL', rank:4, domain:'bestbuy.com', type:'Retail', citations:72185 },
  { cnty:'TTL', rank:5, domain:'consumerreports.org', type:'Review', citations:66544 },
  { cnty:'TTL', rank:6, domain:'lg.com', type:'Brand/Manufacturer', citations:52190 },
  { cnty:'TTL', rank:7, domain:'tomsguide.com', type:'Review', citations:43815 },
  { cnty:'TTL', rank:8, domain:'techradar.com', type:'Review', citations:40717 },
  { cnty:'TTL', rank:9, domain:'homedepot.com', type:'Retail', citations:37577 },
  { cnty:'TTL', rank:10, domain:'samsung.com', type:'Brand/Manufacturer', citations:37144 },
  { cnty:'US', rank:1, domain:'reddit.com', type:'Community', citations:209008 },
  { cnty:'US', rank:2, domain:'youtube.com', type:'SNS', citations:143718 },
  { cnty:'US', rank:3, domain:'rtings.com', type:'Review', citations:74054 },
  { cnty:'US', rank:4, domain:'bestbuy.com', type:'Retail', citations:72185 },
  { cnty:'US', rank:5, domain:'consumerreports.org', type:'Review', citations:66544 },
  { cnty:'US', rank:6, domain:'lg.com', type:'Brand/Manufacturer', citations:52190 },
  { cnty:'US', rank:7, domain:'tomsguide.com', type:'Review', citations:43815 },
  { cnty:'US', rank:8, domain:'techradar.com', type:'Review', citations:40717 },
  { cnty:'US', rank:9, domain:'homedepot.com', type:'Retail', citations:37577 },
  { cnty:'US', rank:10, domain:'samsung.com', type:'Brand/Manufacturer', citations:37144 },
  { cnty:'CA', rank:1, domain:'reddit.com', type:'Community', citations:59466 },
  { cnty:'CA', rank:2, domain:'youtube.com', type:'SNS', citations:40521 },
  { cnty:'CA', rank:3, domain:'rtings.com', type:'Review', citations:33188 },
  { cnty:'CA', rank:4, domain:'bestbuy.com', type:'Retail', citations:28422 },
  { cnty:'CA', rank:5, domain:'consumerreports.org', type:'Review', citations:22011 },
  { cnty:'CA', rank:6, domain:'lg.com', type:'Brand/Manufacturer', citations:18322 },
  { cnty:'CA', rank:7, domain:'samsung.com', type:'Brand/Manufacturer', citations:13894 },
  { cnty:'CA', rank:8, domain:'costco.ca', type:'Retail', citations:9788 },
  { cnty:'CA', rank:9, domain:'canadianappliance.ca', type:'Retail', citations:8843 },
  { cnty:'CA', rank:10, domain:'homedepot.ca', type:'Retail', citations:7321 },
  { cnty:'UK', rank:1, domain:'reddit.com', type:'Community', citations:54287 },
  { cnty:'UK', rank:2, domain:'youtube.com', type:'SNS', citations:36411 },
  { cnty:'UK', rank:3, domain:'which.co.uk', type:'Review', citations:39853 },
  { cnty:'UK', rank:4, domain:'lg.com', type:'Brand/Manufacturer', citations:22108 },
  { cnty:'UK', rank:5, domain:'samsung.com', type:'Brand/Manufacturer', citations:18900 },
  { cnty:'UK', rank:6, domain:'techradar.com', type:'Review', citations:16422 },
  { cnty:'UK', rank:7, domain:'johnlewis.com', type:'Retail', citations:15108 },
  { cnty:'UK', rank:8, domain:'currys.co.uk', type:'Retail', citations:14322 },
  { cnty:'UK', rank:9, domain:'argos.co.uk', type:'Retail', citations:12088 },
  { cnty:'UK', rank:10, domain:'rtings.com', type:'Review', citations:11004 },
  { cnty:'DE', rank:1, domain:'reddit.com', type:'Community', citations:42135 },
  { cnty:'DE', rank:2, domain:'youtube.com', type:'SNS', citations:30188 },
  { cnty:'DE', rank:3, domain:'samsung.com', type:'Brand/Manufacturer', citations:22005 },
  { cnty:'DE', rank:4, domain:'lg.com', type:'Brand/Manufacturer', citations:19422 },
  { cnty:'DE', rank:5, domain:'mediamarkt.de', type:'Retail', citations:17890 },
  { cnty:'DE', rank:6, domain:'saturn.de', type:'Retail', citations:14544 },
  { cnty:'DE', rank:7, domain:'testberichte.de', type:'Review', citations:12908 },
  { cnty:'DE', rank:8, domain:'chip.de', type:'Review', citations:11233 },
  { cnty:'DE', rank:9, domain:'idealo.de', type:'Comparison', citations:10422 },
  { cnty:'DE', rank:10, domain:'rtings.com', type:'Review', citations:9088 },
  { cnty:'BR', rank:1, domain:'youtube.com', type:'SNS', citations:48322 },
  { cnty:'BR', rank:2, domain:'reddit.com', type:'Community', citations:38901 },
  { cnty:'BR', rank:3, domain:'lg.com', type:'Brand/Manufacturer', citations:24005 },
  { cnty:'BR', rank:4, domain:'samsung.com', type:'Brand/Manufacturer', citations:21188 },
  { cnty:'BR', rank:5, domain:'magazineluiza.com.br', type:'Retail', citations:18443 },
  { cnty:'BR', rank:6, domain:'americanas.com.br', type:'Retail', citations:15322 },
  { cnty:'BR', rank:7, domain:'zoom.com.br', type:'Comparison', citations:12008 },
  { cnty:'BR', rank:8, domain:'tecnoblog.net', type:'Review', citations:10688 },
  { cnty:'BR', rank:9, domain:'buscape.com.br', type:'Comparison', citations:9443 },
  { cnty:'BR', rank:10, domain:'techtudo.com.br', type:'Review', citations:8211 },
  { cnty:'MX', rank:1, domain:'youtube.com', type:'SNS', citations:35188 },
  { cnty:'MX', rank:2, domain:'reddit.com', type:'Community', citations:28422 },
  { cnty:'MX', rank:3, domain:'lg.com', type:'Brand/Manufacturer', citations:20344 },
  { cnty:'MX', rank:4, domain:'samsung.com', type:'Brand/Manufacturer', citations:18068 },
  { cnty:'MX', rank:5, domain:'translate.google.com', type:'etc.', citations:9052 },
  { cnty:'MX', rank:6, domain:'pccomponentes.com', type:'Retail', citations:7868 },
  { cnty:'MX', rank:7, domain:'consumerreports.org', type:'Review', citations:6966 },
  { cnty:'MX', rank:8, domain:'ocu.org', type:'Information', citations:6127 },
  { cnty:'MX', rank:9, domain:'xataka.com', type:'Review', citations:5869 },
  { cnty:'MX', rank:10, domain:'mejoresmarcas.com.mx', type:'Comparison', citations:5473 },
  { cnty:'IN', rank:1, domain:'reddit.com', type:'Community', citations:47458 },
  { cnty:'IN', rank:2, domain:'youtube.com', type:'SNS', citations:41583 },
  { cnty:'IN', rank:3, domain:'samsung.com', type:'Brand/Manufacturer', citations:17434 },
  { cnty:'IN', rank:4, domain:'lg.com', type:'Brand/Manufacturer', citations:15525 },
  { cnty:'IN', rank:5, domain:'croma.com', type:'Retail', citations:14224 },
  { cnty:'IN', rank:6, domain:'bajajfinserv.in', type:'Service', citations:12098 },
  { cnty:'IN', rank:7, domain:'rtings.com', type:'Review', citations:10664 },
  { cnty:'IN', rank:8, domain:'shop.haierindia.com', type:'Brand/Manufacturer', citations:8871 },
  { cnty:'IN', rank:9, domain:'flipkart.com', type:'Retail', citations:7886 },
  { cnty:'IN', rank:10, domain:'timesofindia.indiatimes.com', type:'News', citations:7048 },
  { cnty:'AU', rank:1, domain:'reddit.com', type:'Community', citations:49142 },
  { cnty:'AU', rank:2, domain:'appliancesonline.com.au', type:'Retail', citations:31543 },
  { cnty:'AU', rank:3, domain:'choice.com.au', type:'Review', citations:24167 },
  { cnty:'AU', rank:4, domain:'youtube.com', type:'SNS', citations:21724 },
  { cnty:'AU', rank:5, domain:'thegoodguys.com.au', type:'Retail', citations:20874 },
  { cnty:'AU', rank:6, domain:'samsung.com', type:'Brand/Manufacturer', citations:16161 },
  { cnty:'AU', rank:7, domain:'lg.com', type:'Brand/Manufacturer', citations:13313 },
  { cnty:'AU', rank:8, domain:'techradar.com', type:'Review', citations:13296 },
  { cnty:'AU', rank:9, domain:'rtings.com', type:'Review', citations:11385 },
  { cnty:'AU', rank:10, domain:'productreview.com.au', type:'Community', citations:9370 },
  { cnty:'VN', rank:1, domain:'youtube.com', type:'SNS', citations:42020 },
  { cnty:'VN', rank:2, domain:'dienmayxanh.com', type:'Retail', citations:25059 },
  { cnty:'VN', rank:3, domain:'fptshop.com.vn', type:'Retail', citations:21174 },
  { cnty:'VN', rank:4, domain:'dienmaycholon.com', type:'Retail', citations:18112 },
  { cnty:'VN', rank:5, domain:'lg.com', type:'Brand/Manufacturer', citations:11371 },
  { cnty:'VN', rank:6, domain:'samsung.com', type:'Brand/Manufacturer', citations:11193 },
  { cnty:'VN', rank:7, domain:'reddit.com', type:'Community', citations:10238 },
  { cnty:'VN', rank:8, domain:'panasonic.com', type:'Brand/Manufacturer', citations:8453 },
  { cnty:'VN', rank:9, domain:'cellphones.com.vn', type:'Retail', citations:8176 },
  { cnty:'VN', rank:10, domain:'dienmaythienphu.vn', type:'Retail', citations:8070 },
]

export const INIT_CITATIONS = [
  { rank: 1, source: 'TechRadar',       category: '모니터',     score: 87, delta: +5.2, ratio: 18.5 },
  { rank: 2, source: 'RTINGS.com',      category: 'TV',         score: 82, delta: +2.1, ratio: 17.4 },
  { rank: 3, source: "Tom's Guide",     category: '청소기',     score: 76, delta: -1.3, ratio: 16.2 },
  { rank: 4, source: 'Wirecutter',      category: '냉장고',     score: 71, delta: +8.4, ratio: 15.1 },
  { rank: 5, source: 'CNET',            category: '세탁기',     score: 68, delta: +3.7, ratio: 14.5 },
  { rank: 6, source: '디지털타임스',    category: 'TV',         score: 64, delta: -2.5, ratio: 13.6 },
  { rank: 7, source: 'PCMag',           category: '모니터',     score: 61, delta: +1.9, ratio: 13.0 },
]
