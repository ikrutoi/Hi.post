import React, { useCallback } from 'react'
import { useAppDispatch } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { toolbarAction } from '@toolbar/application/helpers'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { setCardtextApplyPeekChrome, setCardtextAppliedData } from '@cardtext/infrastructure/state'
import { useCloseArchiveSectionPeek } from '../../application/hooks/useCloseArchiveSectionPeek'
import { useMobileFactoryListChrome } from '../../application/hooks/useMobileFactoryListChrome'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import styles from './ArchivePeekUpperToolbar.module.scss'

const ARCHIVE_PEEK_UPPER_EDIT_TOOLBAR: ToolbarConfig = [
  {
    group: 'edit',
    icons: [{ key: 'editLight', state: 'enabled' }],
    status: 'enabled',
  },
]

const ARCHIVE_PEEK_UPPER_RETURN_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'enabled' }],
    status: 'enabled',
  },
]

/**
 * Верхний ряд factory toolbar в упрощённом режиме:
 * archive peek и сборная cardtext после Apply — editLight слева, return справа.
 * Для сборной cardtext peek chrome = «apply»; editLight снимает apply.
 */
export const ArchivePeekUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { closeArchiveSectionPeek, isArchiveSectionPeekActive } =
    useCloseArchiveSectionPeek()
  const { assemblyCardtextSimplifiedPeek } = useMobileFactoryListChrome()
  const { requestSectionEditFromPeek } = useRightListArchiveMini()

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key === 'editLight') {
        if (isArchiveSectionPeekActive) {
          requestSectionEditFromPeek?.()
        } else if (assemblyCardtextSimplifiedPeek) {
          /**
           * Peek chrome = применённый apply.
           * editLight снимает apply и открывает обычные тулбары (cardtext / cardtextView).
           */
          dispatch(setCardtextAppliedData(null))
          dispatch(setCardtextApplyPeekChrome(false))
        }
        return false
      }
      if (key === 'return') {
        if (isArchiveSectionPeekActive) {
          closeArchiveSectionPeek()
        } else if (assemblyCardtextSimplifiedPeek) {
          /** return — выйти, apply остаётся на открытке. */
          dispatch(setCardtextApplyPeekChrome(false))
          dispatch(
            toolbarAction({ section: 'cardtextView', key: 'close' } as const),
          )
        }
        return false
      }
    },
    [
      assemblyCardtextSimplifiedPeek,
      closeArchiveSectionPeek,
      dispatch,
      isArchiveSectionPeekActive,
      requestSectionEditFromPeek,
    ],
  )

  return (
    <div className={styles.upperRow}>
      <div className={styles.sideLeft}>
        <Toolbar
          section="date"
          groupsOverride={ARCHIVE_PEEK_UPPER_EDIT_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
      <div className={styles.upperSpacer} aria-hidden />
      <div className={styles.upperToolbar}>
        <Toolbar
          section="date"
          groupsOverride={ARCHIVE_PEEK_UPPER_RETURN_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
    </div>
  )
}
