// 일관된 섹션 헤더 — 제목 + 부제 inline, 검은색 통일, 실선 구분선
export default function SectionHeader({ title, subtitle, color = '#0F172A', dividerColor = '#E2E8F0', accentBar = false, legend = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
          {accentBar && (
            <span style={{
              alignSelf: 'center',
              display: 'inline-block',
              width: 5,
              height: 24,
              background: '#CF0652',
              borderRadius: 3,
              flexShrink: 0,
            }} />
          )}
          <h2 style={{
            margin: 0, fontSize: 22, fontWeight: 900, color,
            letterSpacing: '-0.01em',
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{
              margin: 0,
              fontSize: 13, color: color === '#FFFFFF' ? 'rgba(255,255,255,0.6)' : '#64748B',
              lineHeight: 1.5,
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {legend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#64748B' }}>
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
        )}
      </div>
      <div style={{
        marginTop: 10,
        height: 1,
        background: dividerColor,
      }} />
    </div>
  )
}
