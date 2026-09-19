import { useState } from 'react'
import { Activity, Cpu, LayoutDashboard, Network, Settings as SettingsIcon } from 'lucide-react'
import { Dashboard } from './pages/Dashboard'
import { Robots } from './pages/Robots'
import { Swarm } from './pages/Swarm'
import { Events } from './pages/Events'
import { Settings } from './pages/Settings'
import { Intro } from './pages/Intro'

type PageKey = 'dashboard' | 'robots' | 'swarm' | 'events' | 'settings'

const PAGES = [
  { key: 'dashboard', label: '대시보드', icon: LayoutDashboard, render: () => <Dashboard /> },
  { key: 'robots', label: '로봇', icon: Cpu, render: () => <Robots /> },
  { key: 'swarm', label: '군집', icon: Network, render: () => <Swarm /> },
  { key: 'events', label: '이벤트', icon: Activity, render: () => <Events /> },
  { key: 'settings', label: '설정', icon: SettingsIcon, render: () => <Settings /> },
] as const

export default function App() {
  const [entered, setEntered] = useState(false)
  const [page, setPage] = useState<PageKey>('dashboard')
  const current = PAGES.find((p) => p.key === page) ?? PAGES[0]

  if (!entered) {
    return <Intro onEnter={() => setEntered(true)} />
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <h1>SWARM CONTROL</h1>
          <p>Dynamic Leader Election</p>
        </div>

        <nav className="nav">
          {PAGES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              aria-current={key === page ? 'page' : undefined}
              onClick={() => setPage(key)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-foot">Mock 데이터로 동작 중</div>
      </aside>

      <main className="main">{current.render()}</main>
    </div>
  )
}
