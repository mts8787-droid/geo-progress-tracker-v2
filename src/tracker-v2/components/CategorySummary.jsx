import { useState } from 'react'
import { SECTION_BAR, statusOf } from '../utils/constants'
import { t, tCat, tMonth } from '../../shared/i18n.js'

function fmt(n) { return Number(n).toLocaleString('en-US') }

// 도넛 차트 SVG
function DonutProgress({ rate, color, size = 120 }) {
  const stroke = 12
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const r = Math.min(Math.max(rate || 0, 0), 100)
  const offset = circ - (r / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  )
}

export default function CategorySummary({ categories, month, lang = 'ko', selectedCategory, onSelectCategory }) {
  const [hoveredCat, setHoveredCat] = useState(null)

  if (!categories || categories.length === 0) return null

  return (
    <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={SECTION_BAR} />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F1F5F9', margin: 0 }}>{t(lang, 'categorySummary')}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#94A3B8' }}>
          <span>📅 {tMonth(lang, month)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ padding: 20 }}>
        {categories.map(cat => {
          const ms = statusOf(cat.monthRate)
          const ps = statusOf(cat.progressRate || 0)
          const isSelected = selectedCategory === cat.category
          const isHovered = hoveredCat === cat.category
          const shCount = cat.stakeholders ? cat.stakeholders.length : 0
          const achieved = cat.achieved || 0
          const missed = cat.missed || 0

          return (
            <div
              key={cat.category}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory?.(isSelected ? null : cat.category)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectCategory?.(isSelected ? null : cat.category) } }}
              onMouseEnter={() => setHoveredCat(cat.category)}
              onMouseLeave={() => setHoveredCat(null)}
              style={{
                position: 'relative',
                background: isSelected || isHovered ? '#0F172A' : '#0B1220',
                border: isSelected ? `2px solid ${ps.dot}` : `1px solid ${ps.border || '#334155'}`,
                borderRadius: 12,
                padding: 18,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                transform: isSelected ? 'scale(1.02)' : 'none',
                boxShadow: isSelected ? `0 6px 18px ${ps.dot}30` : 'none',
              }}
            >
              {/* 카테고리명 + 과제 수 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#F8FAFC' }}>{tCat(lang, cat.category)}</h4>
                <span style={{ fontSize: 12, color: '#94A3B8', padding: '3px 8px', background: '#1E293B', borderRadius: 4, border: '1px solid #334155' }}>
                  {cat.taskCount}{lang === 'en' ? ' tasks' : '개 과제'}
                </span>
              </div>

              {/* 도넛 차트 + 진척율 % */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 14 }}>
                <DonutProgress rate={cat.progressRate || 0} color={ps.dot} size={140} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: ps.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {(cat.progressRate || 0).toFixed(0)}<span style={{ fontSize: 18 }}>%</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Annual' : '연간 진척'}
                  </div>
                </div>
              </div>

              {/* 누적 / 연간 목표 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#64748B', marginBottom: 14 }}>
                <span style={{ fontWeight: 700, color: '#CBD5E1' }}>{fmt(cat.cumActual)}</span>
                <span>/</span>
                <span>{fmt(cat.annualGoal || cat.cumGoal)}</span>
              </div>

              {/* 월 달성률 막대 */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>{tMonth(lang, month)} {lang === 'en' ? 'Rate' : '달성률'}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: ms.text, fontVariantNumeric: 'tabular-nums' }}>{(cat.monthRate || 0).toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.10)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: ms.bar, width: `${Math.min(cat.monthRate || 0, 100)}%`, transition: 'width 0.6s' }} />
                </div>
              </div>

              {/* 달성/미달성 과제 카운트 */}
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1, padding: '6px 8px', background: '#052E1D', border: '1px solid #14532D', borderRadius: 6, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#86EFAC', marginBottom: 2 }}>{lang === 'en' ? 'Achieved' : '달성'}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#15803D', fontVariantNumeric: 'tabular-nums' }}>{achieved}</div>
                </div>
                <div style={{ flex: 1, padding: '6px 8px', background: '#2C0815', border: '1px solid #7F1D1D', borderRadius: 6, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#FCA5A5', marginBottom: 2 }}>{lang === 'en' ? 'Missed' : '미달성'}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#BE123C', fontVariantNumeric: 'tabular-nums' }}>{missed}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
