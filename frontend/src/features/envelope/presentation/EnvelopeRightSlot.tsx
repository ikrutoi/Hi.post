import React, { useCallback } from 'react'
import { RecipientListPanel } from '../addressBook/presentation/RecipientListPanel'
import { SenderListPanel } from '../addressBook/presentation/SenderListPanel'
import { useRecipientFacade } from '../recipient/application/facades'
import { useSenderFacade } from '../sender/application/facades'
import { useAppDispatch } from '@app/hooks'
import { setRecipientView } from '../recipient/infrastructure/state'
import { openAddressEditSession } from '../infrastructure/state'
import { setSenderView } from '../sender/infrastructure/state'
import type { AddressBookEntry } from '../addressBook/domain/types'
import type { AddressFields } from '@shared/config/constants'
import { useAppSelector } from '@app/hooks'
import {
  selectRecipientTemplateId,
  selectSenderTemplateId,
} from '@envelope/infrastructure/selectors'
import styles from './EnvelopeRightSlot.module.scss'

export const EnvelopeRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const recipientFacade = useRecipientFacade()
  const senderFacade = useSenderFacade()
  const senderViewId = useAppSelector(selectSenderTemplateId)
  const recipientViewId = useAppSelector(selectRecipientTemplateId)

  const recipientListOpen = recipientFacade.listPanelOpen
  const senderListOpen = senderFacade.listPanelOpen

  const handleEditFromRecipientList = useCallback(
    (entry: AddressBookEntry) => {
      dispatch(setRecipientView('recipientView'))
      dispatch(
        openAddressEditSession({
          role: 'recipient',
          templateId: entry.id,
          draft: { ...entry.address } as AddressFields,
          displayTemplateIdAtStart: recipientViewId,
        }),
      )
    },
    [dispatch, recipientViewId],
  )

  const handleEditFromSenderList = useCallback(
    (entry: AddressBookEntry) => {
      dispatch(setSenderView('senderView'))
      dispatch(
        openAddressEditSession({
          role: 'sender',
          templateId: entry.id,
          draft: { ...entry.address } as AddressFields,
          displayTemplateIdAtStart: senderViewId,
        }),
      )
    },
    [dispatch, senderViewId],
  )

  if (!recipientListOpen && !senderListOpen) return null

  return (
    <div className={styles.root}>
      {recipientListOpen && (
        <div className={styles.panelWrap}>
          <RecipientListPanel
            onSelect={recipientFacade.selectFromList}
            onEdit={handleEditFromRecipientList}
            selectedIds={recipientFacade.listSelectedIds}
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
