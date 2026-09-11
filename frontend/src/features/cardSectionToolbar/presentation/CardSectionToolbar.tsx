import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectCardPieCopyStripExpanded,
} from '@cart/infrastructure/selectors'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { EnvelopeInnerToolbar } from '@envelope/presentation/EnvelopeInnerToolbar'
import { MobileDateCalendarToolbarNav } from '@date/dateHeader/presentation/MobileDateCalendarToolbarNav'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import {
  selectCardphotoAssetData,
  selectCardphotoAssetToolbar,
  selectIsCardphotoCreateSession,
} from '@cardphoto/infrastructure/selectors'
import { CARDPHOTO_CREATE_UPPER_APPLY_TOOLBAR, CARDPHOTO_CREATE_UPPER_CLOSE_TOOLBAR } from '@toolbar/domain/types/cardphoto.types'
import { CardphotoPrintQualitySlot } from '@features/toolbar/presentation/CardphotoPrintQualitySlot'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconState } from '@shared/config/constants'
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
  const { activeSection } = useSectionMenuFacade()
  const { sizeMiniCard } = useSizeFacade()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
  const cardphotoAssetToolbar = useAppSelector(selectCardphotoAssetToolbar)
  const cardphotoAssetData = useAppSelector(selectCardphotoAssetData)
  const isCardphotoCreateSession = useAppSelector(
    selectIsCardphotoCreateSession,
  )
  const cardphotoCreateApplyRaw = useAppSelector(
    (s) => s.toolbar?.cardphotoCreate?.applyMedium,
  )
  const cardphotoCreateCropState = useAppSelector(
    (s) => s.toolbar?.cardphotoCreate?.crop?.state,
  )
  const cardphotoCreateApplyState = readApplyMediumState(cardphotoCreateApplyRaw)
  const isCardphotoCreateCropActive = cardphotoCreateCropState === 'active'
  /**
   * Create с загруженным фото — upper: applyMedium | quality | close (без cardphoto section).
   */
  const showCardphotoCreateUpper =
    activeSection === 'cardphoto' &&
    cardphotoAssetToolbar === 'cardphotoCreate' &&
    isCardphotoCreateSession
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
  /** Desktop: CardPie square = sizeMiniCard.height. Mobile: --mobile-pie-size. */
  const cardphotoUpperQualityStyle = useMemo((): React.CSSProperties | undefined => {
    if (isMobileLayout) return undefined
    const w = sizeMiniCard?.height
    if (w == null || w <= 0) return undefined
    return { width: `${w}px` }
  }, [isMobileLayout, sizeMiniCard?.height])
  const showDateCalendarNav =
    activeSection === 'date' || activeSection === 'history'
  const showAromaUpperToolbar = activeSection === 'aroma'

  return (
    <div
      className={clsx(
        styles.cardSectionToolbar,
        showDateCalendarNav && styles.cardSectionToolbarDateNav,
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
            <div
              className={styles.cardSectionToolbarUpperCenter}
              style={cardphotoUpperQualityStyle}
            >
              <CardphotoPrintQualitySlot
                disabled={!isCardphotoCreateCropActive}
                fillWidth
              />
            </div>
            <div className={styles.cardSectionToolbarUpperReturn}>
              <Toolbar
                section="cardphotoCreate"
                groupsOverride={CARDPHOTO_CREATE_UPPER_CLOSE_TOOLBAR}
                className={toolbarStyles.toolbarAromaUpperReturn}
              />
            </div>
          </div>
      ) : (
        <div
          className={clsx(
            styles.cardSectionToolbarHeader,
            styles.cardSectionToolbarPhotoTextKeys,
            isMobileLayout && styles.cardSectionToolbarCardphotoTint,
          )}
        >
          <Toolbar section="cardphoto" />
        </div>
      ))}
      {showDateCalendarNav && <MobileDateCalendarToolbarNav />}
      {activeSection === 'envelope' && <EnvelopeInnerToolbar />}
      {activeSection === 'cardtext' && (
        <div
          className={clsx(
            styles.cardSectionToolbarHeader,
            styles.cardSectionToolbarPhotoTextKeys,
            isMobileLayout && styles.cardSectionToolbarCardtextTint,
          )}
        >
          <Toolbar section="cardtext" />
        </div>
      )}
      {showAromaUpperToolbar ? (
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
