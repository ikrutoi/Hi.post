import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { IconUsers } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { AddressBookCell } from './AddressBookCell'
import { getAddressBookGridColumns } from './addressBookGridConstants'
import { getNextAddressBookGridIndex } from './addressBookGridKeyboard'
import type { AddressBookEntry } from '../domain/types'
import { useRecipientListPanelFacade } from '../../application/facades'
import { useAppSelector } from '@app/hooks'
import {
  selectRecipientAddressListPanelDensity,
  selectRecipientViewEditMode,
} from '@envelope/infrastructure/selectors'
import styles from './RecipientListPanel.module.scss'

type Props = {
  onSelect: (entry: AddressBookEntry) => void
  selectedIds?: string[]
}

export const RecipientListPanel: React.FC<Props> = ({
  onSelect,
  selectedIds = [],
}) => {
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const addressListPanelDensity = useAppSelector(
    selectRecipientAddressListPanelDensity,
  )
  const gridColumns = getAddressBookGridColumns(addressListPanelDensity)
  const { entries, starredRecipientIds, closePanel } =
    useRecipientListPanelFacade()

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
  const primarySelectedIndex = useMemo(
    () =>
      selectedIds.length > 0
        ? combinedEntries.findIndex((e) => selectedIds.includes(e.id))
        : -1,
    [selectedIds, combinedEntries],
  )

  /** -1 until user moves with arrows — avoids marking the first row as keyboard-focused. */
  const [focusedIndex, setFocusedIndex] = useState(-1)

  useEffect(() => {
    const entriesChanged = entriesRef.current !== entries
    entriesRef.current = entries

    if (entriesChanged) setFocusedIndex(-1)
    // Не перетягиваем фокус с RecipientView, когда он в режиме редактирования.
    if (!recipientViewEditMode) {
      listRef.current?.focus()
    }
  }, [combinedEntries, entries, recipientViewEditMode])

  useEffect(() => {
    if (focusedIndex < 0) return
    const el = listRef.current?.querySelector(`[data-index="${focusedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focusedIndex])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closePanel()
        return
      }
      if (combinedEntries.length === 0) return
      if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault()
        const next = getNextAddressBookGridIndex(
          e.key,
          focusedIndex < 0 ? -1 : focusedIndex,
          combinedEntries.length,
          gridColumns,
        )
        if (next == null) return
        setFocusedIndex(next)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const idx =
          focusedIndex >= 0
            ? focusedIndex
            : primarySelectedIndex >= 0
              ? primarySelectedIndex
              : 0
        const entry = combinedEntries[idx]
        if (entry) {
          setFocusedIndex(idx)
          onSelect(entry)
        }
      }
    },
    [
      combinedEntries,
      focusedIndex,
      primarySelectedIndex,
      onSelect,
      closePanel,
      gridColumns,
    ],
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
        variant="sectionToolbar"
        cardPieListHeaderIcons
        toolbar={
          combinedEntries.length > 0 ? (
            <Toolbar section="addressListRecipients" />
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
          className={clsx(
            styles.list,
            combinedEntries.length === 0 && styles.listEmptyState,
          )}
          data-address-book-list
          data-density-level={addressListPanelDensity}
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
                  <AddressBookCell
                    entry={entry}
                    onSelect={onSelect}
                    isSelected={selectedIds.includes(entry.id)}
                    isFocused={focusedIndex === index}
                    density={addressListPanelDensity}
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
                    <AddressBookCell
                      entry={entry}
                      onSelect={onSelect}
                      isSelected={selectedIds.includes(entry.id)}
                      isFocused={focusedIndex === dataIndex}
                      density={addressListPanelDensity}
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
