import { STAKEHOLDER_COLORS, statusOf } from '../utils/constants'
import { tSH, tCat, tMonth } from '../../shared/i18n.js'

function fmt(n) { return Number(n).toLocaleString('en-US') }

/**
 * 과제 구분별 달성률 — 4박스 카드 레이아웃 (다크 테마)
 * 카테고리명 · 유관조직 수 · 월 달성률(바) · 누적 달성률(바) · 조직 뱃지
 */
export default function CategoryCards({ categories, month, lang = 'ko', selectedCategory, onSelectCategory }) {
  if (!categories || categories.length === 0) return null

  return (
    <div>
      {/* 타이틀 — 전체 요약과 동일한 레벨 */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
            {lang === 'en' ? 'Category Achievement Rate' : '과제 구분별 달성률'}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            {lang === 'en' ? 'Metrics by category' : '카테고리별 지표'}
          </p>
        </div>
        {/* 색상 범례 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#94A3B8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#15803D' }} />≥100%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#D97706' }} />≥80%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#BE123C' }} />{'<80%'}
          </span>
        </div>
      </div>
      <div style={{ height: 1, background: '#1E293B', marginBottom: 12 }} />

      {/* 카드 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
        gap: 12,
      }}>
        {categories.map(cat => {
          const monthRateVal = cat.monthRate == null ? null : cat.monthRate
          const progRateVal = cat.progressRate == null ? (cat.cumRate == null ? null : cat.cumRate) : cat.progressRate
          const mSt = statusOf(monthRateVal)
          const pSt = statusOf(progRateVal)
          const monthBarW = Math.min(monthRateVal || 0, 100)
          const progBarW = Math.min(progRateVal || 0, 100)
          const isSelected = selectedCategory === cat.category
          const shCount = (cat.stakeholders && cat.stakeholders.length) || 0

          return (
            <div
              key={cat.category}
              role="button"
              tabIndex={0}
              onClick={() => onSelectCategory?.(isSelected ? null : cat.category)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectCategory?.(isSelected ? null : cat.category) } }}
              style={{
                background: isSelected ? '#1E293B' : '#172033',
                border: isSelected ? `1px solid ${mSt.dot}` : '1px solid #1E293B',
                borderRadius: 10,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* 카테고리명 + 유관조직 수 */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#F8FAFC' }}>
                  {tCat(lang, cat.category)}
                </h4>
                <span style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                  {lang === 'en' ? `${shCount} orgs` : `유관조직 ${shCount}개`}
                </span>
              </div>

              {/* 월 달성률 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6, gap: 6 }}>
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>
                    {tMonth(lang, month)} {lang === 'en' ? 'Rate' : '달성률'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: mSt.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 16, fontWeight: 900, color: mSt.text, fontVariantNumeric: 'tabular-nums' }}>
                      {monthRateVal == null ? '—' : `${monthRateVal.toFixed(1)}%`}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {fmt(cat.monthActual || 0)} / {fmt(cat.monthGoal || 0)}
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, width: `${monthBarW}%`, background: mSt.dot, transition: 'width 0.7s' }} />
                </div>
              </div>

              {/* 누적 달성률 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6, gap: 6 }}>
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>
                    {lang === 'en' ? 'Annual Progress' : '연간 진척률'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: pSt.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 16, fontWeight: 900, color: pSt.text, fontVariantNumeric: 'tabular-nums' }}>
                      {progRateVal == null ? '—' : `${progRateVal.toFixed(1)}%`}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {fmt(cat.cumActual || 0)} / {fmt(cat.annualGoal || cat.cumGoal || 0)}
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, width: `${progBarW}%`, background: pSt.dot, transition: 'width 0.7s' }} />
                </div>
              </div>

              {/* 조직 뱃지 */}
              {cat.stakeholders && cat.stakeholders.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
                  {cat.stakeholders.map(sh => {
                    const shColor = STAKEHOLDER_COLORS[sh.name] || '#94A3B8'
                    return (
                      <span
                        key={sh.name}
                        style={{
                          padding: '3px 9px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 700,
                          background: shColor + '22',
                          color: '#F1F5F9',
                          border: `1px solid ${shColor}55`,
                        }}
                      >
                        {tSH(lang, sh.name)}
                      </span>
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
