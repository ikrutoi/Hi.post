import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import type { AddressField } from '@shared/config/constants'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
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
import { getMatchingEntryId } from '../domain/helpers'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  const lang = getSafeLang(i18n.language)
  const dispatch = useAppDispatch()
  const { isEnabled: recipientListEnabled } = useRecipientFacade()
  const { entries: recipientEntries } = useAddressBookList('recipient')
  const recipientData = useAppSelector(
    (state) => state.recipient.data,
  )
  const selectedRecipientIds = useAppSelector(
    (state) => state.envelopeSelection.selectedRecipientIds,
  )
  const recipientListPanelOpen = useAppSelector(
    (state) => state.envelopeSelection.recipientListPanelOpen,
  )

  const showRecipientList = recipientListPanelOpen

  // В single — подсвечиваем только адрес, совпадающий с формой; в multi — выбранные в списке
  const listSelectedIds = useMemo(() => {
    if (recipientListEnabled) return selectedRecipientIds
    const singleId = getMatchingEntryId(recipientData, recipientEntries)
    return singleId ? [singleId] : []
  }, [recipientListEnabled, selectedRecipientIds, recipientData, recipientEntries])

  const handleRecipientSelect = useCallback(
    (entry: AddressBookEntry) => {
      if (recipientListEnabled) {
        dispatch(toggleRecipientSelection(entry.id))
      } else {
        ;(Object.entries(entry.address) as [AddressField, string][]).forEach(
          ([field, value]) => {
            dispatch(updateRecipientField({ field, value }))
          },
        )
      }
    },
    [dispatch, recipientListEnabled],
  )

  return (
    <div className={styles.envelope}>
      <div className={styles.envelopeLeftSlot}>
        {showRecipientList ? (
          <div className={styles.recipientListPanelWrap}>
            <RecipientListPanel
              onSelect={handleRecipientSelect}
              selectedIds={listSelectedIds}
            />
          </div>
        ) : (
          <>
            <div className={styles.envelopeLogo} />
            <div
              className={clsx(
                styles.envelopeSection,
                styles.envelopeSectionSender,
              )}
            >
              <EnvelopeAddress role="sender" roleLabel="Sender" lang={lang} />
            </div>
          </>
        )}
      </div>
      <div
        className={clsx(
          styles.envelopeSection,
          styles.envelopeSectionRecipient,
        )}
      >
        <EnvelopeAddress role="recipient" roleLabel="Recipient" lang={lang} />
      </div>
      <div className={styles.envelopeMark}>
        <Mark />
      </div>
    </div>
  )
}
