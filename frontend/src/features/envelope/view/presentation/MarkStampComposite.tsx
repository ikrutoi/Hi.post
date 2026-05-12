import React from 'react'
import clsx from 'clsx'
import markCartBaseUrl from '@envelope/assets/mark_os_cart_base_anchor.svg?url'
import markReadyBaseUrl from '@envelope/assets/mark_os_ready_base_anchor.svg?url'
import spriteDigitsUrl from '@envelope/assets/sprite_digits.svg?url'
import styles from './Mark.module.scss'

export type MarkStampVariant = 'cart' | 'ready'

/** Первое вхождение `M` / `m` в path — грубая опора X для выравнивания в anchor (см. sprite_digits.svg). */
const SPRITE_DIGIT_PATH_ANCHOR_MX: Record<string, number> = {
  '0': 1245,
  '1': 2856,
  '2': 4712,
  '3': 1951,
  '4': 3747,
  '5': 5693,
  '6': 1625,
  '7': 2060,
  '8': 4517,
  '9': 6253,
}

const REF_MX = SPRITE_DIGIT_PATH_ANCHOR_MX['1']
/** Подогнано под anchor в base (7080×10241); при смещении цифр правьте эти два числа. */
const BASE_TRANSLATE_X = -858
const BASE_TRANSLATE_Y = 6801
const MULTI_DIGIT_SPACING = 340

function transformForDigitChar(
  ch: string,
  index: number,
  total: number,
): string {
  const mx = SPRITE_DIGIT_PATH_ANCHOR_MX[ch] ?? REF_MX
  const slot =
    total <= 1 ? 0 : (index - (total - 1) / 2) * MULTI_DIGIT_SPACING
  const tx = BASE_TRANSLATE_X + (REF_MX - mx) + slot
  return `translate(${tx} ${BASE_TRANSLATE_Y})`
}

export type MarkStampCompositeProps = {
  className?: string
  variant: MarkStampVariant
  /** 1…99 (значение с хука марки). */
  yearCount: number
}

/**
 * Марка: базовый SVG без цифр + слой `<use>` на спрайт цифр (тот же anchor, что у cart/ready base).
 */
export const MarkStampComposite: React.FC<MarkStampCompositeProps> = ({
  className,
  variant,
  yearCount,
}) => {
  const baseUrl = variant === 'ready' ? markReadyBaseUrl : markCartBaseUrl
  const clamped = Math.min(99, Math.max(1, Math.round(yearCount)))
  const chars = String(clamped).split('')

  return (
    <div className={clsx(styles.markStampComposite, className)}>
      <img
        src={baseUrl}
        alt=""
        className={styles.markStampBase}
        draggable={false}
      />
      <svg
        className={styles.markStampDigits}
        viewBox="0 0 7080 10241"
        aria-hidden
      >
        {chars.map((ch, i) => (
          <use
            key={`${ch}-${i}`}
            href={`${spriteDigitsUrl}#digit-${ch}`}
            transform={transformForDigitChar(ch, i, chars.length)}
            fill="#fff"
          />
        ))}
      </svg>
    </div>
  )
}
