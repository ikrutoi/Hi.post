import React from 'react'
import clsx from 'clsx'
import markCartUrl from '@shared/assets/logo/mark_cart.svg?url'
import markPaidUrl from '@shared/assets/logo/mark_paid.svg?url'
import styles from './Mark.module.scss'

export type MarkStampVariant = 'cart' | 'ready'

export type MarkStampCompositeProps = {
  className?: string
  variant: MarkStampVariant
}

export const MarkStampComposite: React.FC<MarkStampCompositeProps> = ({
  className,
  variant,
}) => {
  const baseUrl = variant === 'ready' ? markPaidUrl : markCartUrl

  return (
    <div className={clsx(styles.markStampComposite, className)}>
      <img
        src={baseUrl}
        alt=""
        className={styles.markStampBase}
        draggable={false}
      />
    </div>
  )
}
