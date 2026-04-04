import React from 'react'
import { IconX, IconListDate } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import styles from './DateListPanel.module.scss'

type Props = {
  onClose: () => void
}

export const DateListPanel: React.FC<Props> = ({ onClose }) => (
  <div className={styles.panel}>
    <div className={styles.header}>
      <div className={styles.headerToolbar}>
        <Toolbar section="dateList" />
      </div>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Закрыть список дат"
      >
        <IconX />
      </button>
    </div>
    <div className={styles.panelScrollTrack} aria-hidden />
    <ScrollArea className={styles.listScrollArea}>
      <div
        className={styles.list}
        tabIndex={0}
        aria-label="Список дат отправки"
      >
        <div className={styles.listEmpty} aria-hidden>
          <IconListDate className={styles.listEmptyIcon} />
        </div>
      </div>
    </ScrollArea>
  </div>
)
