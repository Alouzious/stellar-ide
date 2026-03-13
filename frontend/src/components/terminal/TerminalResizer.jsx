import { useRef } from 'react'
import { useTerminalStore } from '@/store/terminalStore'

export function TerminalResizer() {
  const { height, setHeight } = useTerminalStore()
  const dragRef = useRef(null)

  const handleMouseDown = (e) => {
    e.preventDefault()
    const startY = e.clientY
    const startH = height

    const onMove = (ev) => {
      const delta = startY - ev.clientY
      setHeight(startH + delta)
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.classList.remove('resizing')
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.body.classList.add('resizing')
  }

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      className="h-1 w-full cursor-row-resize hover:bg-accent-blue/30 transition-colors flex-shrink-0 group"
      title="Drag to resize terminal"
    >
      <div className="h-px w-full bg-bg-border group-hover:bg-accent-blue/50 transition-colors" />
    </div>
  )
}
