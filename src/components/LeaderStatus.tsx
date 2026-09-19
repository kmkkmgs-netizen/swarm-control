import { Crown } from 'lucide-react'
import type { Robot, SwarmStatus } from '../types/robot'

export function LeaderStatus({ leader, swarmStatus }: { leader: Robot | null; swarmStatus: SwarmStatus }) {
  if (!leader) {
    return (
      <div className="card">
        <div className="stat">
          <div className="label">현재 Leader</div>
          <div className="value sm" style={{ color: 'var(--fail)' }}>
            없음
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card robot-card is-leader">
      <header>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Crown size={18} color="var(--leader)" />
          {leader.name}
        </h4>
        <span className="badge leader">CURRENT LEADER</span>
      </header>
      <div className="rows">
        <div className="row">
          <span>Swarm 상태</span>
          <span className="mono">{swarmStatus}</span>
        </div>
        <div className="row">
          <span>Heartbeat</span>
          <span className="mono">{leader.heartbeat}</span>
        </div>
        <div className="row">
          <span>배터리</span>
          <span className="mono">{leader.battery}%</span>
        </div>
      </div>
    </div>
  )
}
