import React, { useMemo } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { useSenderFacade } from '@envelope/sender/application/facades'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import { selectActiveAddressEdit } from '@envelope/infrastructure/selectors'
import { selectSenderApplied, selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
  selectArchiveSandboxSender,
  selectArchiveSandboxSenderApplied,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { ENVELOPE_MOBILE_ADDRESS_VIEW_TOOLBAR } from '@toolbar/domain/types/addressView.types'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
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
  } = useMobileFactoryListChrome()
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

  /** Lower View toolbar follows dualSide; hidden when both forms are applied. */
  const activeViewRole = bothFormsApplied
    ? null
    : (mobileFocus?.dualSide ?? 'sender')

  /** Keep the role-colored row even when tools are hidden (e.g. sender toggle off). */
  const senderToolbarSlot =
    enabled &&
    isMobile &&
    activeViewRole === 'sender' &&
    senderView === 'senderView' &&
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

  const showSenderToolbar =
    senderToolbarSlot &&
    senderFacade.isEnabled &&
    senderDisplayEntry != null

  const showRecipientToolbar =
    recipientToolbarSlot &&
    recipientView === 'recipientView' &&
    recipientDisplayEntry != null

  const section: 'senderView' | 'recipientView' | null = showSenderToolbar
    ? 'senderView'
    : showRecipientToolbar
      ? 'recipientView'
      : null

  const slotRole: 'sender' | 'recipient' | null = senderToolbarSlot
    ? 'sender'
    : recipientToolbarSlot
      ? 'recipient'
      : null

  const mobileContent =
    slotRole != null ? (
      <div
        className={clsx(
          styles.envelopeAddressViewToolbarRow,
          slotRole === 'sender'
            ? styles.envelopeAddressViewToolbarRowSender
            : styles.envelopeAddressViewToolbarRowRecipient,
        )}
        data-envelope-address-view-toolbar
        aria-hidden={section == null ? true : undefined}
      >
        {section != null ? (
          <Toolbar
            section={section}
            groupsOverride={ENVELOPE_MOBILE_ADDRESS_VIEW_TOOLBAR}
          />
        ) : null}
      </div>
    ) : null

  useMobileScenarioToolbar(isMobile && enabled ? mobileContent : null)

  return null
}
