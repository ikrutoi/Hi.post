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
      {recipientListOpen && (
        <div className={styles.panelWrap}>
          <RecipientListPanel
            onSelect={recipientFacade.selectFromList}
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
            selectedId={senderFacade.selectedId}
          />
        </div>
      )}
    </div>
  )
}
