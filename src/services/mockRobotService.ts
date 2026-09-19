import { initialConfig, initialRobots } from '../data/mockRobots'
import type {
  ElectionStep,
  Movement,
  Robot,
  SwarmConfig,
  SwarmEvent,
  SwarmState,
} from '../types/robot'

type Listener = (state: SwarmState) => void

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const now = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock 구현체.
 * 나중에 esp32Service 로 교체할 수 있도록 UI 는 이 파일을 직접 import 하지 않고
 * robotService 를 통해서만 접근한다.
 */
class MockRobotService {
  private state: SwarmState = this.createInitialState()
  private listeners = new Set<Listener>()
  private eventId = 0
  private running = false

  private createInitialState(): SwarmState {
    return {
      robots: clone(initialRobots),
      swarmStatus: 'NORMAL',
      electionStatus: 'IDLE',
      electionStep: 0,
      newLeaderId: null,
      events: [],
      config: clone(initialConfig),
    }
  }

  constructor() {
    this.seedEvents()
  }

  /* ---------- 구독 ---------- */

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getState = (): SwarmState => this.state

  private emit() {
    this.state = { ...this.state }
    this.listeners.forEach((l) => l(this.state))
  }

  private log(event: Omit<SwarmEvent, 'id' | 'time'> & { time?: string }) {
    const entry: SwarmEvent = {
      id: ++this.eventId,
      time: event.time ?? now(),
      type: event.type,
      robotId: event.robotId,
      message: event.message,
    }
    this.state.events = [entry, ...this.state.events]
  }

  private seedEvents() {
    this.state.events = []
    this.eventId = 0
    this.log({ type: 'CONNECT', robotId: 'R01', message: 'Robot 01 연결됨' })
    this.log({ type: 'CONNECT', robotId: 'R02', message: 'Robot 02 연결됨' })
    this.log({ type: 'CONNECT', robotId: 'R03', message: 'Robot 03 연결됨' })
    this.log({ type: 'LEADER_ELECTED', robotId: 'R01', message: 'Robot 01 이 Leader 로 선출됨' })
    this.log({ type: 'SYSTEM', robotId: null, message: '군집 초기화 완료 (3 / 3 연결)' })
  }

  /* ---------- 수동 조작 ---------- */

  setMovement = (robotId: string, movement: Movement) => {
    const robot = this.state.robots.find((r) => r.id === robotId)
    if (!robot || robot.status === 'OFFLINE') return
    robot.movement = movement
    this.log({ type: 'COMMAND', robotId, message: `${robot.name} 이동 명령: ${movement}` })
    this.emit()
  }

  updateConfig = (config: Partial<SwarmConfig>) => {
    this.state.config = { ...this.state.config, ...config }
    this.emit()
  }

  /* ---------- Leader Election ---------- */

  /** 온라인 상태인 Follower 중 ID 가 가장 작은 로봇을 새 Leader 로 선출한다. */
  private pickNewLeader(): Robot | undefined {
    return this.state.robots
      .filter((r) => r.status === 'ONLINE' && r.role !== 'LEADER')
      .sort((a, b) => a.id.localeCompare(b.id))[0]
  }

  private setStep(step: ElectionStep) {
    this.state.electionStep = step
    this.emit()
  }

  simulateLeaderFailure = async () => {
    if (this.running) return
    const leader = this.state.robots.find((r) => r.role === 'LEADER')
    if (!leader || leader.status === 'OFFLINE') return
    this.running = true

    // Step 1 — Heartbeat Timeout
    leader.heartbeat = 'TIMEOUT'
    leader.status = 'OFFLINE'
    leader.movement = 'STOP'
    this.state.swarmStatus = 'LEADER_FAILURE'
    this.log({
      type: 'HEARTBEAT_TIMEOUT',
      robotId: leader.id,
      message: `${leader.name} heartbeat timeout (${this.state.config.heartbeatTimeout}ms 초과)`,
    })
    this.setStep(1)
    await wait(900)

    // Step 2 — Failure Detected
    this.log({ type: 'FAILURE_DETECTED', robotId: leader.id, message: 'Leader 장애 감지' })
    this.setStep(2)
    await wait(800)

    // Step 3 — Election Started
    this.state.electionStatus = 'IN_PROGRESS'
    this.log({ type: 'ELECTION_START', robotId: null, message: 'Leader election 시작' })
    this.setStep(3)
    await wait(1000)

    // Step 4 — New Leader Selected
    const next = this.pickNewLeader()
    if (!next) {
      this.running = false
      return
    }
    next.role = 'LEADER'
    leader.role = 'FOLLOWER'
    this.state.newLeaderId = next.id
    this.log({ type: 'LEADER_ELECTED', robotId: next.id, message: `${next.name} 이 새 Leader 로 선출됨` })
    this.setStep(4)
    await wait(900)

    // Step 5 — Control Transfer
    this.state.electionStatus = 'COMPLETED'
    this.log({ type: 'CONTROL_TRANSFER', robotId: next.id, message: '제어권 승계 완료' })
    this.setStep(5)
    await wait(700)

    // Step 6 — Recovered
    this.state.swarmStatus = 'RECOVERED'
    this.log({ type: 'RECOVERED', robotId: null, message: '군집 복구 완료' })
    this.setStep(6)

    this.running = false
  }

  reset = () => {
    this.state = this.createInitialState()
    this.seedEvents()
    this.running = false
    this.emit()
  }
}

export const mockRobotService = new MockRobotService()
