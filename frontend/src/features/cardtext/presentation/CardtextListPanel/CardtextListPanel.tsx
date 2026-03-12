import React from 'react'
import { IconX, IconListCardtext } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import styles from './CardtextListPanel.module.scss'

type Props = {
  onClose: () => void
}

export const CardtextListPanel: React.FC<Props> = ({ onClose }) => {
  // Пока нет базы текстовых шаблонов, просто показываем пустое состояние
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Text templates</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close text templates list"
        >
          <IconX />
        </button>
      </div>
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div className={styles.list} tabIndex={0} aria-label="Cardtext templates list">
          <div className={styles.listEmpty} aria-hidden>
            <IconListCardtext className={styles.listEmptyIcon} />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

