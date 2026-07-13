import React, { useMemo } from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import { useEnvelopeFacade } from '@envelope/application/facades'
import { useSenderFacade } from '@envelope/sender/application/facades'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import { selectActiveAddressEdit } from '@envelope/infrastructure/selectors'
import { selectSenderApplied, selectSenderView } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientView } from '@envelope/recipient/infrastructure/selectors'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
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
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const envelopeFacade = useEnvelopeFacade()
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()
  const senderAppliedIds = useAppSelector(selectSenderApplied)
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

  const showSenderToolbar =
    enabled &&
    isMobile &&
    (mobileFocus?.isFocused('sender') ?? false) &&
    senderFacade.isEnabled &&
    senderView === 'senderView' &&
    senderDisplayEntry != null

  const showRecipientToolbar =
    enabled &&
    isMobile &&
    (mobileFocus?.isFocused('recipient') ?? false) &&
    recipientView === 'recipientView' &&
    recipientDisplayEntry != null

  const section: 'senderView' | 'recipientView' | null = showSenderToolbar
    ? 'senderView'
    : showRecipientToolbar
      ? 'recipientView'
      : null

  const mobileContent =
    section != null ? (
      <div
        className={styles.envelopeAddressViewToolbarRow}
        data-envelope-address-view-toolbar
      >
        <Toolbar
          section={section}
          groupsOverride={ENVELOPE_MOBILE_ADDRESS_VIEW_TOOLBAR}
        />
      </div>
    ) : null

  useMobileScenarioToolbar(isMobile && enabled ? mobileContent : null)

  return null
}
