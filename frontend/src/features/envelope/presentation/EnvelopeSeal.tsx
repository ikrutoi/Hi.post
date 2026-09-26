import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  createPostcardSeal,
  type PostcardSeal,
} from '@entities/postcard'
import sealNoOutlineUrl from '@shared/assets/stamps/seal_noOutline.svg?url'
import sealOutline01Url from '@shared/assets/stamps/seal_outline_01.svg?url'
import sealOutline02Url from '@shared/assets/stamps/seal_outline_02.svg?url'
import styles from './Envelope.module.scss'

const SEAL_OUTLINES = [sealOutline01Url, sealOutline02Url] as const

const SEAL_WIDTH_RATIO = 0.28

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

type EnvelopeSealProps = {
  /** Сохранённая постановка sent/delivered. Без неё — случайная, для теста в фабрике. */
  pose?: PostcardSeal | null
}

export const EnvelopeSeal: React.FC<EnvelopeSealProps> = ({ pose = null }) => {
  const sealRef = useRef<HTMLImageElement>(null)
  const poseRef = useRef(pose)
  poseRef.current = pose
  const jitterRef = useRef<PostcardSeal | null>(pose)
  if (pose) {
    jitterRef.current = pose
  } else if (jitterRef.current == null) {
    jitterRef.current = createPostcardSeal()
  }
  const wasLockedRef = useRef(pose != null)
  if (!pose && wasLockedRef.current) {
    jitterRef.current = createPostcardSeal()
  }
  wasLockedRef.current = pose != null
  const [place, setPlace] = useState<SealPlace | null>(null)
  const [reshuffleTick, setReshuffleTick] = useState(0)

  useEffect(() => {
    const listener = () => {
      if (poseRef.current) return
      jitterRef.current = createPostcardSeal()
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
  }, [reshuffleTick, pose])

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
