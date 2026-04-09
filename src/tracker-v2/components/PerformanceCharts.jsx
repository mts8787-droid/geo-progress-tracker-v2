import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { SECTION_BAR } from '../utils/constants'
import { t, tMonth } from '../../shared/i18n.js'

const FONT = "'LG Smart','Arial Narrow',Arial,sans-serif"
const RED = '#CF0652'
const BLUE = '#475569'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 16, fontFamily: FONT }}>
      <p style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        p.value != null && (
          <p key={i} style={{ color: p.color, margin: '2px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            {p.name}: <strong>{Number(p.value).toLocaleString()}</strong>
          </p>
        )
      ))}
    </div>
  )
}

export default function PerformanceCharts({ monthlyTotals, cumulative, annualTarget, selectedMonth, lang = 'ko' }) {
  const localizedMonthly = monthlyTotals.map(d => ({ ...d, month: tMonth(lang, d.month) }))
  const localizedCum = cumulative.map(d => ({ ...d, month: tMonth(lang, d.month) }))
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 월별 목표 대비 실적 */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><span style={SECTION_BAR} /><h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>{t(lang, 'monthlyGoalVsActual')}</h3></div>
        <ResponsiveContainer width="100%" height={170}>
          <ComposedChart data={localizedMonthly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 16, fontFamily: FONT }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 16, fontFamily: FONT }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 16, fontFamily: FONT, paddingBottom: 8 }} iconType="circle" iconSize={7} />
            <Bar dataKey="actual" name={t(lang, 'actual')} fill={RED} radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Line dataKey="goal" name={t(lang, 'goal')} type="monotone" stroke="#111827" strokeWidth={2} dot={{ r: 3.5, fill: '#111827', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 연간 누적 목표대비 실적 */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={SECTION_BAR} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>{t(lang, 'cumulativeGoalVsActual')}</h3>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <ComposedChart data={localizedCum} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 16, fontFamily: FONT }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 16, fontFamily: FONT }} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 16, fontFamily: FONT, paddingBottom: 8 }} iconType="circle" iconSize={7} />
            <Line dataKey="cumGoal" name={t(lang, 'cumGoal')} type="monotone" stroke="#111827" strokeWidth={2} dot={{ r: 3.5, fill: '#111827', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} connectNulls />
            <Bar dataKey="cumActual" name={t(lang, 'cumActual')} fill={RED} radius={[4, 4, 0, 0]} maxBarSize={36} fillOpacity={0.85} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
