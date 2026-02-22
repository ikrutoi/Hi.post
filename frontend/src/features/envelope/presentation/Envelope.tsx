import React from 'react'
import clsx from 'clsx'
import { ENVELOPE_ROLE_LABELLED } from '@shared/config/constants'
import type { AddressField } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain'
import { useAppDispatch } from '@app/hooks'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { RecipientListPanel } from '../addressBook/presentation/RecipientListPanel'
import { useRecipientFacade } from '../recipient/application/facades'
import { useAddressBookList } from '../addressBook/application/controllers'
import { updateRecipientField } from '../recipient/infrastructure/state'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = getSafeLang(i18n.language)
  const dispatch = useAppDispatch()
  const { isEnabled: recipientListEnabled } = useRecipientFacade()
  const { entries: recipientEntries } = useAddressBookList('recipient')

  const showRecipientList =
    recipientListEnabled && recipientEntries.length > 0

  const handleRecipientSelect = (entry: AddressBookEntry) => {
    ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
      ([field, value]) => {
        dispatch(updateRecipientField({ field, value }))
      }
    )
  }

  return (
    <div className={styles.envelope}>
      <div className={styles.envelopeLogo} />
      {ENVELOPE_ROLE_LABELLED.map(({ key: role, label }) => (
        <div
          key={role}
          className={clsx(
            styles.envelopeSection,
            styles[`envelopeSection${label}`]
          )}
        >
          <EnvelopeAddress role={role} roleLabel={label} lang={lang} />
        </div>
      ))}
      {showRecipientList && (
        <div className={styles.recipientListPanelWrap}>
          <RecipientListPanel onSelect={handleRecipientSelect} />
        </div>
      )}
      <Mark />
    </div>
  )
}
