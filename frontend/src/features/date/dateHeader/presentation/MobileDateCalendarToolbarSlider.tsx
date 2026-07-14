import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useDateSwitcherController } from '@date/switcher/application/hooks/useDateSwitcherController'
import { useFlashEffect } from '@shared/hooks'
import { Slider } from '../../slider/presentation/Slider'
import styles from './MobileDateCalendarToolbarSlider.module.scss'

export const MobileDateCalendarToolbarSlider: React.FC = () => {
  const { triggerFlash } = useFlashEffect()
  const {
    actions: { handleDecrementArrow, handleIncrementArrow },
  } = useDateSwitcherController({ triggerFlash })

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.navArrow}
        onClick={handleDecrementArrow}
        aria-label="Previous month"
      >
        <FaChevronLeft className={styles.navArrowIcon} />
      </button>

      <div className={styles.sliderWrap}>
        <Slider variant="toolbar" />
      </div>

      <button
        type="button"
        className={styles.navArrow}
        onClick={handleIncrementArrow}
        aria-label="Next month"
      >
        <FaChevronRight className={styles.navArrowIcon} />
      </button>
    </div>
  )
}
