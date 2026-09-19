import { EventLog } from '../components/EventLog'
import { useSwarm } from '../hooks/useSwarm'

export function Events() {
  const swarm = useSwarm()

  return (
    <>
      <div className="page-head">
        <h2>이벤트 기록</h2>
        <p>연결, 장애 감지, 선출, 제어권 승계가 발생한 순서대로 쌓입니다. 최신 항목이 위에 있습니다.</p>
      </div>
      <EventLog events={swarm.events} />
    </>
  )
}
