import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import type { CardPanelSection } from '@cardPanel/domain/types'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  applyArchiveSectionToEditorRequested,
  revertMirrorSectionCopyRequested,
} from '@cardPanel/infrastructure/state'
import { selectMirrorSectionBackup } from '@cardPanel/infrastructure/selectors/mirrorSectionBackupSelectors'
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
 * tint + copy (enabled/disabled only — без active после apply).
 * Тоггл: 1-й клик → apply + backup фабрики; 2-й → revert из backup.
 */
export const ArchivePeekLowerToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)
  const sectionBackup = useAppSelector((state) =>
    activeSection != null &&
    ARCHIVE_PEEK_COPYABLE_SECTIONS.has(activeSection as CardPanelSection)
      ? selectMirrorSectionBackup(state, activeSection as CardPanelSection)
      : undefined,
  )
  const isSectionCopied = sectionBackup != null
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
   * Если все даты peek-секции уже недоступны — новый copy disabled
   * (revert по backup всё ещё доступен).
   */
  const dateCopyBlocked =
    activeSection === 'date' &&
    (dates.length === 0 ||
      dates.every((d) =>
        isDispatchDateDisabledForOrder(d, getCurrentDate()),
      ))

  const canApplyCopy =
    sourceLocalId != null &&
    activeSection != null &&
    ARCHIVE_PEEK_COPYABLE_SECTIONS.has(activeSection as CardPanelSection) &&
    !dateCopyBlocked

  /** Interact: apply when allowed, or revert when backup exists. */
  const canInteract = isSectionCopied || canApplyCopy

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
            /** Без `active` — визуально не отличаем после первого клика. */
            state: canInteract ? 'enabled' : 'disabled',
          },
        ],
        status: canInteract ? 'enabled' : 'disabled',
      },
    ]
  }, [canInteract])

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key !== 'copy') return
      if (
        activeSection == null ||
        !ARCHIVE_PEEK_COPYABLE_SECTIONS.has(activeSection as CardPanelSection)
      ) {
        return false
      }
      const section = activeSection as CardPanelSection

      if (isSectionCopied) {
        dispatch(revertMirrorSectionCopyRequested({ section }))
        return false
      }

      if (!canApplyCopy || sourceLocalId == null) {
        return false
      }
      dispatch(
        applyArchiveSectionToEditorRequested({
          section,
          sourceLocalId,
        }),
      )
      return false
    },
    [
      activeSection,
      canApplyCopy,
      dispatch,
      isSectionCopied,
      sourceLocalId,
    ],
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
