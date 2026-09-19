import { useState } from 'react'
import { ControlPad } from '../components/ControlPad'
import { HeartbeatBadge, RoleBadge, StatusBadge } from '../components/Badges'
import { useSwarm } from '../hooks/useSwarm'

export function Robots() {
  const swarm = useSwarm()
  const [selectedId, setSelectedId] = useState(swarm.robots[0]?.id ?? '')
  const robot = swarm.robots.find((r) => r.id === selectedId) ?? swarm.robots[0]

  return (
    <>
      <div className="page-head">
        <h2>로봇</h2>
        <p>로봇을 선택하면 상세 정보와 수동 조작 패드가 열립니다.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(220px, 300px) 1fr' }}>
        <div className="select-list">
          {swarm.robots.map((r) => (
            <button key={r.id} aria-current={r.id === robot?.id} onClick={() => setSelectedId(r.id)}>
              <span>
                <div style={{ fontWeight: 600 }}>{r.name}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {r.id} · {r.battery}%
                </div>
              </span>
              <RoleBadge role={r.role} />
            </button>
          ))}
        </div>

        {robot && (
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 18 }}>{robot.name}</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  <RoleBadge role={robot.role} />
                  <StatusBadge status={robot.status} />
                </div>
              </div>

              <dl className="kv">
                <dt>Robot ID</dt>
                <dd className="mono">{robot.id}</dd>
                <dt>연결</dt>
                <dd className="mono">{robot.status === 'ONLINE' ? 'CONNECTED' : 'DISCONNECTED'}</dd>
                <dt>Heartbeat</dt>
                <dd>
                  <HeartbeatBadge heartbeat={robot.heartbeat} />
                </dd>
                <dt>배터리</dt>
                <dd className="mono">{robot.battery}%</dd>
                <dt>이동</dt>
                <dd className="mono">{robot.movement}</dd>
                <dt>전방 거리</dt>
                <dd className="mono">{robot.sensors.front} cm</dd>
                <dt>좌측 거리</dt>
                <dd className="mono">{robot.sensors.left} cm</dd>
                <dt>우측 거리</dt>
                <dd className="mono">{robot.sensors.right} cm</dd>
              </dl>
            </div>

            <div className="card">
              <h3 style={{ fontSize: 14, marginBottom: 14 }}>수동 조작 (테스트용)</h3>
              <ControlPad
                movement={robot.movement}
                disabled={robot.status === 'OFFLINE'}
                onCommand={(m) => swarm.setMovement(robot.id, m)}
              />
              {robot.status === 'OFFLINE' && (
                <p style={{ color: 'var(--fail)', fontSize: 13, textAlign: 'center', marginBottom: 0 }}>
                  오프라인 로봇에는 명령을 보낼 수 없습니다.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
