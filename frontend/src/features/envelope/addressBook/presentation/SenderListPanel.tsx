import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import {
  ListPanelCornerReturn,
  listPanelCornerReturnPanelProps,
} from '@shared/ui/ListPanelCornerReturn/ListPanelCornerReturn'
import { IconUser } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { AddressBookCell } from './AddressBookCell'
import { getAddressBookGridColumns } from './addressBookGridConstants'
import { getNextAddressBookGridIndex } from './addressBookGridKeyboard'
import type { AddressBookEntry } from '../domain/types'
import { useSenderListPanelFacade } from '../../application/facades'
import {
  selectSenderAddressListPanelDensity,
  selectSenderViewEditMode,
} from '@envelope/infrastructure/selectors'
import { useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import styles from './SenderListPanel.module.scss'

type Props = {
  onSelect: (entry: AddressBookEntry) => void
  selectedId?: string | null
  /** Mobile factory: toolbars live in shell, not in panel header. */
  factoryChrome?: boolean
}

export const SenderListPanel: React.FC<Props> = ({
  onSelect,
  selectedId = null,
  factoryChrome = false,
}) => {
  const { entries, starredSenderIds, closePanel } = useSenderListPanelFacade()
  const { isMobileLayout } = useSizeFacade()
  const useFactoryChrome = factoryChrome && isMobileLayout
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const addressListPanelDensity = useAppSelector(
    selectSenderAddressListPanelDensity,
  )
  const gridColumns = getAddressBookGridColumns(addressListPanelDensity)

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
    ;(
      scrollbarTrackRef as React.MutableRefObject<HTMLDivElement | null>
    ).current = el
    if (el) setScrollbarTrackReady(true)
  }, [])
  const selectedRowIndex = useMemo(
    () =>
      selectedId ? combinedEntries.findIndex((e) => e.id === selectedId) : -1,
    [selectedId, combinedEntries],
  )

  /** -1 until user moves with arrows — avoids marking the first row as keyboard-focused. */
  const [focusedIndex, setFocusedIndex] = useState(-1)

  useEffect(() => {
    setFocusedIndex(-1)
    if (!senderViewEditMode) {
      listRef.current?.focus()
    }
  }, [combinedEntries, senderViewEditMode])

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
        const startIndex =
          focusedIndex < 0 ? Math.max(selectedRowIndex, 0) : focusedIndex
        const next = getNextAddressBookGridIndex(
          e.key,
          focusedIndex < 0 ? -1 : startIndex,
          combinedEntries.length,
          gridColumns,
        )
        if (next == null) return
        setFocusedIndex(next)
        onSelect(combinedEntries[next])
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const idx =
          focusedIndex >= 0
            ? focusedIndex
            : selectedRowIndex >= 0
              ? selectedRowIndex
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
      selectedRowIndex,
      onSelect,
      closePanel,
      gridColumns,
    ],
  )

  return (
    <div
      className={clsx(
        styles.panel,
        !useFactoryChrome &&
          combinedEntries.length > 0 &&
          styles.panelToolbarBelow,
        useFactoryChrome && styles.panelFactoryChrome,
      )}
      {...(useFactoryChrome ? {} : listPanelCornerReturnPanelProps(isMobileLayout))}
    >
      {!useFactoryChrome ? (
        <ListPanelStackedHeader
          leadIconKey="addressList"
          variant="sectionToolbar"
          cardPieListHeaderIcons
          toolbar={
            combinedEntries.length > 0 ? (
              <Toolbar section="addressListSender" />
            ) : (
              false
            )
          }
          showDividerWithoutToolbar={combinedEntries.length === 0}
          hideClose={isMobileLayout}
          onClose={closePanel}
          closeAriaLabel="Close address list"
        />
      ) : null}
      <div
        ref={setScrollbarTrackRef}
        className={styles.panelScrollTrack}
        aria-hidden
      />
      <ScrollArea
        className={styles.listScrollArea}
        scrollbarPortalTarget={
          scrollbarTrackReady ? scrollbarTrackRef : undefined
        }
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
              <IconUser className={styles.listEmptyIcon} />
            </div>
          ) : (
            <>
              {favoriteEntries.map((entry, index) => (
                <div key={entry.id} data-index={index} role="option">
                  <AddressBookCell
                    entry={entry}
                    onSelect={onSelect}
                    isSelected={selectedId === entry.id}
                    isFocused={focusedIndex === index}
                    variant="sender"
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
                      isSelected={selectedId === entry.id}
                      isFocused={focusedIndex === dataIndex}
                      variant="sender"
                      density={addressListPanelDensity}
                    />
                  </div>
                )
              })}
            </>
          )}
        </div>
      </ScrollArea>
      {!useFactoryChrome ? (
        <ListPanelCornerReturn
          onClick={closePanel}
          ariaLabel="Return to envelope section"
        />
      ) : null}
    </div>
  )
}
