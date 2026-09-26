import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import sealUrl from '@shared/assets/stamps/seal.svg?url'
import styles from './Envelope.module.scss'

const SEAL_WIDTH_RATIO = 0.28
const SEAL_SHIFT_LEFT_RATIO = 0.03
const SEAL_SHIFT_RIGHT_RATIO = 0.06
const SEAL_SHIFT_UP_RATIO = 0.05
const SEAL_SHIFT_DOWN_RATIO = 0.03
const SEAL_ROTATION_DEG = 45

type SealJitter = {
  /** Доля ширины секции: X −0.03…0.06, Y −0.05…0.03. */
  x: number
  y: number
  rotate: number
}

type SealPlace = {
  left: number
  top: number
  size: number
  rotate: number
}

const sealReshuffleListeners = new Set<() => void>()

/** Временная отладка: новая случайная постановка печати. */
export function reshuffleEnvelopeSeal(): void {
  sealReshuffleListeners.forEach((listener) => listener())
}

function randomJitter(): SealJitter {
  return {
    x:
      -SEAL_SHIFT_LEFT_RATIO +
      Math.random() * (SEAL_SHIFT_LEFT_RATIO + SEAL_SHIFT_RIGHT_RATIO),
    y:
      -SEAL_SHIFT_UP_RATIO +
      Math.random() * (SEAL_SHIFT_UP_RATIO + SEAL_SHIFT_DOWN_RATIO),
    rotate: (Math.random() * 2 - 1) * SEAL_ROTATION_DEG,
  }
}

export const EnvelopeSeal: React.FC = () => {
  const sealRef = useRef<HTMLImageElement>(null)
  const jitterRef = useRef<SealJitter | null>(null)
  if (jitterRef.current == null) jitterRef.current = randomJitter()
  const [place, setPlace] = useState<SealPlace | null>(null)
  const [reshuffleTick, setReshuffleTick] = useState(0)

  useEffect(() => {
    const listener = () => {
      jitterRef.current = randomJitter()
      setReshuffleTick((tick) => tick + 1)
    }
    sealReshuffleListeners.add(listener)
    return () => {
      sealReshuffleListeners.delete(listener)
    }
  }, [])

  useLayoutEffect(() => {
    const stamp = sealRef.current?.parentElement
    if (!(stamp instanceof HTMLElement)) return

    const measure = () => {
      const jitter = jitterRef.current
      const section = stamp.closest('[data-envelope-section]')
      if (!(section instanceof HTMLElement) || jitter == null) return
      const sectionBox = section.getBoundingClientRect()
      const stampBox = stamp.getBoundingClientRect()
      if (sectionBox.width <= 0 || stampBox.width <= 0) return
      const size = sectionBox.width * SEAL_WIDTH_RATIO
      const shift = sectionBox.width
      const centerX = jitter.x * shift
      const centerY = stampBox.height + jitter.y * shift
      setPlace({
        left: centerX - size / 2,
        top: centerY - size / 2,
        size,
        rotate: jitter.rotate,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stamp)
    const section = stamp.closest('[data-envelope-section]')
    if (section instanceof HTMLElement) observer.observe(section)
    return () => observer.disconnect()
  }, [reshuffleTick])

  return (
    <img
      ref={sealRef}
      src={sealUrl}
      alt=""
      draggable={false}
      className={styles.envelopeSeal}
      style={
        place == null
          ? { visibility: 'hidden' }
          : {
              left: place.left,
              top: place.top,
              width: place.size,
              height: place.size,
              transform: `rotate(${place.rotate}deg)`,
            }
      }
    />
  )
}
