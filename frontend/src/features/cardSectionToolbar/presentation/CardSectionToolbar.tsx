import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCardPieCopyStripExpanded,
} from '@cart/infrastructure/selectors'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { EnvelopeInnerToolbar } from '@envelope/presentation/EnvelopeInnerToolbar'
import { MobileDateCalendarToolbarNav } from '@date/dateHeader/presentation/MobileDateCalendarToolbarNav'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { selectIsCardtextEditorComposerVisible } from '@cardtext/infrastructure/selectors'
import { toolbarAction } from '@toolbar/application/helpers'
import { AROMA_UPPER_APPLY_TOOLBAR } from '@toolbar/domain/types/aroma.types'
import { CARDTEXT_EDITOR_UPPER_RETURN_TOOLBAR } from '@toolbar/domain/types/cardtext.types'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconKey } from '@shared/config/constants'
import styles from './CardSectionToolbar.module.scss'

export const CardSectionToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { activeSection } = useSectionMenuFacade()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const showCardtextEditorComposer = useAppSelector(
    selectIsCardtextEditorComposerVisible,
  )
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
  const showMobileAromaUpperToolbar =
    activeSection === 'aroma' && isMobileLayout
  const aromaUpperApplyToolbar = useMemo(
    () => (showMobileAromaUpperToolbar ? AROMA_UPPER_APPLY_TOOLBAR : undefined),
    [showMobileAromaUpperToolbar],
  )

  const handleCardtextEditorReturn = useCallback(
    (key: IconKey) => {
      if (key !== 'return') return
      dispatch(
        toolbarAction({ section: 'cardtextEditor', key: 'close' } as const),
      )
      return false
    },
    [dispatch],
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
      {activeSection === 'cardtext' &&
        (showCardtextEditorComposer ? (
          <div className={styles.cardSectionToolbarAromaUpper}>
            <div className={styles.cardSectionToolbarHeader}>
              <Toolbar section="cardtext" />
            </div>
            <Toolbar
              section="cardtextCreate"
              groupsOverride={CARDTEXT_EDITOR_UPPER_RETURN_TOOLBAR}
              className={toolbarStyles.toolbarAromaUpperReturn}
              onActionClick={handleCardtextEditorReturn}
            />
          </div>
        ) : (
          <div className={styles.cardSectionToolbarHeader}>
            <Toolbar section="cardtext" />
          </div>
        ))}
      {showMobileAromaUpperToolbar ? (
        <div className={styles.cardSectionToolbarAromaUpper}>
          <Toolbar
            section="aroma"
            groupsOverride={aromaUpperApplyToolbar}
            className={toolbarStyles.toolbarAromaUpperApply}
          />
        </div>
      ) : null}
    </div>
  )
}
