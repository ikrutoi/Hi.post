import React from 'react'
import clsx from 'clsx'
import styles from './Mark.module.scss'
import { buildStampDeliveredSvg } from './stampDeliveredSvg'

export type MarkStampCompositeProps = {
  className?: string
  /** 1…99; `null` — дата не выбрана, `countYear` и `hi` скрыты. 100 — без цифры. */
  yearCount: number | null
}

/** Марка `stamp_delivered_99`. Цвет от аромата не подставляется. */
export const MarkStampComposite: React.FC<MarkStampCompositeProps> = ({
  className,
  yearCount,
}) => {
  const svg = buildStampDeliveredSvg(yearCount)

  return (
    <div className={clsx(styles.markStampComposite, className)}>
      <div
        className={styles.markStampBase}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
