import { ElectionFlow } from '../components/ElectionFlow'
import { SwarmDiagram } from '../components/SwarmDiagram'
import { useSwarm } from '../hooks/useSwarm'

export function Swarm() {
  const swarm = useSwarm()
  const newLeader = swarm.robots.find((r) => r.id === swarm.newLeaderId)

  return (
    <>
      <div className="page-head">
        <h2>군집 구조</h2>
        <p>Leader 와 Follower 의 관계, 그리고 승계 이후의 변화를 보여줍니다.</p>
      </div>

      <div className="grid grid-2">
        <SwarmDiagram robots={swarm.robots} />

        <div className="card">
          <h3 style={{ fontSize: 14, marginBottom: 14 }}>군집 상태</h3>
          <dl className="kv">
            <dt>현재 Leader</dt>
            <dd>{swarm.leader?.name ?? '없음'}</dd>
            <dt>Followers</dt>
            <dd>{swarm.followers.map((r) => r.name).join(', ') || '없음'}</dd>
            <dt>연결된 로봇</dt>
            <dd className="mono">
              {swarm.onlineCount} / {swarm.robots.length}
            </dd>
            <dt>Swarm 상태</dt>
            <dd className="mono">{swarm.swarmStatus}</dd>
            <dt>Election 상태</dt>
            <dd className="mono">{swarm.electionStatus}</dd>
          </dl>
        </div>
      </div>

      <div className="section">
        <ElectionFlow step={swarm.electionStep} newLeaderName={newLeader?.name} />
      </div>
    </>
  )
}
