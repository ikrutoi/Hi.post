import React from 'react'
import { RecipientListPanel } from '../addressBook/presentation/RecipientListPanel'
import { SenderListPanel } from '../addressBook/presentation/SenderListPanel'
import { useRecipientFacade } from '../recipient/application/facades'
import { useSenderFacade } from '../sender/application/facades'
import styles from './EnvelopeRightSlot.module.scss'

export const EnvelopeRightSlot: React.FC = () => {
  const recipientFacade = useRecipientFacade()
  const senderFacade = useSenderFacade()

  const recipientListOpen = recipientFacade.listPanelOpen
  const senderListOpen = senderFacade.listPanelOpen

  if (!recipientListOpen && !senderListOpen) return null

  return (
    <div className={styles.root}>
      <div className={styles.panelWrap}>
        {senderListOpen ? (
          <SenderListPanel
            onSelect={senderFacade.selectFromList}
            selectedId={senderFacade.selectedId}
          />
        ) : (
          <RecipientListPanel
            onSelect={recipientFacade.selectFromList}
            selectedIds={recipientFacade.listSelectedIds}
          />
        )}
      </div>
    </div>
  )
}
