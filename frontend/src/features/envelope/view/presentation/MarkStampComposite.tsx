import React from 'react'
import clsx from 'clsx'
import stampStartUrl from '@shared/assets/stamps/stamp_start.svg?url'
import markPaidUrl from '@shared/assets/logo/mark_paid.svg?url'
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
import type { StampAroma99Colors } from '@envelope/domain/stampAroma99Colors'
import { buildStampAroma99Svg } from './stampAroma99Svg'
import {
  MARK_STAMP_VB_H,
  MARK_STAMP_VB_W,
  markStampDigitLayout,
} from '../../domain/markStampDigitLayout'

export type MarkStampVariant = 'cart' | 'ready'

/** Холст одного глифа. В оверлее он масштабируется в viewBox марки. */
const DIGIT_VB_W = 7080
const DIGIT_VB_H = 10241

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
  /** Палитра выбранного аромата. `null` — стартовая или оплаченная марка. */
  aromaColors: StampAroma99Colors | null
  /** 1…99; `null` — дата не выбрана, слой цифр не рисуем. 100 — без оверлея. */
  yearCount: number | null
}

/**
 * Марка `stamp_aroma_99` при выбранном аромате, иначе `stamp_start` / `mark_paid`.
 * Глифы живут в viewBox 7080×10241 и масштабируются в viewBox марки.
 */
export const MarkStampComposite: React.FC<MarkStampCompositeProps> = ({
  className,
  variant,
  aromaColors,
  yearCount,
}) => {
  const rawId = React.useId().replace(/:/g, '')
  const aromaSvg = aromaColors
    ? buildStampAroma99Svg(aromaColors, yearCount, rawId)
    : null
  const baseUrl = variant === 'ready' ? markPaidUrl : stampStartUrl
  const showDigits = yearCount != null && yearCount !== 100
  const chars = showDigits
    ? String(Math.min(99, Math.max(1, Math.round(yearCount)))).split('')
    : []
  const layout = !aromaSvg && showDigits ? markStampDigitLayout(chars) : null
  const gradientId = `mark-digit-fill-${rawId}`
  const maskId = `mark-digit-mask-${rawId}`
  const cartFill = variant !== 'ready'

  return (
    <div className={clsx(styles.markStampComposite, className)}>
      {aromaSvg ? (
        <div
          className={styles.markStampBase}
          dangerouslySetInnerHTML={{ __html: aromaSvg }}
        />
      ) : (
        <img
          src={baseUrl}
          alt=""
          className={styles.markStampBase}
          draggable={false}
        />
      )}
      {!aromaSvg && showDigits && layout ? (
        <svg
          className={styles.markStampDigitOverlay}
          viewBox={`0 0 ${MARK_STAMP_VB_W} ${MARK_STAMP_VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1={layout.ink.x}
              y1={layout.ink.y}
              x2={layout.ink.x}
              y2={layout.ink.y + layout.ink.height}
            >
              {cartFill ? (
                <>
                  {/* Слегка: сверху зелёный, снизу лавандовый. */}
                  <stop offset="0" stopColor="#b7e8c4" />
                  <stop offset="1" stopColor="#d2c0ee" />
                </>
              ) : (
                <>
                  <stop offset="0" stopColor="#3ddc6a" />
                  <stop offset="1" stopColor="#c9a0f5" />
                </>
              )}
            </linearGradient>
            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={MARK_STAMP_VB_W}
              height={MARK_STAMP_VB_H}
            >
              {chars.map((ch, i) => (
                <image
                  key={`${ch}-${i}`}
                  href={DIGIT_SRC[ch] ?? DIGIT_SRC['0']}
                  x={0}
                  y={0}
                  width={DIGIT_VB_W}
                  height={DIGIT_VB_H}
                  transform={layout.placements[i]?.transform}
                />
              ))}
            </mask>
          </defs>
          <rect
            x={layout.ink.x}
            y={layout.ink.y}
            width={layout.ink.width}
            height={layout.ink.height}
            fill={`url(#${gradientId})`}
            mask={`url(#${maskId})`}
          />
        </svg>
      ) : null}
    </div>
  )
}
