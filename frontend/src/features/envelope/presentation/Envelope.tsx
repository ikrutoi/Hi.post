import React, { useCallback } from 'react'
import clsx from 'clsx'
import type { AddressField } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { RecipientListPanel } from '../addressBook/presentation/RecipientListPanel'
import { useRecipientFacade } from '../recipient/application/facades'
import { useAddressBookList } from '../addressBook/application/controllers'
import { updateRecipientField } from '../recipient/infrastructure/state'
import { toggleRecipientSelection } from '../infrastructure/state'
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

  const selectedRecipientIds = useAppSelector(
    (state) => state.envelopeSelection.selectedRecipientIds,
  )

  const handleRecipientSelect = useCallback(
    (entry: AddressBookEntry) => {
      const wasSelected = selectedRecipientIds.includes(entry.id)
      dispatch(toggleRecipientSelection(entry.id))
      if (!wasSelected) {
        ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
          ([field, value]) => {
            dispatch(updateRecipientField({ field, value }))
          }
        )
      }
    },
    [dispatch, selectedRecipientIds],
  )

  return (
    <div className={styles.envelope}>
      <div className={styles.envelopeLeftSlot}>
        {showRecipientList ? (
          <div className={styles.recipientListPanelWrap}>
            <RecipientListPanel
              onSelect={handleRecipientSelect}
              selectedIds={selectedRecipientIds}
            />
          </div>
        ) : (
          <>
            <div className={styles.envelopeLogo} />
            <div
              className={clsx(
                styles.envelopeSection,
                styles.envelopeSectionSender
              )}
            >
              <EnvelopeAddress
                role="sender"
                roleLabel="Sender"
                lang={lang}
              />
            </div>
          </>
        )}
      </div>
      <div
        className={clsx(
          styles.envelopeSection,
          styles.envelopeSectionRecipient
        )}
      >
        <EnvelopeAddress
          role="recipient"
          roleLabel="Recipient"
          lang={lang}
        />
      </div>
      <Mark />
    </div>
  )
}
