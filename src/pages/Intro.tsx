import { Network } from 'lucide-react'

export function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="intro">
      <div className="intro-card">
        <p className="intro-subtitle">「Dynamic Leader Election 기반 자율 회피 및 제어권 승계 군집 시스템」</p>

        <div className="intro-brand">
          <Network size={28} />
          <h1>SWARM CONTROL</h1>
        </div>

        <p className="intro-credit">
          수원대학교
          <br />
          김민지, 황규원 · 스웜 로봇 시뮬 앱
        </p>

        <button className="btn intro-btn" onClick={onEnter}>
          시작하기
        </button>
      </div>
    </div>
  )
}
