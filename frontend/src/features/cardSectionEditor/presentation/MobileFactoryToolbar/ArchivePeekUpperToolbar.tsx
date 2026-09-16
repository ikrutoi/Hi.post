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
import { AddressNextCycleButton } from './AddressNextCycleButton'
import { DateNextCycleButton } from './DateNextCycleButton'
import { useRecipientsChromeCount } from '@envelope/addressForm/presentation/RecipientsToolbarMark'
import { unapplyRecipientsKeepingSelection } from '@envelope/domain/helpers/unapplyRecipientsKeepingSelection'
import { selectRecipientApplied, selectCurrentRecipientsViewIds } from '@envelope/recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { openEditorSectionTemplateList } from '../../application/helpers'
import { useArchivePeekCopy } from '../../application/hooks/useArchivePeekCopy'
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
 * Верхний ряд factory toolbar в упрощённом режиме:
 * postcardEdit слева; archive peek — Copy справа.
 * (archive peek и сборная после Apply: cardtext / cardphoto / aroma / date / envelope).
 */
export const ArchivePeekUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
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
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sessionAppliedIds = useAppSelector(selectRecipientApplied)
  const sessionViewIds = useAppSelector(selectCurrentRecipientsViewIds)
  const recipientsCount = useRecipientsChromeCount()
  const appliedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const showAddressNext =
    assemblyRecipientSimplifiedPeek && recipientsCount > 1
  const showDateNext =
    assemblyDateSimplifiedPeek && appliedDispatchDates.length > 1
  const {
    requestSectionEditFromPeek,
    rightPieDatePeekNoToolbar,
    rightPieEnvelopePeekNoToolbar,
  } = useRightListArchiveMini()
  const { showCopy, groupsOverride: copyGroupsOverride, handleCopyAction } =
    useArchivePeekCopy()

  const aromaTint =
    assemblyAromaSimplifiedPeek ||
    (isArchiveSectionPeekActive && activeSection === 'aroma')
  const cardtextTint =
    assemblyCardtextSimplifiedPeek ||
    (isArchiveSectionPeekActive && activeSection === 'cardtext')
  const cardphotoTint =
    assemblyCardphotoSimplifiedPeek ||
    (isArchiveSectionPeekActive && activeSection === 'cardphoto')
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
          openEditorSectionTemplateList(dispatch, 'cardtext', isMobileLayout)
        } else if (assemblyCardphotoSimplifiedPeek) {
          /** Peek = фото уже на открытке; postcardEdit снимает apply. */
          dispatch(clearApply())
          openEditorSectionTemplateList(dispatch, 'cardphoto', isMobileLayout)
        } else if (assemblyAromaSimplifiedPeek) {
          /** Peek = aroma уже на открытке; postcardEdit снимает apply. */
          dispatch(clearAromaApplied())
        } else if (assemblyDateSimplifiedPeek) {
          /** Peek = даты уже на открытке; postcardEdit снимает apply → календарь. */
          dispatch(clearAppliedDates())
        } else if (assemblyRecipientSimplifiedPeek) {
          /** Peek = recipient уже на открытке; postcardEdit снимает apply. */
          unapplyRecipientsKeepingSelection(dispatch, {
            sandbox: sandboxActive,
            appliedIds: sandboxActive
              ? (sandboxRecipient.applied ?? [])
              : sessionAppliedIds,
            viewIds: sandboxActive
              ? sandboxRecipient.currentRecipientsList === 'second'
                ? (sandboxRecipient.recipientsViewIdsSecondList ?? [])
                : (sandboxRecipient.recipientsViewIdsFirstList ?? [])
              : sessionViewIds,
          })
          openEditorSectionTemplateList(dispatch, 'envelope', isMobileLayout)
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
      isMobileLayout,
      requestSectionEditFromPeek,
      sandboxActive,
      sandboxRecipient,
      sessionAppliedIds,
      sessionViewIds,
    ],
  )

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
            section={peekToolbarSection}
            groupsOverride={ARCHIVE_PEEK_UPPER_EDIT_TOOLBAR}
            onActionClick={handleAction}
          />
        </div>
      ) : null}
      <div className={styles.upperSpacer} aria-hidden />
      {showCopy ? (
        <div className={styles.sideRight}>
          <Toolbar
            section={peekToolbarSection}
            groupsOverride={copyGroupsOverride}
            onActionClick={handleCopyAction}
          />
        </div>
      ) : showAddressNext ? (
        <div className={styles.sideRight}>
          <AddressNextCycleButton count={recipientsCount} />
        </div>
      ) : showDateNext ? (
        <div className={styles.sideRight}>
          <DateNextCycleButton count={appliedDispatchDates.length} />
        </div>
      ) : null}
    </div>
  )
}
