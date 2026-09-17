import React, { useMemo } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { useSenderFacade } from '@envelope/sender/application/facades'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import {
  selectActiveAddressEdit,
  selectAddressCreateEditContext,
} from '@envelope/infrastructure/selectors'
import { selectSenderApplied, selectSenderView, selectSenderEntriesState } from '@envelope/sender/infrastructure/selectors'
import {
  selectRecipientView,
  selectRecipientEntriesState,
} from '@envelope/recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
  selectArchiveSandboxSender,
  selectArchiveSandboxSenderApplied,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
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
import styles from './Envelope.module.scss'

type UseEnvelopeAddressViewToolbarContentOptions = {
  enabled: boolean
  /** Mobile-only history list-row peek tint band. */
  includeHistoryListPeek?: boolean
  /**
   * `envelopeSlot` — mint bar inside Recipients (desktop and mobile).
   * `factory` — lower factory row (mobile + both-applied peek).
   */
  variant?: 'factory' | 'envelopeSlot'
}

export function useEnvelopeAddressViewToolbarContent({
  enabled,
  includeHistoryListPeek = false,
  variant = 'factory',
}: UseEnvelopeAddressViewToolbarContentOptions): React.ReactNode {
  const isMobile = useAppSelector(selectIsMobileLayout)
  const {
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
    archiveCartEnvelopeSimplifiedPeek,
  } = useMobileFactoryListChrome()
  const { rightPieEnvelopePeekNoToolbar } = useRightListArchiveMini()
  const historyEnvelopeListPeek =
    includeHistoryListPeek &&
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
  const envelopeFacade = useEnvelopeFacade()
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()
  const recipientsFormViewIdsCount = recipientFacade.recipientsDisplayList.length
  const addressCreateEditContext = useAppSelector(selectAddressCreateEditContext)
  const desktopKeepLowerRecipientsDuringCreate =
    !isMobile &&
    recipientView === 'recipientCreate' &&
    recipientsFormViewIdsCount >= 1
  const desktopSingleRecipientCreateKeep =
    desktopKeepLowerRecipientsDuringCreate &&
    recipientsFormViewIdsCount === 1
  const recipientsMultiListReady = recipientsFormViewIdsCount > 1
  const sessionSenderAppliedIds = useAppSelector(selectSenderApplied)
  const sandboxSenderAppliedIds = useAppSelector(
    selectArchiveSandboxSenderApplied,
  )
  const senderAppliedIds = sandboxActive
    ? sandboxSenderAppliedIds
    : sessionSenderAppliedIds
  const activeAddressEdit = useAppSelector(selectActiveAddressEdit)
  const senderEntries = useAppSelector(selectSenderEntriesState)
  const recipientEntries = useAppSelector(selectRecipientEntriesState)

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
    addressCreateEditContext?.role === 'recipient'
      ? addressCreateEditContext.templateId
      : activeAddressEdit?.role === 'recipient'
        ? activeAddressEdit.templateId
        : sandboxActive
          ? sandboxRecipient.recipientViewId
          : envelopeFacade.recipientTemplateId

  const recipientDisplayEntry = useMemo((): AddressBookEntry | null => {
    if (desktopSingleRecipientCreateKeep) {
      return recipientFacade.recipientsDisplayList[0] ?? null
    }
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
    desktopSingleRecipientCreateKeep,
    recipientFacade.recipientsDisplayList,
    recipientView,
    recipientIdForDisplay,
    recipientEntries,
    recipientAddress,
  ])

  /** Lower View toolbar follows recipient; both applied → neutral tint band only. */
  const activeViewRole = bothFormsApplied ? null : 'recipient'

  const senderToolbarSlot = false

  const recipientChromeSlot =
    enabled &&
    activeViewRole === 'recipient' &&
    !assemblyRecipientSimplifiedPeek

  const recipientToolbarSlot =
    recipientChromeSlot &&
    (recipientView !== 'recipientCreate' ||
      desktopKeepLowerRecipientsDuringCreate)

  const showRecipientCreateToolbar =
    enabled &&
    isMobile &&
    activeViewRole === 'recipient' &&
    recipientView === 'recipientCreate' &&
    !assemblyRecipientSimplifiedPeek

  const bothAppliedToolbarSlot = enabled && bothFormsApplied

  const showSenderToolbar =
    senderToolbarSlot &&
    senderView === 'senderView' &&
    senderFacade.isEnabled &&
    senderDisplayEntry != null

  const showRecipientToolbar =
    recipientToolbarSlot &&
    (recipientView === 'recipientView' || desktopSingleRecipientCreateKeep) &&
    recipientDisplayEntry != null &&
    recipientsFormViewIdsCount <= 1

  const showRecipientsMultiToolbar =
    recipientToolbarSlot &&
    (recipientView === 'recipientsView' ||
      recipientView === 'recipientView' ||
      desktopKeepLowerRecipientsDuringCreate) &&
    recipientsMultiListReady

  const section: 'recipientView' | 'recipients' | null =
    showRecipientToolbar
      ? 'recipientView'
      : showRecipientsMultiToolbar
        ? 'recipients'
        : null

  const addressViewInQuickList =
    section === 'recipientView' &&
    recipientDisplayEntry != null &&
    listStatusIsInQuickAddressBook(recipientDisplayEntry.listStatus)

  const addressViewToolbar = useMemo((): ToolbarConfig => {
    if (section === 'recipientView' && recipientsFormViewIdsCount > 1) {
      return ENVELOPE_MOBILE_ADDRESS_VIEW_RETURN_TOOLBAR
    }
    return addressViewInQuickList
      ? ENVELOPE_MOBILE_ADDRESS_VIEW_TOOLBAR
      : ENVELOPE_MOBILE_ADDRESS_VIEW_DELETE_TOOLBAR
  }, [addressViewInQuickList, recipientsFormViewIdsCount, section])

  const slotRole: 'sender' | 'recipient' | 'complete' | null =
    bothAppliedToolbarSlot
      ? 'complete'
      : senderToolbarSlot
        ? 'sender'
        : recipientChromeSlot || showRecipientCreateToolbar
          ? 'recipient'
          : null

  const hostRecipientChromeInEnvelopeSlot =
    slotRole === 'recipient' &&
    !bothAppliedToolbarSlot &&
    !showRecipientCreateToolbar

  const toolbarInner =
    showRecipientCreateToolbar ? (
      <Toolbar section="recipientCreate" />
    ) : section === 'recipientView' ? (
      <Toolbar section={section} groupsOverride={addressViewToolbar} />
    ) : section === 'recipients' ? (
      <Toolbar
        section="recipients"
        groupsOverride={ENVELOPE_MOBILE_RECIPIENTS_MULTI_VIEW_TOOLBAR}
        justifyGroupsEnd
      />
    ) : null

  if (variant === 'envelopeSlot') {
    if (
      !enabled ||
      !hostRecipientChromeInEnvelopeSlot ||
      toolbarInner == null
    ) {
      return null
    }
    return toolbarInner
  }

  if (hostRecipientChromeInEnvelopeSlot) {
    if (!isMobile || !enabled) return null
    return (
      <div
        className={clsx(
          styles.envelopeAddressViewToolbarRow,
          styles.envelopeAddressViewToolbarRowRecipient,
        )}
        data-envelope-address-view-toolbar
        aria-hidden
      />
    )
  }

  if (slotRole != null) {
    return (
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
          section == null && !showRecipientCreateToolbar ? true : undefined
        }
      >
        {toolbarInner}
      </div>
    )
  }

  if (historyEnvelopeListPeek) {
    return (
      <div
        className={clsx(
          styles.envelopeAddressViewToolbarRow,
          styles.envelopeAddressViewToolbarRowComplete,
        )}
        data-envelope-address-view-toolbar
        aria-hidden
      />
    )
  }

  return null
}
