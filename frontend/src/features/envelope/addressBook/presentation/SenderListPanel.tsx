import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { IconX, IconUsers } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
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
  const scrollbarTrackRef = useRef<HTMLDivElement>(null)
  const [scrollbarTrackReady, setScrollbarTrackReady] = useState(false)
  const setScrollbarTrackRef = useCallback((el: HTMLDivElement | null) => {
    ;(scrollbarTrackRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    if (el) setScrollbarTrackReady(true)
  }, [])
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
      if (e.key === 'Escape') {
        e.preventDefault()
        closePanel()
        return
      }
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
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const entry = entries[focusedIndex]
        handleToggleStar(entry.id, starredSenderIds.has(entry.id))
      }
    },
    [entries, focusedIndex, onSelect, handleToggleStar, starredSenderIds, closePanel],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        {entries.length > 0 && (
          <div className={styles.headerToolbar}>
            <Toolbar section="addressListSender" />
          </div>
        )}
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
        ref={setScrollbarTrackRef}
        className={styles.panelScrollTrack}
        aria-hidden
      />
      <ScrollArea
        className={styles.listScrollArea}
        scrollbarPortalTarget={scrollbarTrackReady ? scrollbarTrackRef : undefined}
      >
        <div
          ref={listRef}
          className={styles.list}
          tabIndex={0}
          role="listbox"
          aria-label="Address list"
          onKeyDown={handleKeyDown}
        >
          {entries.length === 0 ? (
            <div className={styles.listEmpty} aria-hidden>
              <IconUsers className={styles.listEmptyIcon} />
            </div>
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
      </ScrollArea>
    </div>
  )
}
