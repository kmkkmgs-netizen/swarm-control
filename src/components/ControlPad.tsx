import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Square } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Movement } from '../types/robot'

interface Props {
  movement: Movement
  disabled?: boolean
  onCommand: (movement: Movement) => void
}

export function ControlPad({ movement, disabled, onCommand }: Props) {
  const key = (m: Movement, icon: ReactNode, label: string) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={movement === m}
      disabled={disabled}
      onClick={() => onCommand(m)}
    >
      {icon}
    </button>
  )

  return (
    <div>
      <div className="pad">
        <span className="spacer" />
        {key('FORWARD', <ArrowUp size={20} />, '전진')}
        <span className="spacer" />
        {key('LEFT', <ArrowLeft size={20} />, '좌회전')}
        {key('STOP', <Square size={18} />, '정지')}
        {key('RIGHT', <ArrowRight size={20} />, '우회전')}
        <span className="spacer" />
        {key('BACKWARD', <ArrowDown size={20} />, '후진')}
        <span className="spacer" />
      </div>
      <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginBottom: 0 }}>
        현재 명령 <span className="mono">{movement}</span>
      </p>
    </div>
  )
}
