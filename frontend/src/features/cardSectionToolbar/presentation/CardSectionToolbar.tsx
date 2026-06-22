import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectCardPieCopyStripExpanded,
} from '@cart/infrastructure/selectors'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { EnvelopeInnerToolbar } from '@envelope/presentation/EnvelopeInnerToolbar'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './CardSectionToolbar.module.scss'

export const CardSectionToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const showCalendarToolbar =
    activeSection === 'date' || activeSection === 'history'
  const calendarToolbarSection =
    notebookStripTab === 'cart'
      ? 'cart'
      : notebookStripTab === 'history'
        ? 'history'
        : 'date'

  if (activeSection === 'envelope' && !isMobileLayout) {
    return null
  }

  return (
    <div
      className={clsx(
        styles.cardSectionToolbar,
        cardPieCopyStripExpanded && styles.cardSectionToolbarDisabled,
      )}
    >
      {activeSection === 'cardphoto' && <Toolbar section="cardphoto" />}
      {showCalendarToolbar && <Toolbar section={calendarToolbarSection} />}
      {activeSection === 'envelope' && <EnvelopeInnerToolbar />}
      {activeSection === 'cardtext' && (
        <div className={styles.cardSectionToolbarHeader}>
          <Toolbar section="cardtext" />
        </div>
      )}
    </div>
  )
}
