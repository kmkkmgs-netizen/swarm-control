interface Props {
  label: string
  value: string | number
  tone?: 'default' | 'ok' | 'warn' | 'fail'
  small?: boolean
}

const toneColor: Record<string, string | undefined> = {
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  fail: 'var(--fail)',
}

export function StatusCard({ label, value, tone = 'default', small }: Props) {
  return (
    <div className="card stat">
      <div className="label">{label}</div>
      <div className={`value ${small ? 'sm' : ''}`} style={{ color: toneColor[tone] }}>
        {value}
      </div>
    </div>
  )
}
