import { useState } from 'react'
import { SECTION_BAR, STAKEHOLDER_COLORS, statusOf } from '../utils/constants'
import { t, tSH, tCat, tMonth } from '../../shared/i18n.js'

function fmt(n) { return Number(n).toLocaleString('en-US') }

// 카테고리 단위 큰 행 카드 — 카테고리별 진척율을 메인으로
export default function CategoryDashboard({ categories, month, lang = 'ko', selectedCategory, onSelectCategory }) {
  const [expanded, setExpanded] = useState({})

  if (!categories || categories.length === 0) return null

  function toggleExpand(catName) {
    setExpanded(s => ({ ...s, [catName]: !s[catName] }))
  }

  return (
    <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 14, overflow: 'hidden' }}>
      {/* 헤더 */}
      <div style={{ padding: '18px 22px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={SECTION_BAR} />
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
            {lang === 'en' ? 'Category Progress' : '과제 카테고리별 진척 현황'}
          </h3>
          <span style={{ fontSize: 13, color: '#64748B', marginLeft: 8 }}>
            {tMonth(lang, month)} · {categories.length}{lang === 'en' ? ' categories' : '개 카테고리'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: '#94A3B8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#15803D' }} />≥80%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D97706' }} />≥50%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#BE123C' }} />{'<50%'}
          </span>
        </div>
      </div>

      {/* 카테고리 row 카드들 */}
      <div style={{ padding: '12px 18px 18px' }}>
        {categories.map(cat => {
          const ms = statusOf(cat.monthRate)
          const ps = statusOf(cat.progressRate || 0)
          const isOpen = !!expanded[cat.category]
          const isSelected = selectedCategory === cat.category
          const monthBarW = Math.min(cat.monthRate || 0, 100)
          const progBarW = Math.min(cat.progressRate || 0, 100)

          return (
            <div
              key={cat.category}
              style={{
                marginBottom: 12,
                background: isSelected ? '#1E293B' : '#172033',
                border: isSelected ? `2px solid ${ps.dot}` : '1px solid #1E293B',
                borderLeft: `5px solid ${ps.dot}`,
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'all 0.15s ease',
              }}
            >
              {/* 헤더 행 — 클릭 시 펼침 */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(cat.category)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(cat.category) } }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr 1fr 110px 110px 30px',
                  gap: 16,
                  alignItems: 'center',
                  padding: '16px 20px',
                  cursor: 'pointer',
                }}
              >
                {/* 카테고리명 */}
                <div>
                  <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#F8FAFC' }}>{tCat(lang, cat.category)}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748B' }}>
                    {cat.taskCount}{lang === 'en' ? ' tasks · ' : '개 과제 · '}
                    {cat.stakeholders?.length || 0}{lang === 'en' ? ' orgs' : '개 조직'}
                  </p>
                </div>

                {/* 월 달성률 */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {tMonth(lang, month)} {lang === 'en' ? 'Rate' : '달성률'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: ms.text, fontVariantNumeric: 'tabular-nums' }}>
                        {(cat.monthRate || 0).toFixed(0)}<span style={{ fontSize: 14 }}>%</span>
                      </span>
                      <span style={{ fontSize: 11, color: '#64748B' }}>{fmt(cat.monthActual)}/{fmt(cat.monthGoal)}</span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${monthBarW}%`, background: ms.bar, transition: 'width 0.7s' }} />
                  </div>
                </div>

                {/* 연간 진척율 */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {lang === 'en' ? 'Annual Progress' : '연간 진척율'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: ps.text, fontVariantNumeric: 'tabular-nums' }}>
                        {(cat.progressRate || 0).toFixed(0)}<span style={{ fontSize: 14 }}>%</span>
                      </span>
                      <span style={{ fontSize: 11, color: '#64748B' }}>{fmt(cat.cumActual)}/{fmt(cat.annualGoal || cat.cumGoal)}</span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${progBarW}%`, background: ps.bar, transition: 'width 0.7s' }} />
                  </div>
                </div>

                {/* 달성과제 */}
                <div style={{ textAlign: 'center', padding: '8px 0', background: 'rgba(21,128,61,0.12)', border: '1px solid rgba(21,128,61,0.35)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: '#86EFAC', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Achieved' : '달성'}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{cat.achieved || 0}</div>
                </div>

                {/* 미달성과제 */}
                <div style={{ textAlign: 'center', padding: '8px 0', background: 'rgba(190,18,60,0.12)', border: '1px solid rgba(190,18,60,0.35)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: '#FCA5A5', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Missed' : '미달성'}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#BE123C', fontVariantNumeric: 'tabular-nums' }}>{cat.missed || 0}</div>
                </div>

                {/* 펼침 화살표 */}
                <div style={{ textAlign: 'center', fontSize: 18, color: '#64748B', userSelect: 'none' }}>
                  {isOpen ? '▾' : '▸'}
                </div>
              </div>

              {/* 펼침 영역: 조직별 과제 리스트 */}
              {isOpen && cat.stakeholders && cat.stakeholders.length > 0 && (
                <div style={{ borderTop: '1px solid #1E293B', background: '#0B1220', padding: '14px 20px' }}>
                  {cat.stakeholders.map(sh => {
                    const shColor = STAKEHOLDER_COLORS[sh.name] || '#94A3B8'
                    const shSt = statusOf(sh.rate)
                    return (
                      <div key={sh.name} style={{ marginBottom: 10, padding: '10px 14px', background: '#0F172A', borderRadius: 8, border: '1px solid #1E293B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 5, fontSize: 14, fontWeight: 700, background: shColor + '22', color: '#F1F5F9', border: `1px solid ${shColor}40` }}>
                            {tSH(lang, sh.name)}
                          </span>
                          <span style={{ fontSize: 15, fontWeight: 800, color: shSt.text, fontVariantNumeric: 'tabular-nums' }}>
                            {(sh.rate || 0).toFixed(1)}%
                          </span>
                          <span style={{ fontSize: 12, color: '#64748B' }}>
                            ({sh.tasks?.length || 0}{lang === 'en' ? ' tasks' : '개 과제'})
                          </span>
                        </div>
                        {sh.tasks && sh.tasks.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {sh.tasks.map((td, i) => {
                              const tSt = td.rate != null ? statusOf(td.rate) : { dot: '#475569', text: '#94A3B8' }
                              return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: '#172033', border: '1px solid #1E293B', borderRadius: 5 }}>
                                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: tSt.dot, flexShrink: 0 }} />
                                  <span style={{ fontSize: 13, color: '#E2E8F0', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={td.task}>{td.task}</span>
                                  <span style={{ fontSize: 11, color: '#64748B', whiteSpace: 'nowrap' }}>{fmt(td.actual)}/{fmt(td.goal)}</span>
                                  {td.rate != null && (
                                    <span style={{ fontSize: 13, fontWeight: 800, color: tSt.text, fontVariantNumeric: 'tabular-nums' }}>{td.rate.toFixed(0)}%</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
