import React, { useCallback, useEffect, useRef, useState } from 'react'
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

  const listRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)

  useEffect(() => {
    const selectedIndex = selectedId
      ? entries.findIndex((e) => e.id === selectedId)
      : -1
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    listRef.current?.focus()
  }, [entries.length, entries, selectedId])

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
        onSelect(entries[next])
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.max(focusedIndex - 1, 0)
        setFocusedIndex(next)
        onSelect(entries[next])
      }
    },
    [entries, focusedIndex, onSelect],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="addressListSender" />
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
                isStarred={starredSenderIds.has(entry.id)}
                isSelected={selectedId === entry.id}
                isFocused={focusedIndex === index}
                onToggleStar={() =>
                  handleToggleStar(entry.id, starredSenderIds.has(entry.id))
                }
                variant="sender"
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
