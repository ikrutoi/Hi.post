import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { setCardtextApplyPeekChrome, setCardtextAppliedData } from '@cardtext/infrastructure/state'
import { clearApply } from '@cardphoto/infrastructure/state'
import { clearApplied as clearAromaApplied } from '@aroma/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
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

/**
 * Верхний ряд factory toolbar в упрощённом режиме: только postcardEdit слева
 * (archive peek и сборная cardtext/cardphoto/aroma после Apply).
 */
export const ArchivePeekUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)
  const { isArchiveSectionPeekActive } = useCloseArchiveSectionPeek()
  const {
    assemblyCardtextSimplifiedPeek,
    assemblyCardphotoSimplifiedPeek,
    assemblyAromaSimplifiedPeek,
  } = useMobileFactoryListChrome()
  const {
    requestSectionEditFromPeek,
    rightPieDatePeekNoToolbar,
  } = useRightListArchiveMini()

  const aromaTint =
    assemblyAromaSimplifiedPeek ||
    (isArchiveSectionPeekActive && activeSection === 'aroma')
  const cardtextTint =
    assemblyCardtextSimplifiedPeek ||
    (isArchiveSectionPeekActive && activeSection === 'cardtext')
  const cardphotoTint =
    assemblyCardphotoSimplifiedPeek ||
    (isArchiveSectionPeekActive && activeSection === 'cardphoto')
  /** Date sector peek from cart/history — blue fade even if strip tab is cart. */
  const dateTint = rightPieDatePeekNoToolbar

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
    },
    [
      assemblyAromaSimplifiedPeek,
      assemblyCardphotoSimplifiedPeek,
      assemblyCardtextSimplifiedPeek,
      dispatch,
      isArchiveSectionPeekActive,
      requestSectionEditFromPeek,
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
      )}
    >
      <div className={styles.sideLeft}>
        <Toolbar
          section="date"
          groupsOverride={ARCHIVE_PEEK_UPPER_EDIT_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
      <div className={styles.upperSpacer} aria-hidden />
    </div>
  )
}
