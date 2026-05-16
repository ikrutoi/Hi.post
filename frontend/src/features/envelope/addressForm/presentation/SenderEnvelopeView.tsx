import React from 'react'
import { EnvelopeSenderRow } from '../../addressBook/presentation/EnvelopeSenderRow'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import styles from './AddressView.module.scss'

export type SenderEnvelopeViewProps = {
  entry: AddressBookEntry
  onOpenSender: (entry: AddressBookEntry) => void
  onRemove: (id: string) => void
}

/** Упрощённый адрес отправителя на конверте (одна строка). */
export const SenderEnvelopeView: React.FC<SenderEnvelopeViewProps> = ({
  entry,
  onOpenSender,
  onRemove,
}) => (
  <div className={styles.savedAddressViewContainer}>
    <div className={styles.recipientsViewList}>
      <EnvelopeSenderRow
        entry={entry}
        onOpen={onOpenSender}
        onRemove={onRemove}
      />
    </div>
  </div>
)
