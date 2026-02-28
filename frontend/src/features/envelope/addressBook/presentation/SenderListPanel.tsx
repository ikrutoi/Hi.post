import React, { useCallback } from 'react'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { IconX } from '@shared/ui/icons'
import { AddressEntry } from './AddressEntry'
import type { AddressBookEntry } from '../domain/types'
import { useSenderListPanelFacade } from '../../application/facades'
import styles from './SenderListPanel.module.scss'

type Props = {
  onSelect: (entry: AddressBookEntry) => void
  onDelete?: (id: string) => void
  selectedId?: string | null
}

export const SenderListPanel: React.FC<Props> = ({
  onSelect,
  onDelete = () => {},
  selectedId = null,
}) => {
  const {
    entries,
    starredSenderIds,
    closePanel,
    handleToggleStar,
    handleDeleteEntry,
  } = useSenderListPanelFacade()

  const onDeleteEntry = useCallback(
    (id: string) => handleDeleteEntry(id, onDelete),
    [handleDeleteEntry, onDelete],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="addressList" />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closePanel}
          aria-label="Close address list"
        >
          <IconX />
        </button>
      </div>
      <div className={styles.list}>
        {entries.length === 0 ? (
          <p className={styles.empty}>No saved addresses</p>
        ) : (
          entries.map((entry) => (
            <AddressEntry
              key={entry.id}
              entry={entry}
              onSelect={onSelect}
              onDelete={onDeleteEntry}
              isStarred={starredSenderIds.has(entry.id)}
              isSelected={selectedId === entry.id}
              onToggleStar={() =>
                handleToggleStar(entry.id, starredSenderIds.has(entry.id))
              }
              variant="sender"
            />
          ))
        )}
      </div>
    </div>
  )
}
