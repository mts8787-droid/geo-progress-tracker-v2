import { MONTHS, STAKEHOLDER_COLORS, SECTION_BAR } from '../utils/constants'
import { t, tSH, tCat, tMonth } from '../../shared/i18n.js'

function _tr(lang, tr, text) { return lang === 'en' && tr && tr[text] ? tr[text] : text }

export default function RawGoalTable({ rows, selectedSH, selectedCategory, lang = 'ko', tr = {} }) {
  let filtered = selectedSH === '전체' ? rows : rows.filter(r => r.stakeholder === selectedSH)
  if (selectedCategory) filtered = filtered.filter(r => r.taskCategory === selectedCategory)

  const computedTotals = {
    monthly: Object.fromEntries(MONTHS.map(m => [
      m, filtered.reduce((s, r) => s + (typeof r.monthly?.[m] === 'number' ? r.monthly[m] : 0), 0)
    ])),
    annual: filtered.reduce((s, r) => s + (typeof r.annual === 'number' ? r.annual : 0), 0),
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ ...SECTION_BAR }} /><h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{t(lang, 'rawGoalTitle')}</h3></div>
      </div>

      <div className="overflow-x-auto">
        <table style={{ width: '100%', fontSize: 16, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'sticky', left: 0, zIndex: 10, background: '#F8FAFC', width: 100, minWidth: 100 }}>{t(lang, 'org')}</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', width: 160, minWidth: 160 }}>{t(lang, 'taskCategory')}</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', width: 240, minWidth: 240 }}>{t(lang, 'task')}</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', width: 140, minWidth: 140 }}>Page Type</th>
              {MONTHS.map(m => (
                <th key={m} style={{ padding: '10px 8px', textAlign: 'right', fontSize: 16, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 52 }}>{tMonth(lang, m)}</th>
              ))}
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 16, fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 60 }}>{t(lang, 'annual')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const color = STAKEHOLDER_COLORS[r.stakeholder] || '#94A3B8'
              return (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-[#F8FAFC] transition-colors">
                  <td style={{ padding: '9px 12px', position: 'sticky', left: 0, zIndex: 10, background: '#fff', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 16, fontWeight: 700, background: color + '18', color: '#111827', border: `1px solid ${color}30` }}>
                      {tSH(lang, r.stakeholder)}
                    </span>
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'center', color: '#64748B' }}>{tCat(lang, r.taskCategory)}</td>
                  <td style={{ padding: '9px 12px', color: '#1E293B', fontWeight: 500 }}>{_tr(lang, tr, r.task)}</td>
                  <td style={{ padding: '9px 12px', color: '#64748B' }}>{r.pageType}</td>
                  {MONTHS.map(m => {
                    const v = r.monthly?.[m]
                    return (
                      <td key={m} style={{ padding: '9px 8px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#475569' }}>
                        {typeof v === 'number' && v > 0 ? v.toLocaleString() : '\u2014'}
                      </td>
                    )
                  })}
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: '#111827' }}>
                    {typeof r.annual === 'number' && r.annual > 0 ? r.annual.toLocaleString() : '\u2014'}
                  </td>
                </tr>
              )
            })}

            {filtered.length > 0 && (
              <tr style={{ background: '#F8FAFC', borderTop: '2px solid #CBD5E1' }}>
                <td style={{ padding: '9px 12px', position: 'sticky', left: 0, zIndex: 10, background: '#F8FAFC', fontWeight: 700, color: '#111827' }} colSpan={4}>{t(lang, 'total')}</td>
                {MONTHS.map(m => {
                  const v = computedTotals.monthly[m]
                  return (
                    <td key={m} style={{ padding: '9px 8px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: '#111827' }}>
                      {v > 0 ? v.toLocaleString() : '\u2014'}
                    </td>
                  )
                })}
                <td style={{ padding: '9px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: '#111827' }}>
                  {computedTotals.annual > 0 ? computedTotals.annual.toLocaleString() : '\u2014'}
                </td>
              </tr>
            )}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4 + MONTHS.length + 1} style={{ padding: '32px 12px', textAlign: 'center', color: '#94A3B8', fontSize: 16 }}>
                  {t(lang, 'noDataForSH')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
