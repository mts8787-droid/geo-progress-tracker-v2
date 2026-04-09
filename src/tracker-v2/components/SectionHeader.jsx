// 일관된 섹션 헤더 — 제목 + 부제 inline, 검은색 통일, 실선 구분선
export default function SectionHeader({ title, subtitle, color = '#0F172A', dividerColor = '#E2E8F0' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
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
      <div style={{
        marginTop: 10,
        height: 1,
        background: dividerColor,
      }} />
    </div>
  )
}
