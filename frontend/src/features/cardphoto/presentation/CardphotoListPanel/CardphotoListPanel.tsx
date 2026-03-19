import React from 'react'
import { IconX } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import styles from './CardphotoListPanel.module.scss'
import { CardphotoPreviewEmptyGrid } from './CardphotoPreviewEmptyGrid/CardphotoPreviewEmptyGrid'

type Props = {
  onClose: () => void
}

export const CardphotoListPanel: React.FC<Props> = ({ onClose }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar} />
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close photo templates list"
        >
          <IconX />
        </button>
      </div>

      <div className={styles.panelScrollTrack} aria-hidden />

      <ScrollArea className={styles.listScrollArea}>
        <div
          className={styles.list}
          tabIndex={0}
          aria-label="Cardphoto templates list"
        >
          <div className={styles.listEmpty} aria-hidden>
            <CardphotoPreviewEmptyGrid />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
