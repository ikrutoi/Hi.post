import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectCardPieCopyStripExpanded,
} from '@cart/infrastructure/selectors'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { EnvelopeInnerToolbar } from '@envelope/presentation/EnvelopeInnerToolbar'
import { MobileDateCalendarToolbarNav } from '@date/dateHeader/presentation/MobileDateCalendarToolbarNav'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { selectAromaPreviewOpen } from '@aroma/infrastructure/selectors'
import { AROMA_PREVIEW_APPLY_TOOLBAR, AROMA_PREVIEW_UPPER_RETURN_TOOLBAR } from '@toolbar/domain/types/aroma.types'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import styles from './CardSectionToolbar.module.scss'

export const CardSectionToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const aromaPreviewOpen = useAppSelector(selectAromaPreviewOpen)
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
  const showMobileCalendarModeToolbar =
    showCalendarToolbar && !isMobileLayout
  const showMobileDateCalendarNav =
    showCalendarToolbar && isMobileLayout
  const showMobileAromaPreviewApplyToolbar =
    activeSection === 'aroma' && isMobileLayout && aromaPreviewOpen
  const aromaPreviewApplyToolbar = useMemo(
    () => (showMobileAromaPreviewApplyToolbar ? AROMA_PREVIEW_APPLY_TOOLBAR : undefined),
    [showMobileAromaPreviewApplyToolbar],
  )
  const aromaPreviewUpperReturnToolbar = useMemo(
    () =>
      showMobileAromaPreviewApplyToolbar
        ? AROMA_PREVIEW_UPPER_RETURN_TOOLBAR
        : undefined,
    [showMobileAromaPreviewApplyToolbar],
  )

  if (activeSection === 'envelope' && !isMobileLayout) {
    return null
  }

  return (
    <div
      className={clsx(
        styles.cardSectionToolbar,
        showMobileDateCalendarNav && styles.cardSectionToolbarDateNav,
        cardPieCopyStripExpanded && styles.cardSectionToolbarDisabled,
      )}
    >
      {activeSection === 'cardphoto' && <Toolbar section="cardphoto" />}
      {showMobileCalendarModeToolbar && (
        <Toolbar section={calendarToolbarSection} />
      )}
      {showMobileDateCalendarNav && <MobileDateCalendarToolbarNav />}
      {activeSection === 'envelope' && <EnvelopeInnerToolbar />}
      {activeSection === 'cardtext' && (
        <div className={styles.cardSectionToolbarHeader}>
          <Toolbar section="cardtext" />
        </div>
      )}
      {showMobileAromaPreviewApplyToolbar ? (
        <div className={styles.cardSectionToolbarAromaUpper}>
          <Toolbar
            section="aroma"
            groupsOverride={aromaPreviewApplyToolbar}
            className={toolbarStyles.toolbarAromaUpperApply}
          />
          <Toolbar
            section="aroma"
            groupsOverride={aromaPreviewUpperReturnToolbar}
            className={toolbarStyles.toolbarAromaUpperReturn}
          />
        </div>
      ) : null}
    </div>
  )
}
