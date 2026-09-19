export type Role = 'LEADER' | 'FOLLOWER'
export type Status = 'ONLINE' | 'OFFLINE'
export type Heartbeat = 'ACTIVE' | 'TIMEOUT'
export type Movement = 'STOP' | 'FORWARD' | 'BACKWARD' | 'LEFT' | 'RIGHT'

export interface Robot {
  id: string
  name: string
  role: Role
  status: Status
  battery: number
  heartbeat: Heartbeat
  movement: Movement
  sensors: {
    front: number
    left: number
    right: number
  }
}

export type SwarmStatus = 'NORMAL' | 'LEADER_FAILURE' | 'RECOVERED'
export type ElectionStatus = 'IDLE' | 'IN_PROGRESS' | 'COMPLETED'

export type EventType =
  | 'CONNECT'
  | 'HEARTBEAT_TIMEOUT'
  | 'FAILURE_DETECTED'
  | 'ELECTION_START'
  | 'LEADER_ELECTED'
  | 'CONTROL_TRANSFER'
  | 'RECOVERED'
  | 'COMMAND'
  | 'SYSTEM'

export interface SwarmEvent {
  id: number
  time: string
  type: EventType
  robotId: string | null
  message: string
}

/** Leader Election 진행 단계 (0 = 진행 안 함) */
export type ElectionStep = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface SwarmConfig {
  heartbeatInterval: number
  heartbeatTimeout: number
}

export interface SwarmState {
  robots: Robot[]
  swarmStatus: SwarmStatus
  electionStatus: ElectionStatus
  electionStep: ElectionStep
  newLeaderId: string | null
  events: SwarmEvent[]
  config: SwarmConfig
}
