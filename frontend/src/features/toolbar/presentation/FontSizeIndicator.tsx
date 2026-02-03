import React from 'react'
import clsx from 'clsx'
import { IconCircleV2 } from '@shared/ui/icons'
import { CARDTEXT_CONFIG } from '@cardtext/domain/types'
import styles from './FontSizeIndicator.module.scss'

interface FontSizeIndicatorProps {
  currentStep: number
}

export const FontSizeIndicator: React.FC<FontSizeIndicatorProps> = ({
  currentStep,
}) => {
  const steps = Array.from({ length: CARDTEXT_CONFIG.step }, (_, i) => i + 1)

  return (
    <div className={styles.stepWrapperContainer}>
      {steps.map((step) => {
        const isFilled = step <= currentStep
        const isCurrent = step === currentStep
        const isEmpty = step > currentStep

        return (
          <div
            key={step}
            className={clsx(styles.stepWrapper, {
              [styles.active]: isCurrent,
              [styles.filled]: isFilled,
              [styles.empty]: isEmpty,
            })}
          >
            <IconCircleV2
              className={styles.icon}
              fill="currentColor"
              // fill={isFilled ? 'currentColor' : 'none'}
            />
          </div>
        )
      })}
    </div>
  )
}
