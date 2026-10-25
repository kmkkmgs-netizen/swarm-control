// src/services/esp32Service.ts
import type { CommunicationService } from './communicationService'
import type { Movement, Robot, SwarmConfig, SwarmEvent, SwarmState } from '../types/robot'
import { initialConfig, initialRobots } from '../data/mockRobots'

type Listener = (state: SwarmState) => void

const now = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// 브릿지 서버 주소 (이 앱과 브릿지를 같은 노트북에서 돌릴 때)
const BRIDGE_URL = 'ws://localhost:8080'

// 로봇이 배터리를 전압(예: 3.7)으로 보내면 %로 변환, 이미 %면 그대로 사용
const toPercent = (v: number) =>
  v <= 10 ? Math.max(0, Math.min(100, Math.round(((v - 3.0) / (4.2 - 3.0)) * 100))) : v

class Esp32Service implements CommunicationService {
  private state: SwarmState = {
    robots: initialRobots.map((r) => ({ ...r, status: 'OFFLINE' as const })), // 연결 전엔 전부 OFFLINE
    swarmStatus: 'NORMAL',
    electionStatus: 'IDLE',
    electionStep: 0,
    newLeaderId: null,
    events: [],
    config: { ...initialConfig },
  }
  private listeners = new Set<Listener>()
  private eventId = 0
  private ws: WebSocket | null = null

  constructor() {
    this.connect()
  }

  private connect() {
    this.ws = new WebSocket(BRIDGE_URL)

    this.ws.onopen = () => {
      this.log({ type: 'SYSTEM', robotId: null, message: '브릿지 서버에 연결됨' })
    }

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        this.handleMessage(msg)
      } catch (e) {
        console.error('메시지 파싱 실패:', event.data)
      }
    }

    this.ws.onclose = () => {
      this.log({ type: 'SYSTEM', robotId: null, message: '브릿지 서버 연결 끊김, 재연결 시도...' })
      setTimeout(() => this.connect(), 3000)
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  // "robotId=01,role=follower,battery=3.7,status=ok" 같은 문자열을 객체로 변환
  private parseRobotData(raw: string): Record<string, string> {
    const result: Record<string, string> = {}
    raw.split(',').forEach((pair) => {
      const [key, value] = pair.split('=')
      if (key && value !== undefined) result[key.trim()] = value.trim()
    })
    return result
  }

  private handleMessage(msg: { type: string; data?: string; status?: string; robotId?: string }) {
    // 로봇이 보낸 상태 한 줄
    if (msg.type === 'robot' && msg.data) {
      const parsed = this.parseRobotData(msg.data)
      if (!parsed.robotId) return

      const id = `R${parsed.robotId}` // "01" -> "R01"
      if (!this.state.robots.some((r) => r.id === id)) return

      this.state.robots = this.state.robots.map((r) => {
        if (r.id !== id) return r
        const next: Robot = { ...r, heartbeat: 'ACTIVE' }
        if (parsed.role) next.role = parsed.role.toUpperCase() as Robot['role']
        if (parsed.battery) next.battery = toPercent(Number(parsed.battery))
        if (parsed.status) next.status = parsed.status === 'ok' ? 'ONLINE' : 'OFFLINE'
        return next
      })
      this.emit()
    }

    // 브릿지가 알려주는 로봇별 연결/끊김
    if (msg.type === 'esp32') {
      const id = msg.robotId ? `R${msg.robotId}` : null

      if (id && msg.status === 'disconnected') {
        this.state.robots = this.state.robots.map((r) =>
          r.id === id ? { ...r, status: 'OFFLINE' as const } : r,
        )
      }

      this.log({
        type: msg.status === 'connected' ? 'CONNECT' : 'SYSTEM',
        robotId: id,
        message: msg.status === 'connected' ? '로봇 연결됨' : '로봇 연결 끊김',
      })
    }
  }

  /* ---------- CommunicationService 구현 ---------- */

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getState = (): SwarmState => this.state

  private emit() {
    this.state = { ...this.state }
    this.listeners.forEach((l) => l(this.state))
  }

  private log(event: Omit<SwarmEvent, 'id' | 'time'>) {
    const entry: SwarmEvent = { id: ++this.eventId, time: now(), ...event }
    this.state.events = [entry, ...this.state.events]
    this.emit()
  }

  setMovement = (robotId: string, movement: Movement) => {
    const commandMap: Record<Movement, string> = {
      STOP: 'DTS',
      FORWARD: 'forward',
      BACKWARD: 'backward',
      LEFT: 'left 10',
      RIGHT: 'right 10',
    }
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ robotId: robotId.replace('R', ''), command: commandMap[movement] }))
    }
  }

  // 실제 로봇 모드에서는 아직 자동 판단 로직이 없어서 동작 없음 (Election 로직 붙일 때 구현)
  simulateLeaderFailure = () => {
    console.warn('실제 로봇 모드에서는 Leader Failure를 수동으로 시뮬레이션할 수 없습니다.')
  }

  updateConfig = (config: Partial<SwarmConfig>) => {
    this.state.config = { ...this.state.config, ...config }
    this.emit()
  }

  reset = () => {
    console.warn('실제 로봇 모드에서는 reset이 지원되지 않습니다.')
  }
}

export const esp32Service = new Esp32Service()