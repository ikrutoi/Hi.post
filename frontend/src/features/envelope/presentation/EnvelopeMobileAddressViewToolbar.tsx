import React, { useMemo } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { useSenderFacade } from '@envelope/sender/application/facades'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import { selectActiveAddressEdit } from '@envelope/infrastructure/selectors'
import { selectSenderApplied, selectSenderView } from '@envelope/sender/infrastructure/selectors'
import {
  selectRecipientView,
  selectRecipientsFormViewIdsCount,
  selectRecipientState,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
  selectArchiveSandboxSender,
  selectArchiveSandboxSenderApplied,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import {
  ENVELOPE_MOBILE_ADDRESS_VIEW_TOOLBAR,
  ENVELOPE_MOBILE_ADDRESS_VIEW_DELETE_TOOLBAR,
  ENVELOPE_MOBILE_ADDRESS_VIEW_RETURN_TOOLBAR,
  ENVELOPE_MOBILE_RECIPIENTS_MULTI_VIEW_TOOLBAR,
} from '@toolbar/domain/types/addressView.types'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { listStatusIsInQuickAddressBook } from '@envelope/domain/helpers'
import {
  selectRecipientViewEditMode,
  selectSenderViewEditMode,
} from '@envelope/infrastructure/selectors'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import { RecipientsBrowseToolbar } from '@envelope/addressForm/presentation/RecipientsBrowseToolbar'
import styles from './Envelope.module.scss'

type EnvelopeMobileAddressViewToolbarProps = {
  enabled: boolean
}

export const EnvelopeMobileAddressViewToolbar: React.FC<
  EnvelopeMobileAddressViewToolbarProps
> = ({ enabled }) => {
  const isMobile = useAppSelector(selectIsMobileLayout)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const {
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
    archiveCartEnvelopeSimplifiedPeek,
    cardPieEditEngaged,
  } = useMobileFactoryListChrome()
  const { rightPieEnvelopePeekNoToolbar } = useRightListArchiveMini()
  /**
   * History list-row envelope peek: tools are off, but keep the complete tint
   * band in the factory lower row (same as other section peeks).
   */
  const historyEnvelopeListPeek =
    isMobile &&
    rightPieEnvelopePeekNoToolbar &&
    !archiveCartEnvelopeSimplifiedPeek
  const bothFormsApplied =
    assemblySenderSimplifiedPeek && assemblyRecipientSimplifiedPeek
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxSender = useAppSelector(selectArchiveSandboxSender)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sessionSenderView = useAppSelector(selectSenderView)
  const sessionRecipientView = useAppSelector(selectRecipientView)
  const senderView = sandboxActive
    ? sandboxSender.currentView
    : sessionSenderView
  const recipientView = sandboxActive
    ? sandboxRecipient.currentView
    : sessionRecipientView
  const recipientsFormViewIdsCount = useAppSelector(
    selectRecipientsFormViewIdsCount,
  )
  const recipientState = useAppSelector(selectRecipientState)
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const addressEditActive =
    senderViewEditMode || recipientViewEditMode || cardPieEditEngaged
  const recipientsMultiListReady = useMemo(() => {
    if (sandboxActive) {
      const first =
        sandboxRecipient.recipientsViewIdsFirstList?.length ?? 0
      const second =
        sandboxRecipient.recipientsViewIdsSecondList?.length ?? 0
      return first > 1 || second > 1
    }
    const first = recipientState?.recipientsViewIdsFirstList?.length ?? 0
    const second = recipientState?.recipientsViewIdsSecondList?.length ?? 0
    return first > 1 || second > 1
  }, [sandboxActive, sandboxRecipient, recipientState])
  const envelopeFacade = useEnvelopeFacade()
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()
  const sessionSenderAppliedIds = useAppSelector(selectSenderApplied)
  const sandboxSenderAppliedIds = useAppSelector(
    selectArchiveSandboxSenderApplied,
  )
  const senderAppliedIds = sandboxActive
    ? sandboxSenderAppliedIds
    : sessionSenderAppliedIds
  const activeAddressEdit = useAppSelector(selectActiveAddressEdit)
  const senderEntries = useAppSelector(
    (state) => state.addressBook?.senderEntries ?? [],
  )
  const recipientEntries = useAppSelector(
    (state) => state.addressBook?.recipientEntries ?? [],
  )

  const senderAddress = senderFacade.address
  const recipientAddress = recipientFacade.address

  const senderIdForDisplay =
    activeAddressEdit?.role === 'sender'
      ? activeAddressEdit.templateId
      : sandboxActive
        ? (sandboxSender.senderViewId ?? senderAppliedIds[0] ?? null)
        : (envelopeFacade.senderTemplateId ?? senderAppliedIds[0] ?? null)

  const senderDisplayEntry = useMemo((): AddressBookEntry | null => {
    if (!senderFacade.isEnabled || !senderIdForDisplay) return null
    const fromBook = senderEntries.find((e) => e.id === senderIdForDisplay)
    if (fromBook) return fromBook
    if (!Object.values(senderAddress).some((v) => (v ?? '').trim() !== '')) {
      return null
    }
    return {
      id: senderIdForDisplay,
      role: 'sender',
      address: { ...senderAddress },
      createdAt: new Date().toISOString(),
    }
  }, [
    senderFacade.isEnabled,
    senderIdForDisplay,
    senderEntries,
    senderAddress,
  ])

  const recipientIdForDisplay =
    activeAddressEdit?.role === 'recipient'
      ? activeAddressEdit.templateId
      : sandboxActive
        ? sandboxRecipient.recipientViewId
        : envelopeFacade.recipientTemplateId

  const recipientDisplayEntry = useMemo((): AddressBookEntry | null => {
    if (recipientView !== 'recipientView' || recipientIdForDisplay == null) {
      return null
    }
    const fromBook = recipientEntries.find((e) => e.id === recipientIdForDisplay)
    if (fromBook) return fromBook
    if (!Object.values(recipientAddress).some((v) => (v ?? '').trim() !== '')) {
      return null
    }
    return {
      id: recipientIdForDisplay,
      role: 'recipient',
      address: { ...recipientAddress },
      createdAt: new Date().toISOString(),
    }
  }, [
    recipientView,
    recipientIdForDisplay,
    recipientEntries,
    recipientAddress,
  ])

  /** Lower View toolbar follows dualSide; both applied → neutral tint band only. */
  const activeViewRole = bothFormsApplied
    ? null
    : (mobileFocus?.dualSide ?? 'sender')

  /**
   * Sender: keep the role-colored lower band whenever dualSide is sender
   * and create is closed — including after Close (`senderEnvelopeView`) where
   * there is no View entry / tools yet (otherwise the factory shell stays white).
   */
  const senderToolbarSlot =
    enabled &&
    isMobile &&
    activeViewRole === 'sender' &&
    senderView !== 'senderCreate' &&
    !assemblySenderSimplifiedPeek

  /**
   * Recipient: keep the role-colored lower band whenever dualSide is recipient
   * and create is closed — including empty placeholder (`recipientsView`) where
   * there is no View entry / tools yet (otherwise the factory shell stays white).
   */
  const recipientToolbarSlot =
    enabled &&
    isMobile &&
    activeViewRole === 'recipient' &&
    recipientView !== 'recipientCreate' &&
    !assemblyRecipientSimplifiedPeek

  const bothAppliedToolbarSlot =
    enabled && isMobile && bothFormsApplied

  const showSenderToolbar =
    senderToolbarSlot &&
    senderView === 'senderView' &&
    senderFacade.isEnabled &&
    senderDisplayEntry != null

  const showRecipientToolbar =
    recipientToolbarSlot &&
    recipientView === 'recipientView' &&
    recipientDisplayEntry != null

  const showRecipientsMultiToolbar =
    recipientToolbarSlot &&
    recipientView === 'recipientsView' &&
    recipientsMultiListReady

  /**
   * After both sender + recipient Apply, with multi recipients and no edit:
   * browse chrome (← scale →) — scale length = recipient address count.
   */
  const showRecipientsBrowseToolbar =
    bothAppliedToolbarSlot &&
    recipientsMultiListReady &&
    !addressEditActive

  const section: 'senderView' | 'recipientView' | 'recipients' | null =
    showSenderToolbar
      ? 'senderView'
      : showRecipientToolbar
        ? 'recipientView'
        : showRecipientsMultiToolbar
          ? 'recipients'
          : null

  const addressViewInQuickList =
    section === 'senderView'
      ? senderDisplayEntry != null &&
        listStatusIsInQuickAddressBook(senderDisplayEntry.listStatus)
      : section === 'recipientView'
        ? recipientDisplayEntry != null &&
          listStatusIsInQuickAddressBook(recipientDisplayEntry.listStatus)
        : false

  const addressViewToolbar = useMemo((): ToolbarConfig => {
    if (section === 'recipientView' && recipientsFormViewIdsCount > 1) {
      return ENVELOPE_MOBILE_ADDRESS_VIEW_RETURN_TOOLBAR
    }
    return addressViewInQuickList
      ? ENVELOPE_MOBILE_ADDRESS_VIEW_TOOLBAR
      : ENVELOPE_MOBILE_ADDRESS_VIEW_DELETE_TOOLBAR
  }, [addressViewInQuickList, recipientsFormViewIdsCount, section])

  const slotRole: 'sender' | 'recipient' | 'complete' | null = bothAppliedToolbarSlot
    ? 'complete'
    : senderToolbarSlot
      ? 'sender'
      : recipientToolbarSlot
        ? 'recipient'
        : null

  const mobileContent =
    slotRole != null ? (
      <div
        className={clsx(
          styles.envelopeAddressViewToolbarRow,
          slotRole === 'sender' && styles.envelopeAddressViewToolbarRowSender,
          slotRole === 'recipient' &&
            styles.envelopeAddressViewToolbarRowRecipient,
          slotRole === 'complete' &&
            styles.envelopeAddressViewToolbarRowComplete,
        )}
        data-envelope-address-view-toolbar
        aria-hidden={
          section == null && !showRecipientsBrowseToolbar ? true : undefined
        }
      >
        {section === 'senderView' || section === 'recipientView' ? (
          <Toolbar section={section} groupsOverride={addressViewToolbar} />
        ) : section === 'recipients' ? (
          <Toolbar
            section="recipients"
            groupsOverride={ENVELOPE_MOBILE_RECIPIENTS_MULTI_VIEW_TOOLBAR}
          />
        ) : showRecipientsBrowseToolbar ? (
          <RecipientsBrowseToolbar />
        ) : null}
      </div>
    ) : historyEnvelopeListPeek ? (
      <div
        className={clsx(
          styles.envelopeAddressViewToolbarRow,
          styles.envelopeAddressViewToolbarRowComplete,
        )}
        data-envelope-address-view-toolbar
        aria-hidden
      />
    ) : null

  useMobileScenarioToolbar(
    isMobile && (enabled || historyEnvelopeListPeek) ? mobileContent : null,
  )

  return null
}
