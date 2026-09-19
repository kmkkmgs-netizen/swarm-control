import type { EventType, SwarmEvent } from '../types/robot'

const tone: Record<EventType, string> = {
  CONNECT: 'var(--ok)',
  HEARTBEAT_TIMEOUT: 'var(--fail)',
  FAILURE_DETECTED: 'var(--fail)',
  ELECTION_START: 'var(--warn)',
  LEADER_ELECTED: 'var(--leader)',
  CONTROL_TRANSFER: 'var(--leader)',
  RECOVERED: 'var(--ok)',
  COMMAND: 'var(--muted)',
  SYSTEM: 'var(--muted)',
}

export function EventLog({ events, limit }: { events: SwarmEvent[]; limit?: number }) {
  const list = limit ? events.slice(0, limit) : events

  if (list.length === 0) {
    return <div className="card" style={{ color: 'var(--muted)' }}>기록된 이벤트가 없습니다.</div>
  }

  return (
    <div className="card log">
      {list.map((e) => (
        <div className="log-item" key={e.id}>
          <span className="log-time mono">{e.time}</span>
          <span className="log-tag mono" style={{ color: tone[e.type] }}>
            {e.type}
          </span>
          <span className="log-msg">{e.message}</span>
          <span className="log-time mono">{e.robotId ?? '—'}</span>
        </div>
      ))}
    </div>
  )
}
