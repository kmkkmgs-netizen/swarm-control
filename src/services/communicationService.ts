import type { Movement, SwarmConfig, SwarmState } from '../types/robot'

/**
 * 실제 통신 계층의 인터페이스.
 * 나중에 ESP32(Wi-Fi / REST / WebSocket) 구현체가 이 형태를 그대로 따르면
 * UI 코드는 한 줄도 고치지 않고 교체할 수 있다.
 */
export interface CommunicationService {
  subscribe(listener: (state: SwarmState) => void): () => void
  getState(): SwarmState
  setMovement(robotId: string, movement: Movement): void
  simulateLeaderFailure(): Promise<void> | void
  updateConfig(config: Partial<SwarmConfig>): void
  reset(): void
}

/*
 * 예시 (나중에 구현):
 *
 * class Esp32Service implements CommunicationService {
 *   private ws = new WebSocket('ws://192.168.0.10/ws')
 *   ...
 * }
 */
