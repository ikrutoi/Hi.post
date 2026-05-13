import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { IconUsers } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { AddressEntry } from './AddressEntry'
import type { AddressBookEntry } from '../domain/types'
import { useRecipientListPanelFacade } from '../../application/facades'
import { useAppSelector } from '@app/hooks'
import { selectRecipientViewEditMode } from '@envelope/infrastructure/selectors'
import styles from './RecipientListPanel.module.scss'

type Props = {
  onSelect: (entry: AddressBookEntry) => void
  /** При клике на иконку Edit: открыть RecipientView в режиме редактирования. Если не передано, используется onSelect. */
  onEdit?: (entry: AddressBookEntry) => void
  onDelete?: (id: string) => void
  selectedIds?: string[]
  isRecipientsMode?: boolean
}

export const RecipientListPanel: React.FC<Props> = ({
  onSelect,
  onEdit,
  onDelete = () => {},
  selectedIds = [],
  isRecipientsMode = false,
}) => {
  const handleEdit = onEdit ?? onSelect
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const {
    entries,
    starredRecipientIds,
    closePanel,
    handleDeleteEntry,
  } = useRecipientListPanelFacade()

  const { favoriteEntries, restEntries, combinedEntries } = useMemo(() => {
    const fav = entries.filter((e) => starredRecipientIds.has(e.id))
    const rest = entries.filter((e) => !starredRecipientIds.has(e.id))
    return {
      favoriteEntries: fav,
      restEntries: rest,
      combinedEntries: [...fav, ...rest],
    }
  }, [entries, starredRecipientIds])

  const listRef = useRef<HTMLDivElement>(null)
  const scrollbarTrackRef = useRef<HTMLDivElement>(null)
  const [scrollbarTrackReady, setScrollbarTrackReady] = useState(false)
  const setScrollbarTrackRef = useCallback((el: HTMLDivElement | null) => {
    ;(scrollbarTrackRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    if (el) setScrollbarTrackReady(true)
  }, [])
  const entriesRef = useRef<typeof entries | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)

  useEffect(() => {
    const entriesChanged = entriesRef.current !== entries
    entriesRef.current = entries

    if (isRecipientsMode) {
      if (entriesChanged) setFocusedIndex(0)
    } else {
      const selectedIndex = combinedEntries.findIndex((e) =>
        selectedIds.includes(e.id),
      )
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }
    // Не перетягиваем фокус с RecipientView, когда он в режиме редактирования.
    if (!recipientViewEditMode) {
      listRef.current?.focus()
    }
  }, [combinedEntries, entries, selectedIds, isRecipientsMode, recipientViewEditMode])

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
        if (!isRecipientsMode) onSelect(combinedEntries[next])
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.max(focusedIndex - 1, 0)
        setFocusedIndex(next)
        if (!isRecipientsMode) onSelect(combinedEntries[next])
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onSelect(combinedEntries[focusedIndex])
      }
    },
    [combinedEntries, focusedIndex, onSelect, isRecipientsMode, closePanel],
  )

  return (
    <div
      className={clsx(
        styles.panel,
        combinedEntries.length > 0 && styles.panelToolbarBelow,
      )}
    >
      <ListPanelStackedHeader
        leadIconKey="addressList"
        toolbar={
          combinedEntries.length > 0 ? (
            <Toolbar
              section={
                isRecipientsMode
                  ? 'addressListRecipients'
                  : 'addressListRecipient'
              }
            />
          ) : (
            false
          )
        }
        showDividerWithoutToolbar={combinedEntries.length === 0}
        onClose={closePanel}
        closeAriaLabel="Close address list"
      />
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
                    isSelected={selectedIds.includes(entry.id)}
                    isFocused={focusedIndex === index}
                  />
                </div>
              ))}
              {favoriteEntries.length > 0 && (
                <div
                  className={styles.favoritesSeparator}
                  data-favorites-group-end
                  aria-hidden
                />
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
                      isSelected={selectedIds.includes(entry.id)}
                      isFocused={focusedIndex === dataIndex}
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
