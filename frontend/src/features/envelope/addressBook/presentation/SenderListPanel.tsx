import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { IconX, IconUsers } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { AddressEntry } from './AddressEntry'
import type { AddressBookEntry } from '../domain/types'
import { useSenderListPanelFacade } from '../../application/facades'
import { selectSenderViewEditMode } from '@envelope/infrastructure/selectors'
import { useAppSelector } from '@app/hooks'
import styles from './SenderListPanel.module.scss'

type Props = {
  onSelect: (entry: AddressBookEntry) => void
  /** При клике на Edit: открыть SenderView в режиме редактирования. Если не передано, используется onSelect. */
  onEdit?: (entry: AddressBookEntry) => void
  onDelete?: (id: string) => void
  selectedId?: string | null
}

export const SenderListPanel: React.FC<Props> = ({
  onSelect,
  onEdit,
  onDelete = () => {},
  selectedId = null,
}) => {
  const handleEdit = onEdit ?? onSelect
  const {
    entries,
    starredSenderIds,
    closePanel,
    handleToggleStar,
    handleDeleteEntry,
  } = useSenderListPanelFacade()
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)

  const { favoriteEntries, restEntries, combinedEntries } = useMemo(() => {
    const fav = entries.filter((e) => starredSenderIds.has(e.id))
    const rest = entries.filter((e) => !starredSenderIds.has(e.id))
    return {
      favoriteEntries: fav,
      restEntries: rest,
      combinedEntries: [...fav, ...rest],
    }
  }, [entries, starredSenderIds])

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
      ? combinedEntries.findIndex((e) => e.id === selectedId)
      : -1
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    // Не перетягиваем фокус с SenderView, когда он в режиме редактирования.
    if (!senderViewEditMode) {
      listRef.current?.focus()
    }
  }, [combinedEntries, selectedId, senderViewEditMode])

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
      if (combinedEntries.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(focusedIndex + 1, combinedEntries.length - 1)
        setFocusedIndex(next)
        onSelect(combinedEntries[next])
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.max(focusedIndex - 1, 0)
        setFocusedIndex(next)
        onSelect(combinedEntries[next])
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const entry = combinedEntries[focusedIndex]
        handleToggleStar(entry.id, starredSenderIds.has(entry.id))
      }
    },
    [combinedEntries, focusedIndex, onSelect, handleToggleStar, starredSenderIds, closePanel],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        {combinedEntries.length > 0 && (
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
          {combinedEntries.length === 0 ? (
            <div className={styles.listEmpty} aria-hidden>
              <IconUsers className={styles.listEmptyIcon} />
            </div>
          ) : (
            <>
              {favoriteEntries.map((entry, index) => (
                <div key={entry.id} data-index={index} role="option">
                  <AddressEntry
                    entry={entry}
                    onSelect={onSelect}
                    onDelete={onDeleteEntry}
                    onEdit={handleEdit}
                    isStarred
                    isSelected={selectedId === entry.id}
                    isFocused={focusedIndex === index}
                    onToggleStar={() =>
                      handleToggleStar(entry.id, true)
                    }
                    variant="sender"
                  />
                </div>
              ))}
              {favoriteEntries.length > 0 && (
                <div className={styles.favoritesSeparator} aria-hidden />
              )}
              {restEntries.map((entry, index) => {
                const dataIndex = favoriteEntries.length + index
                return (
                  <div key={entry.id} data-index={dataIndex} role="option">
                    <AddressEntry
                      entry={entry}
                      onSelect={onSelect}
                      onDelete={onDeleteEntry}
                      onEdit={handleEdit}
                      isStarred={false}
                      isSelected={selectedId === entry.id}
                      isFocused={focusedIndex === dataIndex}
                      onToggleStar={() =>
                        handleToggleStar(entry.id, false)
                      }
                      variant="sender"
                    />
                  </div>
                )
              })}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
