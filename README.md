# SWARM CONTROL

Dynamic Leader Election 기반 군집 로봇 관제 웹앱 (졸업작품).

현재 단계에서는 실제 하드웨어와 통신하지 않고 Mock 데이터로 동작한다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속.

## 발표 시나리오

1. 대시보드에서 정상 상태 확인 (Robot 01 = LEADER, 3/3 ONLINE)
2. **Leader 장애 시뮬레이션** 클릭
3. heartbeat timeout → 장애 감지 → election → Robot 02 선출 → 제어권 승계 → 복구 (약 4초)
4. 군집 화면에서 트리 구조 변화 확인
5. 이벤트 화면에서 전체 과정 확인
6. **초기 상태로 되돌리기** 로 리셋 후 재시연 가능

## 구조

```
src/
├─ components/   RobotCard, StatusCard, LeaderStatus, SwarmDiagram, EventLog, ElectionFlow, ControlPad, Badges
├─ pages/        Dashboard, Robots, Swarm, Events, Settings
├─ services/     robotService(진입점), mockRobotService(현재 구현), communicationService(인터페이스)
├─ data/         mockRobots
├─ types/        robot.ts
├─ hooks/        useSwarm
└─ App.tsx
```

UI 컴포넌트는 `robotService` 만 사용한다. 직접 fetch 를 호출하지 않는다.

## 나중에 ESP32 연결하기

1. `CommunicationService` 인터페이스를 구현하는 `esp32Service.ts` 작성
2. `robotService.ts` 의 한 줄만 교체

```ts
export const robotService: CommunicationService = esp32Service
```

UI 코드는 수정하지 않는다.

## Leader 선출 규칙

ONLINE 상태인 Follower 중 ID 가 가장 작은 로봇이 새 Leader 가 된다
(`mockRobotService.pickNewLeader`). Robot 01 장애 시 Robot 02 가 선출된다.
배터리 잔량 기준 등으로 바꾸려면 이 함수만 수정하면 된다.
