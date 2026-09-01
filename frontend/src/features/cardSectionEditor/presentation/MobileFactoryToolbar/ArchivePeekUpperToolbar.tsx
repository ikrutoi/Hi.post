import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { setCardtextApplyPeekChrome, setCardtextAppliedData } from '@cardtext/infrastructure/state'
import { clearApply } from '@cardphoto/infrastructure/state'
import { clearApplied as clearAromaApplied } from '@aroma/infrastructure/state'
import { clearAppliedDates } from '@date/infrastructure/state'
import { setRecipientApplied } from '@envelope/recipient/infrastructure/state'
import { setArchiveRecipientApplied } from '@cardPanel/infrastructure/state'
import {
  selectArchiveEnvelopeSandboxActive,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
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
 * (archive peek и сборная после Apply: cardtext / cardphoto / aroma / date / envelope).
 */
export const ArchivePeekUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeSection = useAppSelector(selectActiveSection)
  const { isArchiveSectionPeekActive } = useCloseArchiveSectionPeek()
  const {
    assemblyCardtextSimplifiedPeek,
    assemblyCardphotoSimplifiedPeek,
    assemblyAromaSimplifiedPeek,
    assemblyDateSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
    showArchivePeekEditToolbar,
  } = useMobileFactoryListChrome()
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const {
    requestSectionEditFromPeek,
    rightPieDatePeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
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
  /** Date: assembly apply-peek или archive date sector peek. */
  const dateTint =
    assemblyDateSimplifiedPeek || rightPieDatePeekNoToolbar
  /** History/list-row envelope peek (cart uses EnvelopeInnerToolbar). */
  const envelopeTint =
    rightPieEnvelopePeekNoToolbar || assemblyRecipientSimplifiedPeek

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
        } else if (assemblyDateSimplifiedPeek) {
          /** Peek = даты уже на открытке; postcardEdit снимает apply → календарь. */
          dispatch(clearAppliedDates())
        } else if (assemblyRecipientSimplifiedPeek) {
          /** Peek = recipient уже на открытке; postcardEdit снимает apply. */
          if (sandboxActive) {
            dispatch(setArchiveRecipientApplied(false))
          } else {
            dispatch(setRecipientApplied(false))
          }
        }
        return false
      }
    },
    [
      assemblyAromaSimplifiedPeek,
      assemblyCardphotoSimplifiedPeek,
      assemblyCardtextSimplifiedPeek,
      assemblyDateSimplifiedPeek,
      assemblyRecipientSimplifiedPeek,
      dispatch,
      isArchiveSectionPeekActive,
      requestSectionEditFromPeek,
      sandboxActive,
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
      {showArchivePeekEditToolbar ? (
        <div className={styles.sideLeft}>
          <Toolbar
            section={
              activeSection === 'cardphoto' ||
              activeSection === 'cardtext' ||
              activeSection === 'envelope' ||
              activeSection === 'aroma' ||
              activeSection === 'date'
                ? activeSection
                : 'cardphoto'
            }
            groupsOverride={ARCHIVE_PEEK_UPPER_EDIT_TOOLBAR}
            onActionClick={handleAction}
          />
        </div>
      ) : null}
      <div className={styles.upperSpacer} aria-hidden />
    </div>
  )
}
