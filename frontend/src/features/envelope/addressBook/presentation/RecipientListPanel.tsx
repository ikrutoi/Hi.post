import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { IconX } from '@shared/ui/icons'
import { AddressEntry } from './AddressEntry'
import type { AddressBookEntry } from '../domain/types'
import { useRecipientListPanelFacade } from '../../application/facades'
import styles from './RecipientListPanel.module.scss'

type Props = {
  onSelect: (entry: AddressBookEntry) => void
  onDelete?: (id: string) => void
  selectedIds?: string[]
  isRecipientsMode?: boolean
}

export const RecipientListPanel: React.FC<Props> = ({
  onSelect,
  onDelete = () => {},
  selectedIds = [],
  isRecipientsMode = false,
}) => {
  const {
    entries,
    starredRecipientIds,
    closePanel,
    handleToggleStar,
    handleDeleteEntry,
  } = useRecipientListPanelFacade()

  const listRef = useRef<HTMLDivElement>(null)
  const entriesRef = useRef<typeof entries | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)

  useEffect(() => {
    const entriesChanged = entriesRef.current !== entries
    entriesRef.current = entries

    if (isRecipientsMode) {
      if (entriesChanged) setFocusedIndex(0)
    } else {
      const selectedIndex = entries.findIndex((e) => selectedIds.includes(e.id))
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }
    listRef.current?.focus()
  }, [entries.length, entries, selectedIds, isRecipientsMode])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${focusedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focusedIndex])

  const onDeleteEntry = useCallback(
    (id: string) => handleDeleteEntry(id, onDelete),
    [handleDeleteEntry, onDelete],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (entries.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(focusedIndex + 1, entries.length - 1)
        setFocusedIndex(next)
        if (!isRecipientsMode) onSelect(entries[next])
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.max(focusedIndex - 1, 0)
        setFocusedIndex(next)
        if (!isRecipientsMode) onSelect(entries[next])
      } else if (isRecipientsMode && e.key === 'Enter') {
        e.preventDefault()
        onSelect(entries[focusedIndex])
      }
    },
    [entries, focusedIndex, onSelect, isRecipientsMode],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="addressListRecipient" />
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
      <div
        ref={listRef}
        className={styles.list}
        tabIndex={0}
        role="listbox"
        aria-label="Address list"
        onKeyDown={handleKeyDown}
      >
        {entries.length === 0 ? (
          <p className={styles.empty}>No saved addresses</p>
        ) : (
          entries.map((entry, index) => (
            <div key={entry.id} data-index={index} role="option">
              <AddressEntry
                entry={entry}
                onSelect={onSelect}
                onDelete={onDeleteEntry}
                isStarred={starredRecipientIds.has(entry.id)}
                isSelected={selectedIds.includes(entry.id)}
                isFocused={focusedIndex === index}
                onToggleStar={() =>
                  handleToggleStar(entry.id, starredRecipientIds.has(entry.id))
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
