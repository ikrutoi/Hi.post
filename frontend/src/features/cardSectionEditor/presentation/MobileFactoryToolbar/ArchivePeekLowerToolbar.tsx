import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import type { CardPanelSection } from '@cardPanel/domain/types'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { applyArchiveSectionToEditorRequested } from '@cardPanel/infrastructure/state'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import { getCurrentDate } from '@shared/utils/date'
import { useCloseArchiveSectionPeek } from '../../application/hooks/useCloseArchiveSectionPeek'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import styles from './ArchivePeekUpperToolbar.module.scss'

const ARCHIVE_PEEK_COPYABLE_SECTIONS = new Set<CardPanelSection>([
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
])

/**
 * Нижний ряд factory toolbar в archive peek (Корзина / История):
 * tint секции + copy слева — копирует секцию в фабрику сборки.
 * Date: disabled, если все даты секции уже нельзя выбрать в календаре заказа.
 */
export const ArchivePeekLowerToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)
  const { isArchiveSectionPeekActive } = useCloseArchiveSectionPeek()
  const {
    rightPieDatePeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
    mirrorTargetLocalId,
    listRowLocalId,
    mirrorInner,
    listRowInner,
  } = useRightListArchiveMini()

  const sourceLocalId = mirrorTargetLocalId ?? listRowLocalId
  const dateInner = mirrorInner ?? listRowInner
  const dates = dateInner?.dates ?? []

  /**
   * Как в секции «Дата»: нельзя выбрать дни раньше порога заказа.
   * Если все даты peek-секции уже недоступны — copy disabled.
   */
  const dateCopyBlocked =
    activeSection === 'date' &&
    (dates.length === 0 ||
      dates.every((d) =>
        isDispatchDateDisabledForOrder(d, getCurrentDate()),
      ))

  const canCopy =
    sourceLocalId != null &&
    activeSection != null &&
    ARCHIVE_PEEK_COPYABLE_SECTIONS.has(activeSection as CardPanelSection) &&
    !dateCopyBlocked

  const aromaTint =
    isArchiveSectionPeekActive && activeSection === 'aroma'
  const cardtextTint =
    isArchiveSectionPeekActive && activeSection === 'cardtext'
  const cardphotoTint =
    isArchiveSectionPeekActive && activeSection === 'cardphoto'
  const dateTint = rightPieDatePeekNoToolbar
  const envelopeTint = rightPieEnvelopePeekNoToolbar

  const groupsOverride = useMemo((): ToolbarConfig => {
    return [
      {
        group: 'copy',
        icons: [
          {
            key: 'copy',
            state: canCopy ? 'enabled' : 'disabled',
          },
        ],
        status: canCopy ? 'enabled' : 'disabled',
      },
    ]
  }, [canCopy])

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key !== 'copy') return
      if (!canCopy || activeSection == null || sourceLocalId == null) {
        return false
      }
      dispatch(
        applyArchiveSectionToEditorRequested({
          section: activeSection as CardPanelSection,
          sourceLocalId,
        }),
      )
      return false
    },
    [activeSection, canCopy, dispatch, sourceLocalId],
  )

  return (
    <div
      className={clsx(
        styles.upperRow,
        aromaTint && styles.upperRowAroma,
        cardtextTint && styles.upperRowCardtext,
        cardphotoTint && styles.upperRowCardphoto,
        dateTint && styles.upperRowDate,
        envelopeTint && styles.upperRowEnvelope,
      )}
    >
      <div className={styles.sideLeft}>
        <Toolbar
          section="date"
          groupsOverride={groupsOverride}
          onActionClick={handleAction}
        />
      </div>
      <div className={styles.upperSpacer} aria-hidden />
    </div>
  )
}
