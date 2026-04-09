import { MONTHS, STAKEHOLDER_COLORS } from '../utils/constants'

function formatCell(v) {
  if (v === '' || v === null || v === undefined) return <span className="text-slate-600">-</span>
  if (typeof v === 'string' && v.endsWith('%')) {
    const num = parseFloat(v)
    const color = num >= 100 ? 'text-emerald-400' : num >= 50 ? 'text-amber-400' : 'text-red-400'
    return <span className={`font-semibold ${color}`}>{v}</span>
  }
  if (typeof v === 'number') return v.toLocaleString()
  return v
}

function StakeholderBadge({ name }) {
  const color = STAKEHOLDER_COLORS[name] || '#94A3B8'
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap"
      style={{ backgroundColor: color + '18', color: '#111827', border: `1px solid ${color}30` }}
    >
      {name}
    </span>
  )
}

export default function KPITable({ title, rows, totals, showMonthly = false, isQualitative = false }) {
  if (!rows || rows.length === 0) return null

  return (
    <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <span className="text-[11px] text-slate-500">{rows.length}개 항목</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-800/50 text-[11px] text-slate-400 uppercase tracking-wider">
              <th className="px-3 py-2.5 text-left sticky left-0 z-10 bg-slate-800/90 backdrop-blur min-w-[80px]">
                Stakeholder
              </th>
              <th className="px-3 py-2.5 text-left min-w-[160px]">과제</th>
              <th className="px-3 py-2.5 text-left min-w-[90px]">Page Type</th>
              <th className="px-3 py-2.5 text-left min-w-[200px]">목표 상세</th>
              {showMonthly && (
                <>
                  {!isQualitative && (
                    <th className="px-3 py-2.5 text-right min-w-[70px] bg-slate-700/20 border-l border-slate-700/30">
                      연간
                    </th>
                  )}
                  {MONTHS.map(m => (
                    <th key={m} className={`px-3 py-2.5 text-right min-w-[55px] ${isQualitative ? 'min-w-[80px]' : ''}`}>{m}</th>
                  ))}
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-3 py-2 sticky left-0 z-10 bg-slate-900">
                  <StakeholderBadge name={row.stakeholder} />
                </td>
                <td className="px-3 py-2 text-slate-300 font-medium">{row.task}</td>
                <td className="px-3 py-2 text-slate-400">{row.pageType}</td>
                <td className="px-3 py-2 text-slate-300 max-w-[350px]">
                  <span className="block truncate" title={row.detail}>{row.detail}</span>
                </td>
                {showMonthly && (
                  <>
                    {!isQualitative && (
                      <td className="px-3 py-2 text-right font-semibold text-slate-200 bg-slate-800/10 border-l border-slate-700/20">
                        {formatCell(row.annual)}
                      </td>
                    )}
                    {MONTHS.map(m => (
                      <td key={m} className="px-3 py-2 text-right text-slate-300">
                        {formatCell(row.monthly?.[m])}
                      </td>
                    ))}
                  </>
                )}
              </tr>
            ))}

            {/* Total row */}
            {totals && (
              <tr className="bg-slate-800/40 border-t-2 border-slate-700">
                <td colSpan={4} className="px-3 py-2.5 font-bold text-slate-200 sticky left-0 z-10 bg-slate-800/40">
                  Total
                </td>
                {showMonthly && (
                  <>
                    <td className="px-3 py-2.5 text-right font-bold text-white bg-slate-700/20 border-l border-slate-700/30">
                      {formatCell(totals.annual)}
                    </td>
                    {MONTHS.map(m => (
                      <td key={m} className="px-3 py-2.5 text-right font-semibold text-slate-200">
                        {formatCell(totals.monthly[m])}
                      </td>
                    ))}
                  </>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
