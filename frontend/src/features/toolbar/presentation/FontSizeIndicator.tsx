import React from 'react'
import clsx from 'clsx'
import { CARDTEXT_CONFIG, clampCardtextFontSizeStep } from '@cardtext/domain/types'
import styles from './FontSizeIndicator.module.scss'

interface FontSizeIndicatorProps {
  currentStep: number
}

export const FontSizeIndicator: React.FC<FontSizeIndicatorProps> = ({
  currentStep,
}) => {
  const steps = Array.from({ length: CARDTEXT_CONFIG.step }, (_, i) => i + 1)
  const activeStep = clampCardtextFontSizeStep(currentStep)

  return (
    <div className={styles.stepWrapperContainer}>
      {steps.map((step) => (
        <div
          key={step}
          className={clsx(
            styles.stepWrapper,
            step === activeStep && styles.active,
          )}
        >
          <span className={styles.dot} aria-hidden />
        </div>
      ))}
    </div>
  )
}
