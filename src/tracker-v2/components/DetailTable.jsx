import { useState } from 'react'
import { STAKEHOLDER_COLORS, statusOf } from '../utils/constants'
import { t, tSH, tCat, tMonth } from '../../shared/i18n.js'

function fmt(n) { return Number(n).toLocaleString('en-US') }
function fmtRate(rate) {
  if (rate === null || rate === undefined) return '\u2014'
  return `${rate.toFixed(1)}%`
}
function _tr(lang, tr, text) { return lang === 'en' && tr && tr[text] ? tr[text] : text }

const CATEGORY_ORDER = ['콘텐츠수정', '신규콘텐츠제작', '외부채널관리', '닷컴기술개선']
function catSortKey(name) {
  const idx = CATEGORY_ORDER.indexOf(name)
  return idx >= 0 ? idx : 999
}

export default function DetailTable({ tasks, categoryStats = [], month, lang = 'ko', tr = {} }) {
  const [expanded, setExpanded] = useState({})

  // 카테고리별 그룹핑
  const byCategory = {}
  ;(tasks || []).forEach(tk => {
    const cat = tk.taskCategory || (lang === 'en' ? 'Uncategorized' : '미분류')
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(tk)
  })

  // categoryStats에 있는 모든 카테고리 + tasks에만 있는 카테고리 합집합 (정렬)
  const catsFromStats = (categoryStats || []).map(c => c.category)
  const catsFromTasks = Object.keys(byCategory)
  const allCats = [...new Set([...catsFromStats, ...catsFromTasks])]
    .sort((a, b) => catSortKey(a) - catSortKey(b))

  const statsByName = {}
  ;(categoryStats || []).forEach(c => { statsByName[c.category] = c })

  function toggleExpand(cat) {
    setExpanded(s => ({ ...s, [cat]: !s[cat] }))
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
      {allCats.length === 0 && (
        <p style={{ padding: '32px 12px', textAlign: 'center', color: '#94A3B8', fontSize: 16, margin: 0 }}>
          {t(lang, 'noTasksForSH')}
        </p>
      )}

      {allCats.map(cat => {
        const rows = byCategory[cat] || []
        const stat = statsByName[cat]
        const isOpen = !!expanded[cat]
        const ms = statusOf(stat?.monthRate || 0)
        const ps = statusOf(stat?.progressRate || 0)
        const monthBarW = Math.min(stat?.monthRate || 0, 100)
        const progBarW = Math.min(stat?.progressRate || 0, 100)

        return (
          <div key={cat} style={{ borderBottom: '1px solid #E2E8F0' }}>
            {/* 카테고리 큰 헤더 (CategoryDashboard 스타일, 밝은 배경) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => toggleExpand(cat)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(cat) } }}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr 1fr 110px 110px 30px',
                gap: 16,
                alignItems: 'center',
                padding: '16px 20px',
                cursor: 'pointer',
                background: isOpen ? '#F8FAFC' : '#FFFFFF',
                borderLeft: `5px solid ${ps.dot}`,
                transition: 'background 0.15s',
              }}
            >
              {/* 카테고리명 */}
              <div>
                <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0F172A' }}>{tCat(lang, cat)}</h4>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748B' }}>
                  {rows.length}{lang === 'en' ? ' tasks' : '개 과제'}
                  {stat?.stakeholders?.length ? ` · ${stat.stakeholders.length}${lang === 'en' ? ' orgs' : '개 조직'}` : ''}
                </p>
              </div>

              {/* 월 달성률 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {tMonth(lang, month)} {lang === 'en' ? 'Rate' : '달성률'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: ms.text, fontVariantNumeric: 'tabular-nums' }}>
                      {(stat?.monthRate || 0).toFixed(0)}<span style={{ fontSize: 14 }}>%</span>
                    </span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{fmt(stat?.monthActual || 0)}/{fmt(stat?.monthGoal || 0)}</span>
                  </div>
                </div>
                <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, width: `${monthBarW}%`, background: ms.bar, transition: 'width 0.7s' }} />
                </div>
              </div>

              {/* 연간 진척율 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Annual Progress' : '연간 진척율'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: ps.text, fontVariantNumeric: 'tabular-nums' }}>
                      {(stat?.progressRate || 0).toFixed(0)}<span style={{ fontSize: 14 }}>%</span>
                    </span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{fmt(stat?.cumActual || 0)}/{fmt(stat?.annualGoal || stat?.cumGoal || 0)}</span>
                  </div>
                </div>
                <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, width: `${progBarW}%`, background: ps.bar, transition: 'width 0.7s' }} />
                </div>
              </div>

              {/* 달성과제 */}
              <div style={{ textAlign: 'center', padding: '8px 0', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: '#15803D', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                  {lang === 'en' ? 'Achieved' : '달성'}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{stat?.achieved || 0}</div>
              </div>

              {/* 미달성과제 */}
              <div style={{ textAlign: 'center', padding: '8px 0', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: '#BE123C', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                  {lang === 'en' ? 'Missed' : '미달성'}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#BE123C', fontVariantNumeric: 'tabular-nums' }}>{stat?.missed || 0}</div>
              </div>

              {/* 펼침 화살표 */}
              <div style={{ textAlign: 'center', fontSize: 18, color: '#94A3B8', userSelect: 'none' }}>
                {isOpen ? '▾' : '▸'}
              </div>
            </div>

            {/* 펼침 영역: 과제 리스트 테이블 */}
            {isOpen && rows.length > 0 && (
              <div style={{ borderTop: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                <div className="overflow-x-auto">
                  <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 100 }}>{t(lang, 'org')}</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 240 }}>{t(lang, 'task')}</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 130 }}>Page Type</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t(lang, 'goalDetail')}</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 70 }}>{t(lang, 'goalLabel')}</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 70 }}>{t(lang, 'actualLabel')}</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 90 }}>{t(lang, 'rateLabel')}</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 70 }}>{t(lang, 'annualGoal')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((tk, i) => {
                        const color = STAKEHOLDER_COLORS[tk.stakeholder] || '#94A3B8'
                        const st = statusOf(tk.rate)
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-[#F8FAFC] transition-colors">
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 13, fontWeight: 700, background: color + '18', color: '#111827', border: `1px solid ${color}30` }}>
                                {tSH(lang, tk.stakeholder)}
                              </span>
                            </td>
                            <td style={{ padding: '8px 12px', color: '#1E293B', fontWeight: 500 }}>{_tr(lang, tr, tk.task)}</td>
                            <td style={{ padding: '8px 12px', color: '#64748B' }}>{tk.pageType}</td>
                            <td style={{ padding: '8px 12px', color: '#475569', maxWidth: 280 }}>
                              <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={_tr(lang, tr, tk.detail)}>{_tr(lang, tr, tk.detail)}</span>
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
                              {typeof tk.goal === 'number' && tk.goal > 0 ? tk.goal.toLocaleString() : '\u2014'}
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', color: '#1E293B', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                              {typeof tk.actual === 'number' && tk.actual > 0 ? tk.actual.toLocaleString() : '\u2014'}
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: st.dot }} />
                                <span style={{ fontWeight: tk.rate !== null ? 700 : 400, color: st.text, fontVariantNumeric: 'tabular-nums' }}>{fmtRate(tk.rate)}</span>
                              </div>
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', color: '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>
                              {tk.goalAnnual > 0 ? tk.goalAnnual.toLocaleString() : '\u2014'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
