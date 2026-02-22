import React, { useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { useAddressBookList } from '@envelope/addressBook/application/controllers'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
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
      }
    },
    [dispatch],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>
          <span className={styles.label}>Recipients</span>
        </span>
        <Toolbar section="addressList" />
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
