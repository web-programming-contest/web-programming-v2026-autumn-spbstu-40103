import {useCallback, useRef} from 'react'
import './PriceRangeSlider.css'

function clampValue(v, min, max) {
  return Math.min(Math.max(v, min), max)
}

export default function PriceRangeSlider({min, max, value, onChange}) {
  const trackRef = useRef(null)
  const draggingRef = useRef(null)

  const [valueMin, valueMax] = value
  const span = max - min || 1

  const pctMin = ((valueMin - min) / span) * 100
  const pctMax = ((valueMax - min) / span) * 100

  const clamp = useCallback((v) => clampValue(v, min, max), [min, max])

  const posToValue = useCallback(
    (clientX) => {
      const track = trackRef.current
      if (!track) {
        return min
      }
      const rect = track.getBoundingClientRect()
      const ratio = (clientX - rect.left) / rect.width
      const raw = min + ratio * span
      return clamp(Math.round(raw))
    },
    [min, span, clamp],
  )

  const startDrag = (handle) => (e) => {
    e.preventDefault()
    draggingRef.current = handle

    const handleMove = (moveEvent) => {
      const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX
      const next = posToValue(clientX)

      if (draggingRef.current === 'min') {
        onChange([Math.min(next, valueMax), valueMax])
      } else {
        onChange([valueMin, Math.max(next, valueMin)])
      }
    }

    const stopDrag = () => {
      draggingRef.current = null
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', stopDrag)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', stopDrag)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', handleMove, {passive: false})
    window.addEventListener('touchend', stopDrag)
  }

  const handleTrackClick = (e) => {
    if (e.target !== trackRef.current) {
      return
    }
    const clicked = posToValue(e.clientX)
    const distMin = Math.abs(clicked - valueMin)
    const distMax = Math.abs(clicked - valueMax)
    if (distMin <= distMax) {
      onChange([Math.min(clicked, valueMax), valueMax])
    } else {
      onChange([valueMin, Math.max(clicked, valueMin)])
    }
  }

  const handleKeyDown = (handle) => (e) => {
    const step = e.shiftKey ? 1000 : 100
    let delta = 0
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      delta = -step
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      delta = step
    }
    if (!delta) {
      return
    }
    e.preventDefault()

    if (handle === 'min') {
      onChange([clamp(Math.min(valueMin + delta, valueMax)), valueMax])
    } else {
      onChange([valueMin, clamp(Math.max(valueMax + delta, valueMin))])
    }
  }

  return (
    <div className="price-slider">
      <div className="price-slider__track" ref={trackRef} onClick={handleTrackClick}>
        <div className="price-slider__range" style={{left: `${pctMin}%`, right: `${100 - pctMax}%`}} />
        <div
          className="price-slider__handle"
          style={{left: `${pctMin}%`}}
          onMouseDown={startDrag('min')}
          onTouchStart={startDrag('min')}
          onKeyDown={handleKeyDown('min')}
          role="slider"
          tabIndex={0}
          aria-label="Минимальная цена"
          aria-valuemin={min}
          aria-valuemax={valueMax}
          aria-valuenow={valueMin}
        />
        <div
          className="price-slider__handle"
          style={{left: `${pctMax}%`}}
          onMouseDown={startDrag('max')}
          onTouchStart={startDrag('max')}
          onKeyDown={handleKeyDown('max')}
          role="slider"
          tabIndex={0}
          aria-label="Максимальная цена"
          aria-valuemin={valueMin}
          aria-valuemax={max}
          aria-valuenow={valueMax}
        />
      </div>
    </div>
  )
}
