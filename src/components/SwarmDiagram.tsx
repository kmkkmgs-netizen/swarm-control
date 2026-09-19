import { Crown } from 'lucide-react'
import type { Robot } from '../types/robot'

function Node({ robot }: { robot: Robot }) {
  const offline = robot.status === 'OFFLINE'
  const leader = robot.role === 'LEADER'
  return (
    <div className={`node ${leader ? 'leader' : ''} ${offline ? 'offline' : ''}`}>
      {leader && <Crown size={16} color="var(--leader)" />}
      <div className="name">{robot.name}</div>
      <div className="role mono">{offline ? 'OFFLINE' : robot.role}</div>
    </div>
  )
}

export function SwarmDiagram({ robots }: { robots: Robot[] }) {
  const leader = robots.find((r) => r.role === 'LEADER')
  const others = robots.filter((r) => r.role !== 'LEADER')

  return (
    <div className="card">
      <div className="diagram">
        {leader ? <Node robot={leader} /> : <div className="node offline">Leader 없음</div>}
        <div className="connector" />
        <div className="branch">
          {others.map((r) => (
            <div key={r.id}>
              <div className="connector" />
              <Node robot={r} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
