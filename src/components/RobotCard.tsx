import { HeartbeatBadge, RoleBadge, StatusBadge } from './Badges'
import type { Robot } from '../types/robot'

interface Props {
  robot: Robot
  onClick?: () => void
}

export function RobotCard({ robot, onClick }: Props) {
  const offline = robot.status === 'OFFLINE'
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className={`card robot-card ${robot.role === 'LEADER' ? 'is-leader' : ''} ${offline ? 'is-offline' : ''}`}
      onClick={onClick}
      style={onClick ? { textAlign: 'left', width: '100%' } : undefined}
    >
      <header>
        <h4>{robot.name}</h4>
        <RoleBadge role={robot.role} />
      </header>

      <div className="rows">
        <div className="row">
          <span>상태</span>
          <StatusBadge status={robot.status} />
        </div>
        <div className="row">
          <span>Heartbeat</span>
          <HeartbeatBadge heartbeat={robot.heartbeat} />
        </div>
        <div className="row">
          <span>이동</span>
          <span className="mono">{robot.movement}</span>
        </div>
        <div className="row">
          <span>센서 (전/좌/우)</span>
          <span className="mono">
            {robot.sensors.front} / {robot.sensors.left} / {robot.sensors.right} cm
          </span>
        </div>
        <div className="row">
          <span>배터리</span>
          <span className="mono">{robot.battery}%</span>
        </div>
        <div className="bar">
          <i className={robot.battery < 30 ? 'low' : ''} style={{ width: `${robot.battery}%` }} />
        </div>
      </div>
    </Tag>
  )
}
