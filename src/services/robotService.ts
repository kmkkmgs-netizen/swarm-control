import { mockRobotService } from './mockRobotService'
import type { CommunicationService } from './communicationService'

/**
 * UI 가 바라보는 단 하나의 진입점.
 * 실제 로봇과 연결할 때는 아래 한 줄만 esp32Service 로 바꾸면 된다.
 */
export const robotService: CommunicationService = mockRobotService
