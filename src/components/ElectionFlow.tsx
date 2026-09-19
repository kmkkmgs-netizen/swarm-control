import type { ElectionStep } from '../types/robot'

const STEPS = [
  'Leader heartbeat timeout',
  'Leader 장애 감지',
  'Leader election 시작',
  '새 Leader 선출',
  '제어권 승계',
  '군집 복구 완료',
]

export function ElectionFlow({ step, newLeaderName }: { step: ElectionStep; newLeaderName?: string | null }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: 14, marginBottom: 14 }}>Leader Election 진행</h3>
      <div className="flow">
        {STEPS.map((label, i) => {
          const index = i + 1
          const state = step > index ? 'done' : step === index ? 'active' : ''
          const text = index === 4 && newLeaderName ? `새 Leader 선출 — ${newLeaderName}` : label
          return (
            <div key={label} className={`flow-step ${state}`}>
              <div className="flow-marker">
                <div className="ring" />
                {i < STEPS.length - 1 && <div className="line" />}
              </div>
              <div className="flow-body">{text}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
