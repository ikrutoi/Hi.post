import React, { useMemo, useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { IconX } from '@shared/ui/icons'
import { closeSenderListPanel } from '@envelope/infrastructure/state'
import { useAddressBookList } from '@envelope/addressBook/application/controllers'
import {
  addAddressTemplateRef,
  removeAddressTemplateRef,
  incrementAddressTemplatesReloadVersion,
  incrementAddressBookReloadVersion,
} from '@features/previewStrip/infrastructure/state'
import { AddressEntry } from './AddressEntry'
import type { AddressBookEntry } from '../domain/types'
import { useAddressTemplateActions } from '@entities/templates'
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
  const dispatch = useAppDispatch()
  const { delete: deleteTemplate } = useAddressTemplateActions('sender')
  const { entries } = useAddressBookList('sender')
  useEffect(() => {
    dispatch(incrementAddressBookReloadVersion())
  }, [dispatch])
  const addressTemplateRefs = useAppSelector(
    (state) => state.previewStripOrder.addressTemplateRefs,
  )

  const starredSenderIds = useMemo(
    () =>
      new Set(
        addressTemplateRefs.filter((r) => r.type === 'sender').map((r) => r.id),
      ),
    [addressTemplateRefs],
  )

  const handleToggleStar = useCallback(
    (id: string, currentlyStarred: boolean) => {
      if (currentlyStarred) {
        dispatch(removeAddressTemplateRef({ type: 'sender', id }))
      } else {
        dispatch(addAddressTemplateRef({ type: 'sender', id }))
        dispatch(incrementAddressTemplatesReloadVersion())
      }
    },
    [dispatch],
  )

  const handleDeleteEntry = useCallback(
    async (id: string) => {
      try {
        const result = await deleteTemplate(id)
        if (result.success) {
          // Удаляем из панели быстрого доступа, если шаблон там был
          dispatch(removeAddressTemplateRef({ type: 'sender', id }))
          // Обновляем список адресов и шаблонов
          dispatch(incrementAddressBookReloadVersion())
          dispatch(incrementAddressTemplatesReloadVersion())
          onDelete(id)
        } else {
          // eslint-disable-next-line no-console
          console.warn('Failed to delete sender address template:', result.error)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to delete sender address template:', e)
      }
    },
    [
      deleteTemplate,
      dispatch,
      onDelete,
    ],
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
          onClick={() => dispatch(closeSenderListPanel())}
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
              onDelete={handleDeleteEntry}
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
