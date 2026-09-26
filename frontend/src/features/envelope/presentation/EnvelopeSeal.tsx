import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import sealNoOutlineUrl from '@shared/assets/stamps/seal_noOutline.svg?url'
import sealOutline01Url from '@shared/assets/stamps/seal_outline_01.svg?url'
import sealOutline02Url from '@shared/assets/stamps/seal_outline_02.svg?url'
import styles from './Envelope.module.scss'

const SEAL_OUTLINES = [sealOutline01Url, sealOutline02Url] as const

const SEAL_WIDTH_RATIO = 0.28
const SEAL_SHIFT_LEFT_RATIO = 0.03
const SEAL_SHIFT_RIGHT_RATIO = 0.06
const SEAL_SHIFT_UP_RATIO = 0.05
const SEAL_SHIFT_DOWN_RATIO = 0.03
const SEAL_ROTATION_DEG = 40

type SealJitter = {
  /** Доля ширины секции: X −0.03…0.06, Y −0.05…0.03. */
  x: number
  y: number
  /** Поворот основы, ±40°. */
  rotate: number
  /** Какое кольцо лежит поверх центра. */
  outline: 0 | 1
  /** Поворот кольца, 0…360°. */
  outlineRotate: number
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
    outline: Math.random() < 0.5 ? 0 : 1,
    outlineRotate: Math.random() * 360,
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

  const jitter = jitterRef.current
  const hidden = place == null
  const frame = hidden
    ? { visibility: 'hidden' as const }
    : {
        left: place.left,
        top: place.top,
        width: place.size,
        height: place.size,
      }

  return (
    <>
      <img
        ref={sealRef}
        src={sealNoOutlineUrl}
        alt=""
        draggable={false}
        className={styles.envelopeSeal}
        style={
          hidden
            ? frame
            : { ...frame, transform: `rotate(${place.rotate}deg)` }
        }
      />
      <img
        src={SEAL_OUTLINES[jitter?.outline ?? 0]}
        alt=""
        draggable={false}
        className={styles.envelopeSealOutline}
        style={
          hidden
            ? frame
            : {
                ...frame,
                transform: `rotate(${jitter?.outlineRotate ?? 0}deg)`,
              }
        }
      />
    </>
  )
}
