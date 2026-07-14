import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useDateSwitcherController } from '@date/switcher/application/hooks/useDateSwitcherController'
import { useFlashEffect } from '@shared/hooks'
import { Slider } from '../../slider/presentation/Slider'
import headerStyles from './DateHeader.module.scss'
import styles from './MobileDateCalendarToolbarSlider.module.scss'

export const MobileDateCalendarToolbarSlider: React.FC = () => {
  const { triggerFlash } = useFlashEffect()
  const {
    actions: { handleDecrementArrow, handleIncrementArrow },
  } = useDateSwitcherController({ triggerFlash })

  return (
    <div className={styles.root}>
      <div
        className={headerStyles.arrowButton}
        onClick={handleDecrementArrow}
        role="button"
        tabIndex={0}
        aria-label="Previous month"
      >
        <FaChevronLeft className={headerStyles.iconArrow} />
      </div>

      <div className={styles.sliderWrap}>
        <Slider variant="toolbar" />
      </div>

      <div
        className={headerStyles.arrowButton}
        onClick={handleIncrementArrow}
        role="button"
        tabIndex={0}
        aria-label="Next month"
      >
        <FaChevronRight className={headerStyles.iconArrow} />
      </div>
    </div>
  )
}
