import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectCardPieCopyStripExpanded } from '@cart/infrastructure/selectors'
import { setCardPieCopyStripExpanded } from '@cart/infrastructure/state'
import { useCloseArchiveSectionPeek } from '../../application/hooks/useCloseArchiveSectionPeek'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import styles from './ArchivePeekUpperToolbar.module.scss'

const ARCHIVE_PEEK_LOWER_COPY_TOOLBAR: ToolbarConfig = [
  {
    group: 'copy',
    icons: [{ key: 'copy', state: 'enabled' }],
    status: 'enabled',
  },
]

/**
 * Нижний ряд factory toolbar в archive peek (Корзина / История):
 * tint секции + copy слева (всегда enabled).
 */
export const ArchivePeekLowerToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
  const { isArchiveSectionPeekActive } = useCloseArchiveSectionPeek()
  const { rightPieDatePeekNoToolbar, rightPieEnvelopePeekNoToolbar } =
    useRightListArchiveMini()

  const aromaTint =
    isArchiveSectionPeekActive && activeSection === 'aroma'
  const cardtextTint =
    isArchiveSectionPeekActive && activeSection === 'cardtext'
  const cardphotoTint =
    isArchiveSectionPeekActive && activeSection === 'cardphoto'
  const dateTint = rightPieDatePeekNoToolbar
  const envelopeTint = rightPieEnvelopePeekNoToolbar

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key === 'copy') {
        dispatch(setCardPieCopyStripExpanded(!cardPieCopyStripExpanded))
        return false
      }
    },
    [cardPieCopyStripExpanded, dispatch],
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
          groupsOverride={ARCHIVE_PEEK_LOWER_COPY_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
      <div className={styles.upperSpacer} aria-hidden />
    </div>
  )
}
