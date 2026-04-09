import { STAKEHOLDER_COLORS, SECTION_BAR, statusOf } from '../utils/constants'
import { t, tSH, tMonth } from '../../shared/i18n.js'

function fmt(n) { return Number(n).toLocaleString('en-US') }

function _tr(lang, tr, text) { return lang === 'en' && tr && tr[text] ? tr[text] : text }

export default function StakeholderRanking({ stakeholders, month, selectedSH, lang = 'ko', tr = {} }) {
  const filtered = selectedSH === '전체' ? stakeholders : stakeholders.filter(s => s.name === selectedSH)
  const totalWarnings = filtered.reduce((s, sh) => s + sh.warnings, 0)

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={SECTION_BAR} />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{t(lang, 'orgRate')}</h3>
          {totalWarnings > 0 && (
            <span style={{ fontSize: 16, fontWeight: 700, color: '#BE123C', background: '#FFF1F2', border: '1px solid #FECDD3', padding: '2px 8px', borderRadius: 4 }}>
              {t(lang, 'belowTasks', totalWarnings)}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: '#64748B' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#15803D', display: 'inline-block' }} /> ≥100%</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706', display: 'inline-block' }} /> ≥80%</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#BE123C', display: 'inline-block' }} /> {'<80%'}</span>
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 240px 40px 240px', gap: 0, padding: '10px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#475569', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t(lang, 'org')}</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#475569', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t(lang, 'taskStatus')}</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#475569', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t(lang, 'monthlyRate', tMonth(lang, month))}</span>
        <span />
        <span style={{ fontSize: 16, fontWeight: 600, color: '#475569', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t(lang, 'cumulativeRate')}</span>
      </div>

      {/* Stakeholder rows */}
      <div style={{ padding: '0 20px 12px' }}>
        {filtered.map(sh => {
          const color = STAKEHOLDER_COLORS[sh.name] || '#94A3B8'
          const mSt = statusOf(sh.monthRate)
          const cSt = statusOf(sh.cumRate)
          const monthBarW = Math.min(sh.monthRate, 100)
          const cumBarW = Math.min(sh.cumRate, 100)

          return (
            <div key={sh.name} style={{ borderBottom: '1px solid #F1F5F9', padding: '14px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 240px 40px 240px', gap: 0, alignItems: 'center' }}>
                {/* Stakeholder badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 5, fontSize: 16, fontWeight: 700, background: color + '18', color: '#111827', border: `1px solid ${color}30`, textAlign: 'center' }}>
                    {tSH(lang, sh.name)}
                  </span>
                </div>

                {/* Task details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', fontSize: 16, color: '#475569' }}>
                  {(sh.taskDetails || []).map((td, i) => {
                    const tdSt = td.rate !== null ? statusOf(td.rate) : { color: '#94A3B8', dot: '#CBD5E1' }
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', background: '#F8FAFC', borderRadius: 4, border: '1px solid #F1F5F9' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: tdSt.dot, display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ color: '#111827', fontWeight: 500, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 16 }} title={_tr(lang, tr, td.task)}>{_tr(lang, tr, td.task)}</span>
                        <span style={{ fontSize: 14, color: '#64748B', whiteSpace: 'nowrap' }}>{fmt(td.monthActual)}/{fmt(td.monthGoal)}</span>
                        {td.rate !== null && (
                          <span style={{ fontWeight: 700, color: tdSt.text, fontSize: 16 }}>{td.rate.toFixed(0)}%</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Month rate column */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ flex: 1, height: 18, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden', position: 'relative', minWidth: 50 }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${monthBarW}%`, background: mSt.dot, transition: 'width 0.7s ease-out' }} />
                  </div>
                  <span style={{ fontSize: 14, color: '#475569', whiteSpace: 'nowrap', textAlign: 'center', fontVariantNumeric: 'tabular-nums', width: 60, flexShrink: 0 }}>
                    {fmt(sh.monthActual)}/{fmt(sh.monthGoal)}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: mSt.text, width: 50, flexShrink: 0, textAlign: 'left', fontVariantNumeric: 'tabular-nums' }}>
                    {sh.monthRate.toFixed(1)}%
                  </span>
                </div>

                <div />

                {/* Cumulative rate column */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ flex: 1, height: 18, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden', position: 'relative', minWidth: 50 }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${cumBarW}%`, background: cSt.dot, transition: 'width 0.7s ease-out' }} />
                  </div>
                  <span style={{ fontSize: 14, color: '#475569', whiteSpace: 'nowrap', textAlign: 'center', fontVariantNumeric: 'tabular-nums', width: 60, flexShrink: 0 }}>
                    {fmt(sh.cumActual)}/{fmt(sh.cumGoal)}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: cSt.text, width: 50, flexShrink: 0, textAlign: 'left', fontVariantNumeric: 'tabular-nums' }}>
                    {sh.cumRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94A3B8', padding: '16px 0', fontSize: 16 }}>{t(lang, 'noStakeholder')}</p>
        )}
      </div>
    </div>
  )
}
