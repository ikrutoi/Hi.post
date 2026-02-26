import React, { useMemo, useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { IconX } from '@shared/ui/icons'
import { closeRecipientListPanel } from '@envelope/infrastructure/state'
import { useAddressBookList } from '@envelope/addressBook/application/controllers'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
  incrementAddressTemplatesReloadVersion,
  incrementAddressBookReloadVersion,
} from '@features/previewStrip/infrastructure/state'
import { AddressEntry } from './AddressEntry'
import type { AddressBookEntry } from '../domain/types'
import styles from './RecipientListPanel.module.scss'

type Props = {
  onSelect: (entry: AddressBookEntry) => void
  onDelete?: (id: string) => void
  selectedIds?: string[]
}

export const RecipientListPanel: React.FC<Props> = ({
  onSelect,
  onDelete = () => {},
  selectedIds = [],
}) => {
  const dispatch = useAppDispatch()
  const { entries } = useAddressBookList('recipient')
  useEffect(() => {
    dispatch(incrementAddressBookReloadVersion())
  }, [dispatch])
  const addressTemplateRefs = useAppSelector(
    (state) => state.previewStripOrder.addressTemplateRefs,
  )

  const starredRecipientIds = useMemo(
    () =>
      new Set(
        addressTemplateRefs
          .filter((r) => r.type === 'recipient')
          .map((r) => r.id),
      ),
    [addressTemplateRefs],
  )

  const handleToggleStar = useCallback(
    (id: string, currentlyStarred: boolean) => {
      if (currentlyStarred) {
        dispatch(removeAddressTemplateRef({ type: 'recipient', id }))
      } else {
        dispatch(addAddressTemplateRef({ type: 'recipient', id }))
        dispatch(incrementAddressTemplatesReloadVersion())
      }
    },
    [dispatch],
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
          onClick={() => dispatch(closeRecipientListPanel())}
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
              onDelete={onDelete}
              isStarred={starredRecipientIds.has(entry.id)}
              isSelected={selectedIds.includes(entry.id)}
              onToggleStar={() =>
                handleToggleStar(entry.id, starredRecipientIds.has(entry.id))
              }
            />
          ))
        )}
      </div>
    </div>
  )
}
