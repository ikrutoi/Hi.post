import React from 'react'
import { useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import {
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import { useSenderFacade } from '@envelope/sender/application/facades'
import { RecipientListPanel } from './RecipientListPanel'
import { SenderListPanel } from './SenderListPanel'
import { AddressListMobileFactoryLowerToolbar } from './AddressListMobileFactoryToolbar'

export const AddressListMobileSlot: React.FC = () => {
  const senderListOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListOpen = useAppSelector(selectRecipientListPanelOpen)
  const { isMobileLayout } = useSizeFacade()
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()

  if (!isMobileLayout || (!senderListOpen && !recipientListOpen)) {
    return null
  }

  if (senderListOpen) {
    return (
      <>
        <AddressListMobileFactoryLowerToolbar />
        <SenderListPanel
          factoryChrome
          onSelect={senderFacade.selectFromList}
          selectedId={senderFacade.selectedId}
        />
      </>
    )
  }

  return (
    <>
      <AddressListMobileFactoryLowerToolbar />
      <RecipientListPanel
        factoryChrome
        onSelect={recipientFacade.selectFromList}
        selectedIds={recipientFacade.listSelectedIds}
      />
    </>
  )
}
