import type { Heartbeat, Role, Status } from '../types/robot'

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`badge ${role === 'LEADER' ? 'leader' : 'follower'}`}>
      {role === 'LEADER' ? 'LEADER' : 'FOLLOWER'}
    </span>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  const online = status === 'ONLINE'
  return (
    <span className={`badge ${online ? 'ok' : 'fail'}`}>
      <i className="dot" />
      {online ? 'ONLINE' : 'OFFLINE'}
    </span>
  )
}

export function HeartbeatBadge({ heartbeat }: { heartbeat: Heartbeat }) {
  return (
    <span className={`badge ${heartbeat === 'ACTIVE' ? 'ok' : 'fail'}`}>
      {heartbeat === 'ACTIVE' ? 'ACTIVE' : 'TIMEOUT'}
    </span>
  )
}
