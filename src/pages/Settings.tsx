import { RoleBadge } from '../components/Badges'
import { useSwarm } from '../hooks/useSwarm'

export function Settings() {
  const swarm = useSwarm()

  return (
    <>
      <div className="page-head">
        <h2>설정</h2>
        <p>지금은 화면에만 반영됩니다. 실제 통신을 연결하면 ESP32 로 전달할 값입니다.</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 14 }}>로봇 구성</h3>
          <div className="select-list">
            {swarm.robots.map((r) => (
              <div key={r.id} className="row" style={{ padding: '8px 0' }}>
                <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{r.name}</span>
                <RoleBadge role={r.role} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 14 }}>Heartbeat</h3>
          <div className="kv">
            <label htmlFor="interval" style={{ color: 'var(--muted)' }}>
              전송 주기 (ms)
            </label>
            <input
              id="interval"
              type="number"
              step={100}
              min={100}
              value={swarm.config.heartbeatInterval}
              onChange={(e) => swarm.updateConfig({ heartbeatInterval: Number(e.target.value) })}
            />
            <label htmlFor="timeout" style={{ color: 'var(--muted)' }}>
              타임아웃 (ms)
            </label>
            <input
              id="timeout"
              type="number"
              step={100}
              min={100}
              value={swarm.config.heartbeatTimeout}
              onChange={(e) => swarm.updateConfig({ heartbeatTimeout: Number(e.target.value) })}
            />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 0 }}>
            타임아웃은 전송 주기보다 크게 설정합니다. 보통 3배 정도를 사용합니다.
          </p>
        </div>
      </div>
    </>
  )
}
