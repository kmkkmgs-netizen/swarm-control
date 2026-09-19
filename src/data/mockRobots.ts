import type { Robot, SwarmConfig } from '../types/robot'

export const initialRobots: Robot[] = [
  {
    id: 'R01',
    name: 'Robot 01',
    role: 'LEADER',
    status: 'ONLINE',
    battery: 87,
    heartbeat: 'ACTIVE',
    movement: 'STOP',
    sensors: { front: 32, left: 45, right: 18 },
  },
  {
    id: 'R02',
    name: 'Robot 02',
    role: 'FOLLOWER',
    status: 'ONLINE',
    battery: 92,
    heartbeat: 'ACTIVE',
    movement: 'STOP',
    sensors: { front: 58, left: 22, right: 40 },
  },
  {
    id: 'R03',
    name: 'Robot 03',
    role: 'FOLLOWER',
    status: 'ONLINE',
    battery: 76,
    heartbeat: 'ACTIVE',
    movement: 'STOP',
    sensors: { front: 27, left: 61, right: 35 },
  },
]

export const initialConfig: SwarmConfig = {
  heartbeatInterval: 1000,
  heartbeatTimeout: 3000,
}
