import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { CardPanelSection } from '@cardPanel/domain/types'
import {
  applyArchiveSectionToEditorRequested,
  revertMirrorSectionCopyRequested,
} from '@cardPanel/infrastructure/state'
import { selectMirrorSectionBackup } from '@cardPanel/infrastructure/selectors/mirrorSectionBackupSelectors'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { getCurrentDate } from '@shared/utils/date'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { useCloseArchiveSectionPeek } from './useCloseArchiveSectionPeek'

const ARCHIVE_PEEK_COPYABLE_SECTIONS = new Set<CardPanelSection>([
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
])

/**
 * Archive peek (cart / history): copy section into factory.
 * Toggle: first click apply + backup; second revert from backup.
 */
export function useArchivePeekCopy() {
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)
  const { isArchiveSectionPeekActive } = useCloseArchiveSectionPeek()
  const {
    mirrorTargetLocalId,
    listRowLocalId,
    mirrorInner,
    listRowInner,
  } = useRightListArchiveMini()

  const section =
    activeSection != null &&
    ARCHIVE_PEEK_COPYABLE_SECTIONS.has(activeSection as CardPanelSection)
      ? (activeSection as CardPanelSection)
      : null

  const sectionBackup = useAppSelector((state) =>
    section != null ? selectMirrorSectionBackup(state, section) : undefined,
  )
  const isSectionCopied = sectionBackup != null

  const sourceLocalId = mirrorTargetLocalId ?? listRowLocalId
  const dates = (mirrorInner ?? listRowInner)?.dates ?? []

  const dateCopyBlocked =
    section === 'date' &&
    (dates.length === 0 ||
      dates.every((d) =>
        isDispatchDateDisabledForOrder(d, getCurrentDate()),
      ))

  const canApplyCopy =
    sourceLocalId != null && section != null && !dateCopyBlocked

  const canInteract = isSectionCopied || canApplyCopy
  const showCopy = isArchiveSectionPeekActive && section != null

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

  const handleCopyAction = useCallback(
    (key: IconKey) => {
      if (key !== 'copy' || section == null) return false

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
    [canApplyCopy, dispatch, isSectionCopied, section, sourceLocalId],
  )

  return { showCopy, groupsOverride, handleCopyAction }
}
