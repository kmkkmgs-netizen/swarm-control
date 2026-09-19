import { useSyncExternalStore } from 'react'
import { robotService } from '../services/robotService'

export function useSwarm() {
  const state = useSyncExternalStore(robotService.subscribe, robotService.getState)

  return {
    ...state,
    leader: state.robots.find((r) => r.role === 'LEADER') ?? null,
    followers: state.robots.filter((r) => r.role === 'FOLLOWER'),
    onlineCount: state.robots.filter((r) => r.status === 'ONLINE').length,
    setMovement: robotService.setMovement,
    simulateLeaderFailure: robotService.simulateLeaderFailure,
    updateConfig: robotService.updateConfig,
    reset: robotService.reset,
  }
}
