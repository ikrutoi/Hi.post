import React, { useCallback } from 'react'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { useCloseArchiveSectionPeek } from '../../application/hooks/useCloseArchiveSectionPeek'
import styles from './ArchivePeekUpperToolbar.module.scss'

const ARCHIVE_PEEK_UPPER_RETURN_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'enabled' }],
    status: 'enabled',
  },
]

/** Верхний ряд factory toolbar в peek архива: return справа → календарь / список. */
export const ArchivePeekUpperToolbar: React.FC = () => {
  const { closeArchiveSectionPeek } = useCloseArchiveSectionPeek()

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key !== 'return') return
      closeArchiveSectionPeek()
      return false
    },
    [closeArchiveSectionPeek],
  )

  return (
    <div className={styles.upperRow}>
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
