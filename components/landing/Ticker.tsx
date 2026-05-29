const ITEMS = [
  'Tailored questions', 'Behavioral coaching', 'System design prep',
  'Instant scoring', 'Improvement tips', 'STAR framework',
  'Role-matched questions', 'Session history',
]

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div
      className="overflow-hidden whitespace-nowrap py-3"
      style={{ background: 'var(--coral)' }}
      aria-hidden="true"
    >
      <div
        className="inline-flex"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="font-mono text-[11px] font-medium tracking-[0.08em] uppercase px-10" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {item}
            {i < doubled.length - 1 && (
              <span className="ml-10" style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
