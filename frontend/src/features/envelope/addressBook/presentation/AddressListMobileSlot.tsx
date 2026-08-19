import React from 'react'
import { useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectRecipientListPanelOpen } from '@envelope/infrastructure/selectors'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import { RecipientListPanel } from './RecipientListPanel'
import { AddressListMobileFactoryLowerToolbar } from './AddressListMobileFactoryToolbar'

export const AddressListMobileSlot: React.FC = () => {
  const recipientListOpen = useAppSelector(selectRecipientListPanelOpen)
  const { isMobileLayout } = useSizeFacade()
  const recipientFacade = useRecipientFacade()

  if (!isMobileLayout || !recipientListOpen) {
    return null
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
