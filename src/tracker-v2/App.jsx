import { useState, useEffect, useMemo, useCallback } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useSheetData } from './hooks/useSheetData'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import StakeholderRanking from './components/StakeholderRanking'
import CategoryRanking from './components/CategoryRanking'
import CategoryCards from './components/CategoryCards'
import CategoryDashboard from './components/CategoryDashboard'
import SectionHeader from './components/SectionHeader'
import DetailTable from './components/DetailTable'
import QualitativeTable from './components/QualitativeTable'
import CategorySummary from './components/CategorySummary'
import RawGoalTable from './components/RawGoalTable'
import { MONTHS } from './utils/constants'
import { t } from '../shared/i18n.js'
import { translateTexts } from '../shared/utils.js'

const IS_PUBLIC = window.location.pathname.startsWith('/p/')
const URL_LANG = new URLSearchParams(window.location.search).get('lang')

function parseRate(v) {
  if (typeof v === 'string' && v.endsWith('%')) return parseFloat(v)
  if (typeof v === 'number') return v
  return null
}

function rowKey(r) {
  return `${r.stakeholder}|${r.taskCategory}|${r.task}|${r.pageType}|${r.detail}`
}

/**
 * Build a lookup map keyed by goal rows' composite key.
 * Uses index-based matching: goalRows[i] ↔ dataRows[i].
 * This avoids mismatches when 표2/표3 have empty metadata columns.
 */
function buildLookup(goalRows, dataRows) {
  const map = {}
  goalRows.forEach((g, idx) => {
    if (idx < dataRows.length) {
      map[rowKey(g)] = dataRows[idx]
    }
  })
  return map
}

function computeDashboard(data, month, stakeholderFilter, categoryFilter) {
  const goals = data.quantitativeGoals
  const actuals = data.quantitativeResults
  const rates = data.quantitativeRates
  const monthIdx = MONTHS.indexOf(month)

  const actualMap = buildLookup(goals.rows, actuals.rows)
  const rateMap = buildLookup(goals.rows, rates.rows)

  let tasks = goals.rows.map((g) => {
    const key = rowKey(g)
    const a = actualMap[key] || {}
    const r = rateMap[key] || {}
    const goal = typeof g.monthly?.[month] === 'number' ? g.monthly[month] : 0
    const actual = typeof a.monthly?.[month] === 'number' ? a.monthly[month] : 0
    const sheetRate = parseRate(r.monthly?.[month])
    const computedRate = goal > 0 ? Math.round((actual / goal) * 1000) / 10 : null
    return {
      stakeholder: g.stakeholder,
      taskCategory: g.taskCategory,
      task: g.task,
      pageType: g.pageType,
      detail: g.detail,
      goalAnnual: typeof g.annual === 'number' ? g.annual : 0,
      actualAnnual: typeof a.annual === 'number' ? a.annual : 0,
      goal,
      actual,
      rate: goal > 0 ? (computedRate !== null ? computedRate : sheetRate) : null,
      goalMonthly: g.monthly,
      actualMonthly: a.monthly,
      rateMonthly: r.monthly,
    }
  })

  // Stakeholder filter
  if (stakeholderFilter !== '전체') {
    tasks = tasks.filter(t => t.stakeholder === stakeholderFilter)
  }

  // Category filter
  if (categoryFilter) {
    tasks = tasks.filter(t => t.taskCategory === categoryFilter)
  }

  // 이번 달 종합 달성률 (가중 평균: 총 실적 / 총 목표)
  const totalMonthActual = tasks.reduce((s, t) => s + (typeof t.actual === 'number' ? t.actual : 0), 0)
  const totalMonthGoal = tasks.reduce((s, t) => s + (typeof t.goal === 'number' ? t.goal : 0), 0)
  const avgRate = totalMonthGoal > 0 ? (totalMonthActual / totalMonthGoal) * 100 : 0
  const validRates = tasks.map(t => t.rate).filter(r => r !== null)
  const warningCount = validRates.filter(r => r < 80).length

  // 누적 실적 + 누적 목표
  let cumulativeActual = 0, cumulativeGoal = 0
  tasks.forEach(t => {
    for (let i = 0; i <= monthIdx; i++) {
      const m = MONTHS[i]
      const av = t.actualMonthly?.[m]
      const gv = t.goalMonthly?.[m]
      if (typeof av === 'number') cumulativeActual += av
      if (typeof gv === 'number') cumulativeGoal += gv
    }
  })

  // 월별 합계
  const monthlyTotals = MONTHS.map(m => ({
    month: m,
    goal: tasks.reduce((s, t) => s + (typeof t.goalMonthly?.[m] === 'number' ? t.goalMonthly[m] : 0), 0),
    actual: tasks.reduce((s, t) => s + (typeof t.actualMonthly?.[m] === 'number' ? t.actualMonthly[m] : 0), 0),
  }))

  // 누적 진척 — 목표는 12월까지, 실적은 해당 월까지만
  let cumA = 0, cumG = 0
  const cumulative = MONTHS.map((m, idx) => {
    const mt = monthlyTotals.find(t => t.month === m)
    cumG += mt?.goal || 0
    if (idx <= monthIdx) {
      cumA += mt?.actual || 0
      return { month: m, cumActual: cumA, cumGoal: cumG }
    }
    return { month: m, cumActual: null, cumGoal: cumG }
  })

  const annualTarget = tasks.reduce((s, t) => s + t.goalAnnual, 0)

  // 스테이크홀더별 (카테고리 필터 적용, stakeholder 필터 없이 전체 태스크 사용)
  let allTasks = goals.rows.map((g) => {
    const key = rowKey(g)
    const a = actualMap[key] || {}
    const r = rateMap[key] || {}
    const gv = typeof g.monthly?.[month] === 'number' ? g.monthly[month] : 0
    const av = typeof a.monthly?.[month] === 'number' ? a.monthly[month] : 0
    const sheetRate = parseRate(r.monthly?.[month])
    const computedRate = gv > 0 ? Math.round((av / gv) * 1000) / 10 : null
    return { stakeholder: g.stakeholder, taskCategory: g.taskCategory, task: g.task, rate: gv > 0 ? (computedRate !== null ? computedRate : sheetRate) : null, goalMonthly: g.monthly, actualMonthly: a.monthly }
  })
  if (categoryFilter) {
    allTasks = allTasks.filter(t => t.taskCategory === categoryFilter)
  }
  const shNames = [...new Set(allTasks.map(t => t.stakeholder))]
  const stakeholders = shNames.map(sh => {
    const shTasks = allTasks.filter(t => t.stakeholder === sh)

    let monthAct = 0, monthGoalSh = 0
    const taskDetails = []
    shTasks.forEach(t => {
      const av = t.actualMonthly?.[month]
      const gv = t.goalMonthly?.[month]
      const actualVal = typeof av === 'number' ? av : 0
      const goalVal = typeof gv === 'number' ? gv : 0
      if (typeof av === 'number') monthAct += av
      if (typeof gv === 'number') monthGoalSh += gv
      taskDetails.push({
        task: t.task,
        monthActual: actualVal,
        monthGoal: goalVal,
        rate: t.rate,
      })
    })

    let cumAct = 0, cumGoalSh = 0
    shTasks.forEach(t => {
      for (let i = 0; i <= monthIdx; i++) {
        const m = MONTHS[i]
        const av = t.actualMonthly?.[m]
        const gv = t.goalMonthly?.[m]
        if (typeof av === 'number') cumAct += av
        if (typeof gv === 'number') cumGoalSh += gv
      }
    })
    const cumRate = cumGoalSh > 0 ? (cumAct / cumGoalSh) * 100 : (cumAct > 0 ? 100 : 0)

    const monthRate = monthGoalSh > 0 ? (monthAct / monthGoalSh) * 100 : (monthAct > 0 ? 100 : 0)
    return {
      name: sh,
      monthRate: Math.round(monthRate * 10) / 10,
      cumRate: Math.round(cumRate * 10) / 10,
      monthActual: monthAct,
      monthGoal: monthGoalSh,
      cumActual: cumAct,
      cumGoal: cumGoalSh,
      taskCount: shTasks.length,
      warnings: taskDetails.filter(td => td.rate !== null && td.rate < 80).length,
      taskDetails,
    }
  }).sort((a, b) => b.monthRate - a.monthRate)

  // 과제구분별 달성률 (조직 필터 적용, 카테고리 필터 미적용)
  const shFilteredGoals = stakeholderFilter !== '전체'
    ? goals.rows.filter(g => g.stakeholder === stakeholderFilter)
    : goals.rows
  const categoryNames = [...new Set(shFilteredGoals.map(g => g.taskCategory).filter(Boolean))]

  const categoryStats = categoryNames.map(cat => {
    const catGoals = shFilteredGoals.filter(g => g.taskCategory === cat)
    let mAct = 0, mGoal = 0, cAct = 0, cGoal = 0, annualGoal = 0
    catGoals.forEach(g => {
      const key = rowKey(g)
      const a = actualMap[key] || {}
      const gv = typeof g.monthly?.[month] === 'number' ? g.monthly[month] : 0
      const av = typeof a.monthly?.[month] === 'number' ? a.monthly[month] : 0
      mGoal += gv
      mAct += av
      for (let i = 0; i <= monthIdx; i++) {
        const m = MONTHS[i]
        if (typeof g.monthly?.[m] === 'number') cGoal += g.monthly[m]
        if (typeof a.monthly?.[m] === 'number') cAct += a.monthly[m]
      }
      // 연간 전체 goal 합산
      MONTHS.forEach(m => {
        if (typeof g.monthly?.[m] === 'number') annualGoal += g.monthly[m]
      })
    })
    // 목표가 0이면 달성률/진척률은 null (회색 "-" 표기)
    const monthRate = mGoal > 0 ? Math.round((mAct / mGoal) * 1000) / 10 : null
    const cumRate = cGoal > 0 ? Math.round((cAct / cGoal) * 1000) / 10 : null
    // 진척율 = 누적 actual / 연간 goal × 100
    const progressRate = annualGoal > 0 ? Math.round((cAct / annualGoal) * 1000) / 10 : null
    const shNames = [...new Set(catGoals.map(g => g.stakeholder))]
    const stakeholders = shNames.map(sh => {
      let smAct = 0, smGoal = 0
      const shTasks = []
      catGoals.filter(g => g.stakeholder === sh).forEach(g => {
        const key = rowKey(g)
        const a = actualMap[key] || {}
        const r = rateMap[key] || {}
        const tGoal = typeof g.monthly?.[month] === 'number' ? g.monthly[month] : 0
        const tAct = typeof a.monthly?.[month] === 'number' ? a.monthly[month] : 0
        smGoal += tGoal
        smAct += tAct
        const sheetRate = parseRate(r.monthly?.[month])
        const computed = tGoal > 0 ? Math.round((tAct / tGoal) * 1000) / 10 : null
        const tRate = tGoal > 0 ? (computed !== null ? computed : sheetRate) : null
        shTasks.push({ task: g.task, rate: tRate, actual: tAct, goal: tGoal })
      })
      const rate = smGoal > 0 ? Math.round((smAct / smGoal) * 1000) / 10 : 0
      return { name: sh, rate, tasks: shTasks }
    })
    // 달성/미달성 과제수
    let achieved = 0, missed = 0
    catGoals.forEach(g => {
      const key = rowKey(g)
      const a = actualMap[key] || {}
      const tGoal = typeof g.monthly?.[month] === 'number' ? g.monthly[month] : 0
      const tAct = typeof a.monthly?.[month] === 'number' ? a.monthly[month] : 0
      if (tGoal > 0) {
        const r = (tAct / tGoal) * 100
        if (r >= 80) achieved++
        else missed++
      }
    })
    return { category: cat, taskCount: catGoals.length, monthRate, cumRate, progressRate, monthActual: mAct, monthGoal: mGoal, cumActual: cAct, cumGoal: cGoal, annualGoal, stakeholders, achieved, missed }
  })

  // 카테고리 표시 순서 고정: 콘텐츠수정 → 신규콘텐츠제작 → 외부채널관리 → 닷컴기술개선
  // 시트 원본의 공백 유무 차이를 흡수하기 위해 공백 제거 후 비교
  const CATEGORY_ORDER = ['콘텐츠수정', '신규콘텐츠제작', '외부채널관리', '닷컴기술개선']
  const catIdx = (name) => {
    const key = String(name || '').replace(/\s+/g, '')
    const i = CATEGORY_ORDER.indexOf(key)
    return i === -1 ? 999 : i
  }
  categoryStats.sort((a, b) => catIdx(a.category) - catIdx(b.category))

  const totalsRate = parseRate(rates.totals?.monthly?.[month])
  const currentMT = monthlyTotals.find(t => t.month === month)
  const monthActual = currentMT?.actual || 0
  const monthGoal = currentMT?.goal || 0

  // 전체 달성/미달성 과제수 (월 기준)
  const achievedCount = tasks.filter(t => typeof t.goal === 'number' && t.goal > 0 && (t.actual / t.goal) * 100 >= 80).length
  const missedCount = tasks.filter(t => typeof t.goal === 'number' && t.goal > 0 && (t.actual / t.goal) * 100 < 80).length
  // 연간 진척율 (전체)
  const annualProgressRate = annualTarget > 0 ? Math.round((cumulativeActual / annualTarget) * 1000) / 10 : 0

  return {
    tasks,
    avgRate: Math.round(avgRate * 10) / 10,
    totalsRate: totalsRate !== null ? Math.round(totalsRate * 10) / 10 : null,
    warningCount,
    achievedCount,
    missedCount,
    annualProgressRate,
    cumulativeActual,
    cumulativeGoal,
    monthActual,
    monthGoal,
    monthlyTotals,
    cumulative,
    annualTarget,
    stakeholders,
    categoryStats,
  }
}

export default function App() {
  const [lang, setLang] = useState(URL_LANG === 'en' ? 'en' : 'ko')
  const { data, loading, error, load, refresh } = useSheetData(IS_PUBLIC ? 'snapshot' : 'live')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const prev = new Date().getMonth()  // 0-11 → 전월 (1-12)의 0-based index와 일치
    const label = `${prev}월`
    return MONTHS.includes(label) ? label : MONTHS[0]
  })
  const [selectedSH, setSelectedSH] = useState('전체')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [taskTranslations, setTaskTranslations] = useState({}) // { 한글: 영어 }
  const [notice, setNotice] = useState({ show: false, text: '' })
  const [sidebarOpen, setSidebarOpen] = useState(!IS_PUBLIC)

  useEffect(() => { load() }, [load])

  // 서버에서 노티스 가져오기
  useEffect(() => {
    fetch('/api/dashboard/sync-data').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.ok && d.data?.meta) {
        const m = d.data.meta
        setNotice({ show: !!m.showNotice, text: m.noticeText || '' })
      }
    }).catch(() => {})
  }, [])

  const saveNotice = useCallback((n) => {
    setNotice(n)
    // 서버의 meta에 노티스 저장
    fetch('/api/dashboard/sync-data').then(r => r.ok ? r.json() : null).then(d => {
      if (!d?.ok) return
      const meta = { ...(d.data?.meta || {}), showNotice: n.show, noticeText: n.text }
      fetch('/api/dashboard/sync-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ data: { ...d.data, meta } })
      }).catch(() => {})
    }).catch(() => {})
  }, [])

  // Reset category filter when stakeholder changes
  useEffect(() => { setSelectedCategory(null) }, [selectedSH])

  // EN 모드일 때 과제명/상세 자동 번역
  useEffect(() => {
    if (lang !== 'en' || !data) return
    const goals = data.quantitativeGoals?.rows || []
    const qualGoals = data.qualitativeGoals?.rows || []
    const allTexts = new Set()
    goals.forEach(g => { if (g.task) allTexts.add(g.task); if (g.detail) allTexts.add(g.detail) })
    qualGoals.forEach(g => { if (g.task) allTexts.add(g.task); if (g.detail) allTexts.add(g.detail) })
    const toTranslate = [...allTexts].filter(t => t && /[가-힣]/.test(t) && !taskTranslations[t])
    if (!toTranslate.length) return
    translateTexts(toTranslate, { from: 'ko', to: 'en' }).then(results => {
      const map = { ...taskTranslations }
      toTranslate.forEach((k, i) => { if (results[i]) map[k] = results[i] })
      setTaskTranslations(map)
    }).catch(() => {})
  }, [lang, data])

  const stakeholderList = useMemo(() => {
    if (!data) return []
    return [...new Set(data.quantitativeGoals.rows.map(r => r.stakeholder))]
  }, [data])

  const categoryList = useMemo(() => {
    if (!data) return []
    const ORDER = ['콘텐츠수정', '신규콘텐츠제작', '외부채널관리', '닷컴기술개선']
    const norm = s => String(s || '').replace(/\s+/g, '')
    const list = [...new Set(data.quantitativeGoals.rows.map(r => r.taskCategory).filter(Boolean))]
    return list.sort((a, b) => {
      const ai = ORDER.indexOf(norm(a))
      const bi = ORDER.indexOf(norm(b))
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
  }, [data])

  const dashboard = useMemo(() => {
    if (!data) return null
    return computeDashboard(data, selectedMonth, selectedSH, selectedCategory)
  }, [data, selectedMonth, selectedSH, selectedCategory])

  // 게시 기능
  const [publishing, setPublishing] = useState(false)
  const [publishInfo, setPublishInfo] = useState(null)

  useEffect(() => {
    if (IS_PUBLIC) return
    fetch('/api/publish-tracker-v2').then(r => r.ok ? r.json() : null).then(setPublishInfo).catch(() => {})
  }, [])

  async function handlePublish() {
    if (!data || publishing) return
    setPublishing(true)
    try {
      const res = await fetch('/api/publish-tracker-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ data, dashboard, month: selectedMonth }),
      })
      const j = await res.json()
      if (!j.ok) throw new Error(j.error || '게시 실패')
      setPublishInfo({ published: true, ...j })
    } catch (err) {
      alert('게시 실패: ' + err.message)
    } finally {
      setPublishing(false)
    }
  }

  async function handleUnpublish() {
    try {
      await fetch('/api/publish-tracker-v2', { method: 'DELETE' })
      setPublishInfo(null)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header
        onRefresh={IS_PUBLIC ? null : refresh}
        loading={loading}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedSH={selectedSH}
        setSelectedSH={setSelectedSH}
        stakeholderList={stakeholderList}
        isPublic={IS_PUBLIC}
        onPublish={handlePublish}
        publishing={publishing}
        publishInfo={publishInfo}
        onUnpublish={handleUnpublish}
        lang={lang}
        setLang={setLang}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryList={categoryList}
        onClearCategory={() => setSelectedCategory(null)}
      />

      <div style={{ display: 'flex' }}>
      {/* 사이드바 (어드민 전용) */}
      {!IS_PUBLIC && sidebarOpen && (
        <div style={{ width: 280, flexShrink: 0, background: '#0F172A', borderRight: '1px solid #1E293B', padding: 16, overflowY: 'auto', maxHeight: 'calc(100vh - 130px)', position: 'sticky', top: 130 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 16 }}>Settings</h3>

          {/* 노티스 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Notice</span>
              <button onClick={() => saveNotice({ ...notice, show: !notice.show })}
                style={{ padding: '2px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700,
                  background: notice.show ? '#166534' : '#1E293B', color: notice.show ? '#86EFAC' : '#64748B' }}>
                {notice.show ? 'ON' : 'OFF'}
              </button>
            </div>
            <textarea value={notice.text} onChange={e => setNotice(n => ({ ...n, text: e.target.value }))}
              onBlur={() => saveNotice(notice)}
              rows={4} placeholder="공지사항 텍스트 (**bold** 지원)"
              style={{ width: '100%', background: '#1E293B', border: '1px solid #334155', borderRadius: 6, padding: '8px 10px',
                fontSize: 12, color: '#E2E8F0', resize: 'vertical', outline: 'none', lineHeight: 1.6 }} />
          </div>
        </div>
      )}
      {!IS_PUBLIC && (
        <button onClick={() => setSidebarOpen(v => !v)} title={sidebarOpen ? '패널 닫기' : '패널 열기'}
          style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 50, width: 36, height: 36, borderRadius: '50%',
            background: '#0F172A', border: '1px solid #334155', color: '#94A3B8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      )}

      <main className="flex-1 max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        {notice.show && notice.text && (
          <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#BE123C', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {lang === 'en' ? 'NOTICE' : '공지사항'}
            </div>
            <div style={{ fontSize: 15, color: '#1E293B', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: notice.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-[16px]">
            {error}
          </div>
        )}

        {loading && !data && (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-gray-400 text-[16px]">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              {t(lang, 'loadingData')}
            </div>
          </div>
        )}

        {dashboard && (
          <>
            {/* Executive Summary 다크 박스 — 전체 요약 + 카테고리별 진척 */}
            <section style={{
              marginBottom: 32,
              background: 'linear-gradient(180deg, #0B1220 0%, #0F172A 100%)',
              border: '1px solid #1E293B',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 10px 30px rgba(2,6,23,0.25)',
            }}>
              {/* 박스 라벨 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ display: 'inline-block', width: 6, height: 22, background: '#CF0652', borderRadius: 3 }} />
                <span style={{
                  fontSize: 13, fontWeight: 900, color: '#FCA5C8',
                  letterSpacing: '2px', textTransform: 'uppercase',
                }}>
                  Executive Summary
                </span>
              </div>

              {/* 과제 구분별 달성률 (4박스 카드) */}
              <div style={{ marginBottom: 16 }}>
                <CategoryCards
                  categories={dashboard.categoryStats}
                  month={selectedMonth}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  lang={lang}
                />
              </div>

              {/* 전체 요약 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
                    {lang === 'en' ? 'Overall Summary' : '전체 요약'}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    {lang === 'en' ? 'Aggregated metrics across all categories' : '전 카테고리 통합 지표'}
                  </p>
                </div>
                <div style={{ height: 1, background: '#1E293B', marginBottom: 12 }} />
                <SummaryCards
                  avgRate={dashboard.avgRate}
                  monthActual={dashboard.monthActual}
                  monthGoal={dashboard.monthGoal}
                  annualProgressRate={dashboard.annualProgressRate}
                  cumulativeActual={dashboard.cumulativeActual}
                  annualTarget={dashboard.annualTarget}
                  achievedCount={dashboard.achievedCount}
                  missedCount={dashboard.missedCount}
                  month={selectedMonth}
                  lang={lang}
                />
              </div>
            </section>

            {/* 카테고리별 섹션 (각 카테고리 = 정량 + 정성) */}
            {dashboard.categoryStats
              .filter(c => !selectedCategory || c.category === selectedCategory)
              .map(c => {
                const catTasks = dashboard.tasks.filter(t => t.taskCategory === c.category)
                // 해당 카테고리에 속하면서 selectedSH 조건을 만족하는 정성 과제가 있는지
                const qualRows = data?.qualitativeResults?.rows || []
                const qualGoals = data?.qualitativeGoals?.rows || []
                const hasQual = qualRows.some(r => {
                  if (selectedSH !== '전체' && r.stakeholder !== selectedSH) return false
                  const cat = r.taskCategory
                    || qualGoals.find(g => g.stakeholder === r.stakeholder && g.task === r.task)?.taskCategory
                  return cat === c.category
                })

                return (
                  <section
                    key={c.category}
                    style={{
                      marginBottom: 24,
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: 16,
                      padding: '20px 20px 24px',
                      boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                    }}
                  >
                    <SectionHeader title={c.category} accentBar legend />

                    {/* 정량 과제 */}
                    <div style={{ marginBottom: 16 }}>
                      <h4 style={{
                        margin: '0 0 8px',
                        paddingLeft: 19,
                        fontSize: 17,
                        fontWeight: 700,
                        color: '#0F172A',
                      }}>
                        {lang === 'en' ? 'Quantitative' : '정량 과제'}
                      </h4>
                      <DetailTable
                        tasks={catTasks}
                        categoryStats={[c]}
                        month={selectedMonth}
                        lang={lang}
                        tr={taskTranslations}
                      />
                    </div>

                    {/* 정성 과제 — 과제 없으면 숨김 */}
                    {data && hasQual && (
                      <div>
                        <h4 style={{
                          margin: '0 0 8px',
                          paddingLeft: 19,
                          fontSize: 17,
                          fontWeight: 700,
                          color: '#0F172A',
                        }}>
                          {lang === 'en' ? 'Qualitative' : '정성 과제'}
                        </h4>
                        <QualitativeTable
                          goals={data.qualitativeGoals.rows}
                          results={data.qualitativeResults.rows}
                          selectedSH={selectedSH}
                          selectedCategory={c.category}
                          month={selectedMonth}
                          lang={lang}
                          tr={taskTranslations}
                        />
                      </div>
                    )}
                  </section>
                )
              })}

            {data && (
              <section style={{ marginBottom: 32 }}>
                <SectionHeader
                  title={lang === 'en' ? 'Annual Goals (Raw)' : '연간 목표 (원본)'}
                  subtitle={lang === 'en' ? 'Original goal data from the source sheet' : '시트 원본 목표 데이터'}
                />
                <RawGoalTable
                  rows={data.quantitativeGoals.rows}
                  selectedSH={selectedSH}
                  selectedCategory={selectedCategory}
                  lang={lang}
                  tr={taskTranslations}
                />
              </section>
            )}
          </>
        )}
      </main>
      </div>
      <footer style={{ padding: '8px 16px', textAlign: 'right', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
        <span style={{ fontSize: 15, color: '#94a3b8' }}>v{__APP_VERSION__}</span>
      </footer>
    </div>
  )
}
