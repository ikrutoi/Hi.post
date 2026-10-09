import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
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
    icons: [{ key: 'close', state: 'enabled' }],
    status: 'enabled',
  },
]

/**
 * Верхний ряд тулбара корзины/истории в упрощённом виде.
 * Сборка этот ряд не использует.
 */
export const ArchivePeekUpperToolbar: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
  const { isArchiveSectionPeekActive } = useCloseArchiveSectionPeek()
  const { showArchivePeekEditToolbar } = useMobileFactoryListChrome()
  const {
    requestSectionEditFromPeek,
    requestExitArchiveMode,
    requestCloseArchiveSectionPeek,
    rightPieDatePeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
  } = useRightListArchiveMini()

  if (!isArchiveSectionPeekActive) return null

  const peekToolbarSection =
    activeSection === 'cardtext'
      ? 'cardtext'
      : activeSection === 'envelope'
        ? 'recipients'
        : activeSection === 'aroma'
          ? 'aroma'
          : activeSection === 'date'
            ? 'date'
            : 'cardphoto'

  return (
    <div
      className={clsx(
        styles.upperRow,
        activeSection === 'aroma' && styles.upperRowAroma,
        activeSection === 'cardtext' && styles.upperRowCardtext,
        activeSection === 'cardphoto' && styles.upperRowCardphoto,
        rightPieDatePeekNoToolbar && styles.upperRowDate,
        rightPieEnvelopePeekNoToolbar && styles.upperRowEnvelope,
      )}
    >
      {showArchivePeekEditToolbar ? (
        <div className={styles.sideLeft}>
          <Toolbar
            section={peekToolbarSection}
            groupsOverride={ARCHIVE_PEEK_UPPER_EDIT_TOOLBAR}
            onActionClick={(key) => {
              if (key !== 'postcardEdit') return false
              requestSectionEditFromPeek?.()
              return false
            }}
          />
        </div>
      ) : null}
      <div className={styles.upperSpacer} aria-hidden />
      <div className={styles.sideRight}>
        <Toolbar
          section={peekToolbarSection}
          groupsOverride={ARCHIVE_PEEK_UPPER_CLOSE_TOOLBAR}
          onActionClick={(key) => {
            if (key !== 'close') return false
            if (!isMobileLayout) requestCloseArchiveSectionPeek?.()
            else requestExitArchiveMode?.()
            return false
          }}
        />
      </div>
    </div>
  )
}
