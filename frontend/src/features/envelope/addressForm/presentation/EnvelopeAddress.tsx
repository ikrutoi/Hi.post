import React, { useRef, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { Label } from './Label/Label'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { AddressEntry } from '../../addressBook/presentation/AddressEntry'
import { toggleRecipientSelection } from '../../infrastructure/state'
import { useEnvelopeAddress } from '../application/hooks'
import { useSenderFacade } from '../../sender/application/facades'
import { useRecipientFacade } from '../../recipient/application/facades'
import { useAddressBookList } from '../../addressBook/application/controllers'
import styles from './EnvelopeAddress.module.scss'
import type { EnvelopeAddressProps } from '../domain/types'

const ADDRESS_FIELDS = ['name', 'street', 'city', 'zip', 'country'] as const

export const EnvelopeAddress: React.FC<EnvelopeAddressProps> = ({
  role,
  roleLabel,
  lang,
}) => {
  const { labelLayout } = useEnvelopeAddress(role, lang)
  const dispatch = useAppDispatch()
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()
  const facade = role === 'sender' ? senderFacade : recipientFacade
  const { layout, update, address: value } = facade
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const { entries: recipientEntries } = useAddressBookList('recipient')
  const selectedRecipientIds = useAppSelector(
    (s) => s.envelopeSelection.selectedRecipientIds,
  )
  const selectedEntriesInOrder = useMemo(
    () =>
      selectedRecipientIds
        .map((id) => recipientEntries.find((e) => e.id === id))
        .filter(Boolean) as typeof recipientEntries,
    [selectedRecipientIds, recipientEntries],
  )

  const recipientListEmpty = recipientEntries.length === 0
  const recipientToggleDisabled = role === 'recipient' && recipientListEmpty
  const recipientToggleChecked =
    role === 'recipient' && !recipientListEmpty && recipientFacade.isEnabled

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault()
      inputsRef.current[i + 1]?.focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      inputsRef.current[i - 1]?.focus()
    }
  }

  const handleRemoveRecipient = (id: string) => {
    dispatch(toggleRecipientSelection(id))
  }

  let fieldIndex = 0

  const renderLabelFields = (
    layout: typeof labelLayout,
    currentRole: 'sender' | 'recipient',
    currentRoleLabel: string,
  ) =>
    layout.flatMap((item, i) => {
      if (Array.isArray(item)) {
        return (
          <div
            key={`group-${i}`}
            className={clsx(
              styles.labelGroup,
              styles[`labelGroup${currentRoleLabel}`],
            )}
          >
            {item.map((subItem, j) => {
              const idx = fieldIndex++
              return (
                <Label
                  key={`${subItem.key}-${i}-${j}`}
                  ref={(el: HTMLInputElement | null) => {
                    if (el) inputsRef.current[idx] = el
                  }}
                  role={currentRole}
                  roleLabel={currentRoleLabel}
                  label={subItem.label}
                  field={subItem.key}
                  value={value[subItem.key]}
                  onValueChange={(field, val) => update(field, val)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
              )
            })}
          </div>
        )
      }
      const idx = fieldIndex++
      return (
        <Label
          key={`${item.key}-${i}`}
          ref={(el: HTMLInputElement | null) => {
            if (el) inputsRef.current[idx] = el
          }}
          role={currentRole}
          roleLabel={currentRoleLabel}
          label={item.label}
          field={item.key}
          value={value[item.key]}
          onValueChange={(field, val) => update(field, val)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        />
      )
    })

  return (
    <form
      className={clsx(
        styles.addressForm,
        styles[`addressForm${roleLabel}`],
        role === 'sender' && styles.addressFormSenderFill,
        role === 'recipient' && styles.addressFormRecipientFill,
      )}
      onSubmit={(e) => e.preventDefault()}
    >
      {role === 'sender' && (
        <div className={styles.senderToggle}>
          <Toggle
            label="Specify the sender's address"
            checked={senderFacade.isEnabled}
            onChange={senderFacade.toggleEnabled}
            size="default"
            variant="envelopeSender"
          />
        </div>
      )}

      {senderFacade.isEnabled && role === 'sender' && (
        <div className={styles.addressFormSenderBody}>
          <fieldset
            className={clsx(styles.addressFieldset, styles.addressFormSender)}
          >
            <legend
              className={clsx(styles.addressLegend, styles.addressLegendSender)}
            >
              {roleLabel}
            </legend>

            <div
              className={clsx(
                styles.addressLegendReplicaContainer,
                styles.addressLegendReplicaContainerSender,
              )}
            >
              <span className={clsx(styles.addressLegendReplica)}>
                {roleLabel}
              </span>
              <div className={clsx(styles.addressToolbarDouble)}>
                <div
                  className={clsx(
                    styles.addressToolbarFavorite,
                    styles.addressToolbarFavoriteSender,
                  )}
                >
                  <Toolbar section="senderFavorite" />
                </div>
              </div>
              <div
                className={clsx(
                  styles.addressToolbar,
                  styles.addressToolbarSender,
                )}
              >
                <Toolbar section="sender" />
              </div>
            </div>

            {renderLabelFields(labelLayout, 'sender', roleLabel)}
          </fieldset>
        </div>
      )}

      {role === 'recipient' && (
        <div className={styles.addressFormRecipientBody}>
          <fieldset
            className={clsx(
              styles.addressFieldset,
              styles.addressFormRecipient,
              styles.recipientFieldsetContent,
              recipientFacade.isEnabled && styles.recipientFieldsetMulti,
            )}
          >
            <legend
              className={clsx(
                styles.addressLegend,
                styles.addressLegendRecipient,
                recipientFacade.isEnabled && styles.addressLegendMulti,
              )}
            >
              {recipientFacade.isEnabled ? (
                <>
                  {selectedEntriesInOrder.length > 0 && (
                    <span className={styles.recipientsCountBadge}>
                      {selectedEntriesInOrder.length}
                    </span>
                  )}
                  Recipients
                </>
              ) : (
                'Recipient'
              )}
            </legend>
            <div
              className={clsx(
                styles.addressLegendReplicaContainer,
                styles.addressLegendReplicaContainerRecipient,
              )}
            >
              <div className={clsx(styles.addressToolbarDouble)}>
                <div
                  className={clsx(
                    styles.addressToolbar,
                    styles.addressToolbarRecipient,
                  )}
                >
                  <Toolbar
                    section={
                      recipientFacade.isEnabled ? 'recipients' : 'recipient'
                    }
                  />
                </div>
                {!recipientFacade.isEnabled && (
                  <div
                    className={clsx(
                      styles.addressToolbarFavorite,
                      styles.addressToolbarFavoriteRecipient,
                    )}
                  >
                    <Toolbar section="recipientFavorite" />
                  </div>
                )}
              </div>

              <span className={styles.addressLegendReplica}>
                {recipientFacade.isEnabled ? 'Recipients' : 'Recipient'}
              </span>
            </div>
            {recipientFacade.isEnabled ? (
              <div className={styles.recipientsList}>
                {selectedEntriesInOrder.map((entry) => (
                  <AddressEntry
                    key={entry.id}
                    entry={entry}
                    onSelect={() => handleRemoveRecipient(entry.id)}
                    onDelete={handleRemoveRecipient}
                    isSelected={false}
                  />
                ))}
              </div>
            ) : (
              renderLabelFields(labelLayout, 'recipient', 'Recipient')
            )}
          </fieldset>
        </div>
      )}

      {role === 'recipient' && (
        <div className={styles.recipientToggle}>
          <Toggle
            label="Specify the recipient's address"
            checked={recipientToggleChecked}
            onChange={recipientFacade.toggleEnabled}
            size="default"
            variant="envelopeRecipient"
            disabled={recipientToggleDisabled}
          />
        </div>
      )}
    </form>
  )
}
