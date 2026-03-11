import React, { useCallback } from 'react'
import { RecipientListPanel } from '../addressBook/presentation/RecipientListPanel'
import { SenderListPanel } from '../addressBook/presentation/SenderListPanel'
import { useRecipientFacade } from '../recipient/application/facades'
import { useSenderFacade } from '../sender/application/facades'
import { useAppDispatch } from '@app/hooks'
import {
  setRecipientView,
  setRecipientViewId,
  updateRecipientField,
} from '../recipient/infrastructure/state'
import {
  setRecipientViewEditMode,
  setSenderViewEditMode,
} from '../infrastructure/state'
import {
  setSenderView,
  setSenderViewId,
  updateSenderField,
} from '../sender/infrastructure/state'
import type { AddressBookEntry } from '../addressBook/domain/types'
import type { AddressField } from '@shared/config/constants'
import styles from './EnvelopeRightSlot.module.scss'

export const EnvelopeRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const recipientFacade = useRecipientFacade()
  const senderFacade = useSenderFacade()

  const recipientListOpen = recipientFacade.listPanelOpen
  const senderListOpen = senderFacade.listPanelOpen

  const handleEditFromRecipientList = useCallback(
    (entry: AddressBookEntry) => {
      dispatch(setRecipientViewId(entry.id))
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
        ([field, value]) => {
          dispatch(updateRecipientField({ field, value }))
        },
      )
      dispatch(setRecipientView('recipientView'))
      dispatch(setRecipientViewEditMode(true))
    },
    [dispatch],
  )

  const handleEditFromSenderList = useCallback(
    (entry: AddressBookEntry) => {
      dispatch(setSenderViewId(entry.id))
      ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
        ([field, value]) => {
          dispatch(updateSenderField({ field, value }))
        },
      )
      dispatch(setSenderView('senderView'))
      dispatch(setSenderViewEditMode(true))
    },
    [dispatch],
  )

  if (!recipientListOpen && !senderListOpen) return null

  return (
    <div className={styles.root}>
      {recipientListOpen && (
        <div className={styles.panelWrap}>
          <RecipientListPanel
            onSelect={recipientFacade.selectFromList}
            onEdit={handleEditFromRecipientList}
            selectedIds={
              recipientFacade.isEnabled
                ? recipientFacade.listSelectedIds
                : recipientFacade.state.recipientViewId
                  ? [recipientFacade.state.recipientViewId]
                  : []
            }
            isRecipientsMode={recipientFacade.isEnabled}
          />
        </div>
      )}
      {senderListOpen && (
        <div className={styles.panelWrap}>
          <SenderListPanel
            onSelect={senderFacade.selectFromList}
            onEdit={handleEditFromSenderList}
            selectedId={senderFacade.selectedId}
          />
        </div>
      )}
    </div>
  )
}
