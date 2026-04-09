import { statusOf } from '../utils/constants'
import { t, tMonth } from '../../shared/i18n.js'

function fmt(n) { return Number(n).toLocaleString('en-US') }

// 전체 요약 — 4개 메트릭 카드만 표시
export default function SummaryCards({
  avgRate, monthActual, monthGoal,
  annualProgressRate, cumulativeActual, annualTarget,
  achievedCount, missedCount,
  month, lang = 'ko',
}) {
  const s = statusOf(avgRate)
  const ps = statusOf(annualProgressRate)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. 월 달성률 */}
          <Metric
            label={t(lang, 'monthRate', tMonth(lang, month))}
            value={avgRate.toFixed(1)}
            unit="%"
            sub={`${fmt(monthActual)} / ${fmt(monthGoal)}`}
            color={s.text} dot={s.dot} bar={s.bar} bg={s.bg} border={s.border}
            barRate={Math.min(avgRate, 100)}
          />
          {/* 2. 연간 진척율 */}
          <Metric
            label={t(lang, 'annualProgress')}
            value={annualProgressRate.toFixed(1)}
            unit="%"
            sub={`${fmt(cumulativeActual)} / ${fmt(annualTarget)}`}
            color={ps.text} dot={ps.dot} bar={ps.bar} bg={ps.bg} border={ps.border}
            barRate={Math.min(annualProgressRate, 100)}
          />
          {/* 3. 달성과제 */}
          <Metric
            label={lang === 'en' ? 'Achieved Tasks' : '달성 과제'}
            value={achievedCount}
            unit={t(lang, 'count')}
            sub={lang === 'en' ? 'Achievement ≥ 80%' : '달성률 ≥ 80%'}
            color="#15803D" dot="#15803D" bar="#15803D"
            bg="#ECFDF5" border="#A7F3D0"
            barRate={achievedCount + missedCount > 0 ? (achievedCount / (achievedCount + missedCount)) * 100 : 0}
          />
          {/* 4. 미달성과제 */}
          <Metric
            label={lang === 'en' ? 'Missed Tasks' : '미달성 과제'}
            value={missedCount}
            unit={t(lang, 'count')}
            sub={lang === 'en' ? 'Achievement < 80%' : '달성률 < 80%'}
            color="#BE123C" dot="#BE123C" bar="#BE123C"
            bg="#FFF1F2" border="#FECDD3"
            barRate={achievedCount + missedCount > 0 ? (missedCount / (achievedCount + missedCount)) * 100 : 0}
          />
      </div>
    </div>
  )
}

function Metric({ label, value, unit, sub, color, dot, bar, bg, border, barRate }) {
  return (
    <div style={{
      background: bg || '#FFFFFF',
      border: `1px solid ${border || '#E2E8F0'}`,
      borderRadius: 12,
      padding: 12,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: dot, boxShadow: `0 0 6px ${dot}55` }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        <span style={{ fontSize: 15, color: '#94A3B8', fontWeight: 600 }}>{unit}</span>
      </div>
      {barRate != null && (
        <div style={{ height: 4, background: 'rgba(15,23,42,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', borderRadius: 3, width: `${barRate}%`, background: bar, transition: 'width 0.6s' }} />
        </div>
      )}
      <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>{sub}</p>
    </div>
  )
}
