import React, { useMemo, useState } from 'react'
import { useAddressBookList } from '@envelope/addressBook/application/controllers'
import { AddressEntry } from './AddressEntry'
import type { AddressBookEntry } from '@envelope/addressBook/domain'
import styles from './RecipientListPanel.module.scss'

type Props = {
  onSelect: (entry: AddressBookEntry) => void
  onDelete?: (id: string) => void
}

export const RecipientListPanel: React.FC<Props> = ({
  onSelect,
  onDelete = () => {},
}) => {
  const [showSender, setShowSender] = useState(false)
  const [showRecipient, setShowRecipient] = useState(true)

  const { entries: senderEntries } = useAddressBookList('sender')
  const { entries: recipientEntries } = useAddressBookList('recipient')

  const entries = useMemo(() => {
    if (showSender && showRecipient) return [...senderEntries, ...recipientEntries]
    if (showSender) return senderEntries
    if (showRecipient) return recipientEntries
    return []
  }, [showSender, showRecipient, senderEntries, recipientEntries])

  const showRole = showSender && showRecipient

  const senderEmpty = senderEntries.length === 0
  const recipientEmpty = recipientEntries.length === 0

  const toggleSender = () => {
    if (showSender && !showRecipient) return
    setShowSender((v) => !v)
  }
  const toggleRecipient = () => {
    if (showRecipient && !showSender) return
    setShowRecipient((v) => !v)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Address list</h3>
        <div className={styles.filterWrap}>
          <span className={styles.filterHint}>
            {showSender && showRecipient && `${senderEntries.length} + ${recipientEntries.length} addresses`}
            {showSender && !showRecipient && `${senderEntries.length} sender`}
            {!showSender && showRecipient && `${recipientEntries.length} recipient`}
          </span>
        </div>
        <div className={styles.filter} role="group" aria-label="Filter by source">
          <button
            type="button"
            className={showSender ? styles.filterBtnActive : styles.filterBtn}
            onClick={toggleSender}
            disabled={senderEmpty}
            title={senderEmpty ? 'No sender addresses' : undefined}
          >
            Sender
          </button>
          <button
            type="button"
            className={showRecipient ? styles.filterBtnActive : styles.filterBtn}
            onClick={toggleRecipient}
            disabled={recipientEmpty}
            title={recipientEmpty ? 'No recipient addresses' : undefined}
          >
            Recipient
          </button>
        </div>
      </div>
      <div className={styles.list}>
        {entries.length === 0 ? (
          <p className={styles.empty}>No saved addresses</p>
        ) : (
          entries.map((entry) => (
            <AddressEntry
              key={`${entry.role}-${entry.id}`}
              entry={entry}
              onSelect={onSelect}
              onDelete={onDelete}
              showRole={showRole}
            />
          ))
        )}
      </div>
    </div>
  )
}
