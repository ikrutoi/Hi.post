import React, { useCallback } from 'react'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { useCloseArchiveSectionPeek } from '../../application/hooks/useCloseArchiveSectionPeek'
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

/** Верхний ряд factory toolbar в peek архива: editLight слева, return справа. */
export const ArchivePeekUpperToolbar: React.FC = () => {
  const { closeArchiveSectionPeek } = useCloseArchiveSectionPeek()
  const { requestSectionEditFromPeek } = useRightListArchiveMini()

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key === 'editLight') {
        requestSectionEditFromPeek?.()
        return false
      }
      if (key === 'return') {
        closeArchiveSectionPeek()
        return false
      }
    },
    [closeArchiveSectionPeek, requestSectionEditFromPeek],
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
