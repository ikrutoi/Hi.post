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
import { useMobileFactoryListChrome } from '../../application/hooks/useMobileFactoryListChrome'
import styles from './ArchivePeekUpperToolbar.module.scss'

const FACTORY_PEEK_UPPER_EDIT_TOOLBAR: ToolbarConfig = [
  {
    group: 'edit',
    icons: [{ key: 'postcardEdit', state: 'enabled' }],
    status: 'enabled',
  },
]

/**
 * Верхний ряд тулбара сборки в упрощённом виде: postcardEdit слева.
 * Copy и Close здесь нет — они только у корзины и истории.
 */
export const FactoryPeekUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const activeSection = useAppSelector(selectActiveSection)
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

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key !== 'postcardEdit') return false
      if (assemblyCardtextSimplifiedPeek) {
        dispatch(setCardtextAppliedData(null))
        dispatch(setCardtextApplyPeekChrome(false))
        openEditorSectionTemplateList(dispatch, 'cardtext', isMobileLayout)
      } else if (assemblyCardphotoSimplifiedPeek) {
        dispatch(clearApply())
        openEditorSectionTemplateList(dispatch, 'cardphoto', isMobileLayout)
      } else if (assemblyAromaSimplifiedPeek) {
        dispatch(clearAromaApplied())
      } else if (assemblyDateSimplifiedPeek) {
        dispatch(clearAppliedDates())
      } else if (assemblyRecipientSimplifiedPeek) {
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
    },
    [
      assemblyAromaSimplifiedPeek,
      assemblyCardphotoSimplifiedPeek,
      assemblyCardtextSimplifiedPeek,
      assemblyDateSimplifiedPeek,
      assemblyRecipientSimplifiedPeek,
      dispatch,
      isMobileLayout,
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
        assemblyAromaSimplifiedPeek && styles.upperRowAroma,
        assemblyCardtextSimplifiedPeek && styles.upperRowCardtext,
        assemblyCardphotoSimplifiedPeek && styles.upperRowCardphoto,
        assemblyDateSimplifiedPeek && styles.upperRowDate,
        assemblyRecipientSimplifiedPeek && styles.upperRowEnvelope,
      )}
    >
      {showArchivePeekEditToolbar ? (
        <div className={styles.sideLeft}>
          <Toolbar
            section={peekToolbarSection}
            groupsOverride={FACTORY_PEEK_UPPER_EDIT_TOOLBAR}
            onActionClick={handleAction}
          />
        </div>
      ) : null}
      <div className={styles.upperSpacer} aria-hidden />
      {showAddressNext ? (
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
