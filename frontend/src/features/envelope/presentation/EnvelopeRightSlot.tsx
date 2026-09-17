import React from 'react'
import { RecipientListPanel } from '../addressBook/presentation/RecipientListPanel'
import { useRecipientFacade } from '../recipient/application/facades'
import styles from './EnvelopeRightSlot.module.scss'

export const EnvelopeRightSlot: React.FC = () => {
  const recipientFacade = useRecipientFacade()

  if (!recipientFacade.listPanelOpen) return null

  return (
    <div className={styles.root}>
      <div className={styles.panelWrap}>
        <RecipientListPanel
          onSelect={recipientFacade.selectFromList}
          selectedIds={recipientFacade.listSelectedIds}
        />
      </div>
    </div>
  )
}
