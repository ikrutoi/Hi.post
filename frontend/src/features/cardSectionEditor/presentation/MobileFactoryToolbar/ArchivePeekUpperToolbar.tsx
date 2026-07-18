import React, { useCallback } from 'react'
import { useAppDispatch } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { setCardtextApplyPeekChrome, setCardtextAppliedData } from '@cardtext/infrastructure/state'
import { clearApply } from '@cardphoto/infrastructure/state'
import { clearApplied as clearAromaApplied } from '@aroma/infrastructure/state'
import { useCloseArchiveSectionPeek } from '../../application/hooks/useCloseArchiveSectionPeek'
import { useMobileFactoryListChrome } from '../../application/hooks/useMobileFactoryListChrome'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import styles from './ArchivePeekUpperToolbar.module.scss'

const ARCHIVE_PEEK_UPPER_EDIT_TOOLBAR: ToolbarConfig = [
  {
    group: 'edit',
    icons: [{ key: 'postcardEdit', state: 'enabled' }],
    status: 'enabled',
  },
]

const ARCHIVE_PEEK_UPPER_CLOSE_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'closeBig', state: 'enabled' }],
    status: 'enabled',
  },
]

/**
 * Верхний ряд factory toolbar в упрощённом режиме:
 * archive peek — postcardEdit слева, closeBig справа;
 * сборная cardtext/cardphoto/aroma — только postcardEdit.
 */
export const ArchivePeekUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { closeArchiveSectionPeek, isArchiveSectionPeekActive } =
    useCloseArchiveSectionPeek()
  const {
    assemblyCardtextSimplifiedPeek,
    assemblyCardphotoSimplifiedPeek,
    assemblyAromaSimplifiedPeek,
    assemblySectionSimplifiedPeek,
  } = useMobileFactoryListChrome()
  const { requestSectionEditFromPeek } = useRightListArchiveMini()

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key === 'postcardEdit') {
        if (isArchiveSectionPeekActive) {
          requestSectionEditFromPeek?.()
        } else if (assemblyCardtextSimplifiedPeek) {
          /**
           * Peek = текст уже на открытке (applied).
           * postcardEdit снимает apply → обычные тулбары cardtext / cardtextView.
           */
          dispatch(setCardtextAppliedData(null))
          dispatch(setCardtextApplyPeekChrome(false))
        } else if (assemblyCardphotoSimplifiedPeek) {
          /** Peek = фото уже на открытке; postcardEdit снимает apply. */
          dispatch(clearApply())
        } else if (assemblyAromaSimplifiedPeek) {
          /** Peek = aroma уже на открытке; postcardEdit снимает apply. */
          dispatch(clearAromaApplied())
        }
        return false
      }
      if (key === 'closeBig' && isArchiveSectionPeekActive) {
        closeArchiveSectionPeek()
        return false
      }
    },
    [
      assemblyAromaSimplifiedPeek,
      assemblyCardphotoSimplifiedPeek,
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
      {!assemblySectionSimplifiedPeek ? (
        <div className={styles.upperToolbar}>
          <Toolbar
            section="date"
            groupsOverride={ARCHIVE_PEEK_UPPER_CLOSE_TOOLBAR}
            onActionClick={handleAction}
          />
        </div>
      ) : null}
    </div>
  )
}
