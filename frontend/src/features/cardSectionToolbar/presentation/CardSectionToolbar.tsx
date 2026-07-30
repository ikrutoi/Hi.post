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
import {
  selectCardphotoAssetData,
  selectCardphotoAssetToolbar,
  selectCardphotoViewReturnSnapshot,
  selectIsCardphotoViewEditMode,
} from '@cardphoto/infrastructure/selectors'
import { toolbarAction } from '@toolbar/application/helpers'
import { CARDTEXT_EDITOR_UPPER_RETURN_TOOLBAR } from '@toolbar/domain/types/cardtext.types'
import {
  CARDPHOTO_CREATE_UPPER_APPLY_TOOLBAR,
  CARDPHOTO_CREATE_UPPER_RETURN_TOOLBAR,
} from '@toolbar/domain/types/cardphoto.types'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconKey, IconState } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './CardSectionToolbar.module.scss'

function readApplyMediumState(raw: unknown): IconState {
  if (raw == null) return 'disabled'
  if (typeof raw === 'string') return raw as IconState
  if (typeof raw === 'object' && raw !== null && 'state' in raw) {
    return String((raw as { state: unknown }).state) as IconState
  }
  return 'disabled'
}

export const CardSectionToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { activeSection } = useSectionMenuFacade()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const showCardtextEditorComposer = useAppSelector(
    selectIsCardtextEditorComposerVisible,
  )
  const cardphotoAssetToolbar = useAppSelector(selectCardphotoAssetToolbar)
  const cardphotoAssetData = useAppSelector(selectCardphotoAssetData)
  const cardphotoViewReturnSnapshot = useAppSelector(
    selectCardphotoViewReturnSnapshot,
  )
  const isCardphotoViewEditMode = useAppSelector(selectIsCardphotoViewEditMode)
  const cardphotoCreateApplyRaw = useAppSelector(
    (s) => s.toolbar?.cardphotoCreate?.applyMedium,
  )
  const cardphotoCreateApplyState = readApplyMediumState(cardphotoCreateApplyRaw)
  /**
   * Create с загруженным фото — upper: applyMedium | return (без cardphoto section).
   */
  const showCardphotoCreateUpper =
    activeSection === 'cardphoto' &&
    cardphotoAssetToolbar === 'cardphotoCreate' &&
    cardphotoAssetData != null &&
    (cardphotoViewReturnSnapshot != null ||
      isCardphotoViewEditMode ||
      cardphotoAssetData.source === 'original')
  const cardphotoCreateUpperApplyToolbar = useMemo((): ToolbarConfig => {
    return CARDPHOTO_CREATE_UPPER_APPLY_TOOLBAR.map((group) => ({
      ...group,
      icons: group.icons.map((icon) =>
        icon.key === 'applyMedium'
          ? { ...icon, state: cardphotoCreateApplyState }
          : icon,
      ),
    }))
  }, [cardphotoCreateApplyState])
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

  const handleCardphotoCreateReturn = useCallback(
    (key: IconKey) => {
      if (key !== 'return') return
      dispatch(
        toolbarAction({ section: 'cardphotoCreate', key: 'close' } as const),
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
      {activeSection === 'cardphoto' &&
        (showCardphotoCreateUpper ? (
          <div
            className={clsx(
              styles.cardSectionToolbarAromaUpper,
              styles.cardSectionToolbarCardphotoTint,
            )}
          >
            <div className={styles.cardSectionToolbarUpperApply}>
              <Toolbar
                section="cardphotoCreate"
                groupsOverride={cardphotoCreateUpperApplyToolbar}
                className={toolbarStyles.toolbarAromaUpperApply}
              />
            </div>
            <div className={styles.cardSectionToolbarUpperReturn}>
              <Toolbar
                section="cardphotoCreate"
                groupsOverride={CARDPHOTO_CREATE_UPPER_RETURN_TOOLBAR}
                className={toolbarStyles.toolbarAromaUpperReturn}
                onActionClick={handleCardphotoCreateReturn}
              />
            </div>
          </div>
        ) : (
          <div
            className={clsx(
              isMobileLayout && styles.cardSectionToolbarCardphotoTint,
            )}
          >
            <Toolbar section="cardphoto" />
          </div>
        ))}
      {showMobileCalendarModeToolbar && (
        <Toolbar section={calendarToolbarSection} />
      )}
      {showMobileDateCalendarNav && <MobileDateCalendarToolbarNav />}
      {activeSection === 'envelope' && <EnvelopeInnerToolbar />}
      {activeSection === 'cardtext' &&
        (showCardtextEditorComposer ? (
          <div
            className={clsx(
              styles.cardSectionToolbarAromaUpper,
              isMobileLayout && styles.cardSectionToolbarCardtextTint,
            )}
          >
            <div className={styles.cardSectionToolbarHeader}>
              <Toolbar section="cardtext" />
            </div>
            <div className={styles.cardSectionToolbarUpperReturn}>
              <Toolbar
                section="cardtextCreate"
                groupsOverride={CARDTEXT_EDITOR_UPPER_RETURN_TOOLBAR}
                className={toolbarStyles.toolbarAromaUpperReturn}
                onActionClick={handleCardtextEditorReturn}
              />
            </div>
          </div>
        ) : (
          <div
            className={clsx(
              styles.cardSectionToolbarHeader,
              isMobileLayout && styles.cardSectionToolbarCardtextTint,
            )}
          >
            <Toolbar section="cardtext" />
          </div>
        ))}
      {showMobileAromaUpperToolbar ? (
        <div
          className={clsx(
            styles.cardSectionToolbarAromaUpper,
            styles.cardSectionToolbarAromaTint,
          )}
        >
          <Toolbar
            section="aroma"
            className={toolbarStyles.toolbarAromaUpperApply}
          />
        </div>
      ) : null}
    </div>
  )
}
