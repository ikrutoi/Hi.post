import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import type { AddressFields } from '@shared/config/constants'
import styles from './SavedAddressView.module.scss'

export type SavedAddressViewProps = {
  role: 'recipient' | 'sender'
  templateId: string
  address: AddressFields
}

export const SavedAddressView: React.FC<SavedAddressViewProps> = ({
  role,
  templateId,
  address,
}) => {
  return (
    <div className={styles.savedAddressViewContainer}>
      <div className={styles.savedAddressViewToolbar}>
        <Toolbar section="savedAddress" />
      </div>
      <div className={styles.savedAddressView}>
        {role === 'recipient' ? (
          <div className={styles.recipientAddress}>
            {address.name ? (
              <div className={styles.recipientAddressName}>{address.name}</div>
            ) : null}
            {address.street ? (
              <div className={styles.recipientAddressStreet}>
                {address.street}
              </div>
            ) : null}
            {[address.zip, address.city].filter(Boolean).length > 0 ? (
              <div className={styles.recipientAddressCityZip}>
                {[address.zip, address.city].filter(Boolean).join(', ')}
              </div>
            ) : null}
            {address.country ? (
              <div className={styles.recipientAddressCountry}>
                {address.country}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
