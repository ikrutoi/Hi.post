import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { closeAddressList } from '@envelope/infrastructure/state'
import {
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
import { useRecipientFacade } from '@envelope/recipient/application/facades'
import { useSenderFacade } from '@envelope/sender/application/facades'
import type { AddressBookEntry } from '../domain/types'
import { RecipientListPanel } from './RecipientListPanel'
import { SenderListPanel } from './SenderListPanel'

export const AddressListMobileSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const senderListOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListOpen = useAppSelector(selectRecipientListPanelOpen)
  const { isMobileLayout } = useSizeFacade()
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()

  const handleSenderSelect = useCallback(
    (entry: AddressBookEntry) => {
      senderFacade.selectFromList(entry)
      dispatch(closeAddressList())
    },
    [dispatch, senderFacade],
  )

  if (!isMobileLayout || (!senderListOpen && !recipientListOpen)) {
    return null
  }

  if (senderListOpen) {
    return (
      <SenderListPanel
        onSelect={handleSenderSelect}
        selectedId={senderFacade.selectedId}
      />
    )
  }

  return (
    <RecipientListPanel
      onSelect={recipientFacade.selectFromList}
      selectedIds={recipientFacade.listSelectedIds}
    />
  )
}
