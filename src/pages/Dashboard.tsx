import { AlertTriangle, CheckCircle2, RotateCcw, Zap } from 'lucide-react'
import { EventLog } from '../components/EventLog'
import { ElectionFlow } from '../components/ElectionFlow'
import { LeaderStatus } from '../components/LeaderStatus'
import { RobotCard } from '../components/RobotCard'
import { StatusCard } from '../components/StatusCard'
import { useSwarm } from '../hooks/useSwarm'

export function Dashboard() {
  const swarm = useSwarm()
  const failing = swarm.swarmStatus === 'LEADER_FAILURE'
  const recovered = swarm.swarmStatus === 'RECOVERED'
  const newLeader = swarm.robots.find((r) => r.id === swarm.newLeaderId)

  return (
    <>
      <div className="page-head">
        <h2>대시보드</h2>
        <p>군집 전체 상태와 Leader 승계 과정을 한 화면에서 확인합니다.</p>
      </div>

      {failing && (
        <div className="alert fail">
          <AlertTriangle size={18} />
          Leader 장애 감지 — heartbeat timeout
          {swarm.electionStatus === 'IN_PROGRESS' && ' · Leader election 진행 중'}
        </div>
      )}
      {recovered && (
        <div className="alert ok">
          <CheckCircle2 size={18} />
          제어권 승계 완료 — {newLeader?.name} 이 새 Leader 입니다.
        </div>
      )}

      <div className="grid grid-4">
        <StatusCard label="전체 로봇" value={swarm.robots.length} />
        <StatusCard
          label="온라인"
          value={`${swarm.onlineCount} / ${swarm.robots.length}`}
          tone={swarm.onlineCount === swarm.robots.length ? 'ok' : 'fail'}
        />
        <StatusCard label="현재 Leader" value={swarm.leader?.name ?? '없음'} small />
        <StatusCard
          label="Swarm 상태"
          value={swarm.swarmStatus}
          small
          tone={failing ? 'fail' : recovered ? 'warn' : 'ok'}
        />
      </div>

      <div className="section">
        <div className="btn-row">
          <button
            className="btn danger"
            onClick={() => void swarm.simulateLeaderFailure()}
            disabled={swarm.leader === null || failing || recovered}
          >
            <Zap size={16} /> Leader 장애 시뮬레이션
          </button>
          <button className="btn" onClick={swarm.reset}>
            <RotateCcw size={16} /> 초기 상태로 되돌리기
          </button>
        </div>
      </div>

      <div className="section grid grid-2">
        <LeaderStatus leader={swarm.leader} swarmStatus={swarm.swarmStatus} />
        <ElectionFlow step={swarm.electionStep} newLeaderName={newLeader?.name} />
      </div>

      <div className="section">
        <h3>로봇 상태</h3>
        <div className="grid grid-3">
          {swarm.robots.map((r) => (
            <RobotCard key={r.id} robot={r} />
          ))}
        </div>
      </div>

      <div className="section">
        <h3>최근 이벤트</h3>
        <EventLog events={swarm.events} limit={6} />
      </div>
    </>
  )
}
