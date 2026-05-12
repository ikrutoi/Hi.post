import React from 'react'
import clsx from 'clsx'
import markCartBaseUrl from '@envelope/assets/mark_os_cart_base_anchor.svg?url'
import markReadyBaseUrl from '@envelope/assets/mark_os_ready_base_anchor.svg?url'
import digit0 from '@envelope/assets/digits/digit-0.svg?url'
import digit1 from '@envelope/assets/digits/digit-1.svg?url'
import digit2 from '@envelope/assets/digits/digit-2.svg?url'
import digit3 from '@envelope/assets/digits/digit-3.svg?url'
import digit4 from '@envelope/assets/digits/digit-4.svg?url'
import digit5 from '@envelope/assets/digits/digit-5.svg?url'
import digit6 from '@envelope/assets/digits/digit-6.svg?url'
import digit7 from '@envelope/assets/digits/digit-7.svg?url'
import digit8 from '@envelope/assets/digits/digit-8.svg?url'
import digit9 from '@envelope/assets/digits/digit-9.svg?url'
import styles from './Mark.module.scss'
import {
  MARK_STAMP_DIGIT_SPRITE_CENTER,
  markStampMedallionSlotCenters,
} from '../../domain/markStampDigitLayout'

export type MarkStampVariant = 'cart' | 'ready'

/** Как у `mark_os_*_base_anchor.svg` — слой цифр совпадает с базой 1:1. */
export const MARK_STAMP_VIEWBOX_W = 7080
export const MARK_STAMP_VIEWBOX_H = 10241

const DIGIT_SRC: Record<string, string> = {
  '0': digit0,
  '1': digit1,
  '2': digit2,
  '3': digit3,
  '4': digit4,
  '5': digit5,
  '6': digit6,
  '7': digit7,
  '8': digit8,
  '9': digit9,
}

export type MarkStampCompositeProps = {
  className?: string
  variant: MarkStampVariant
  /** 1…99 (значение с хука марки). */
  yearCount: number
}

/**
 * Марка: база + наложение цифр в **той же системе координат**, что и база (`viewBox` 7080×10241).
 * Каждый `digits/digit-N.svg` — холст **0 0 7080 10241**, глиф в тех же координатах, что в `sprite_digits.svg`;
 * в разметке задаётся `transform`, чтобы центр bbox глифа совпал с центром медальона (см. `markStampDigitLayout.ts`).
 */
export const MarkStampComposite: React.FC<MarkStampCompositeProps> = ({
  className,
  variant,
  yearCount,
}) => {
  const baseUrl = variant === 'ready' ? markReadyBaseUrl : markCartBaseUrl
  const clamped = Math.min(99, Math.max(1, Math.round(yearCount)))
  const chars = String(clamped).split('')
  const slots = markStampMedallionSlotCenters(chars)

  return (
    <div className={clsx(styles.markStampComposite, className)}>
      <img
        src={baseUrl}
        alt=""
        className={styles.markStampBase}
        draggable={false}
      />
      <svg
        className={styles.markStampDigitOverlay}
        viewBox={`0 0 ${MARK_STAMP_VIEWBOX_W} ${MARK_STAMP_VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {chars.map((ch, i) => {
          const href = DIGIT_SRC[ch] ?? DIGIT_SRC['0']
          const center = MARK_STAMP_DIGIT_SPRITE_CENTER[ch] ?? MARK_STAMP_DIGIT_SPRITE_CENTER['0']
          const slot = slots[i] ?? slots[0]
          const dx = slot.x - center.cx
          const dy = slot.y - center.cy
          return (
            <image
              key={`${ch}-${i}`}
              href={href}
              x={0}
              y={0}
              width={MARK_STAMP_VIEWBOX_W}
              height={MARK_STAMP_VIEWBOX_H}
              transform={`translate(${dx} ${dy})`}
            />
          )
        })}
      </svg>
    </div>
  )
}
