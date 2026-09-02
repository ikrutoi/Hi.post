import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useAppSelector } from '@app/hooks'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
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

/** Desktop factory lower row: slider + prev/next, hidden during date peek. */
export const DesktopDateCalendarToolbarSlider: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const { rightPieDatePeekNoToolbar } = useRightListArchiveMini()
  const { assemblyDateSimplifiedPeek } = useMobileFactoryListChrome()

  const show =
    !isMobileLayout &&
    (activeSection === 'date' || activeSection === 'history') &&
    !rightPieDatePeekNoToolbar &&
    !assemblyDateSimplifiedPeek

  if (!show) return null

  return <MobileDateCalendarToolbarSlider />
}
