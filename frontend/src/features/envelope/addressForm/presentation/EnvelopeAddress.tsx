import React, { useEffect } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { SenderView, RecipientView } from './AddressView'
import { RecipientsView } from './RecipientsView'
import { AddressFormView } from './AddressFormView'
import { useEnvelopeFacade } from '../../application/facades'
import { useSenderFacade } from '../../sender/application/facades'
import { useRecipientFacade } from '../../recipient/application/facades'
import { useAppSelector, useAppDispatch } from '@app/hooks'
import { selectSenderView } from '../../sender/infrastructure/selectors'
import { selectRecipientView } from '../../recipient/infrastructure/selectors'
import { setSenderView } from '../../sender/infrastructure/state'
import { setRecipientView } from '../../recipient/infrastructure/state'
import styles from './EnvelopeAddress.module.scss'
import type { EnvelopeAddressProps } from '../domain/types'
import { ToolbarSection } from '@/features/toolbar/domain/types'

const ADDRESS_FIELDS = ['name', 'street', 'city', 'zip', 'country'] as const

function addressMatchesTemplate(
  value: Record<string, string>,
  templateAddress: Record<string, string> | undefined,
): boolean {
  if (!templateAddress) return false
  return ADDRESS_FIELDS.every(
    (f) => (value[f] ?? '').trim() === (templateAddress[f] ?? '').trim(),
  )
}

export const EnvelopeAddress: React.FC<EnvelopeAddressProps> = ({
  role,
  roleLabel,
  lang,
}) => {
  const envelopeFacade = useEnvelopeFacade()
  const senderFacade = useSenderFacade()
  const recipientFacade = useRecipientFacade()
  const facade = role === 'sender' ? senderFacade : recipientFacade
  const { update, address: value } = facade

  const editingTemplateId =
    role === 'sender'
      ? envelopeFacade.senderTemplateId
      : envelopeFacade.recipientTemplateId

  const entriesForRole = useAppSelector((state) =>
    role === 'sender'
      ? (state.addressBook?.senderEntries ?? [])
      : (state.addressBook?.recipientEntries ?? []),
  )
  const templateEntry = editingTemplateId
    ? entriesForRole.find((e) => e.id === editingTemplateId)
    : null
  const dataMatchesTemplate = addressMatchesTemplate(
    value,
    templateEntry?.address,
  )

  useEffect(() => {
    if (editingTemplateId == null) return
    if (templateEntry) return
    if (!entriesForRole.length) return

    const fallbackEntry = entriesForRole[0]

    if (role === 'sender') {
      envelopeFacade.selectSenderFromList(fallbackEntry)
    } else {
      envelopeFacade.selectRecipientFromList(fallbackEntry)
    }
  }, [editingTemplateId, templateEntry, entriesForRole, role, envelopeFacade])

  const isSingleRecipientWithSavedTemplate =
    role === 'recipient' &&
    !recipientFacade.isEnabled &&
    editingTemplateId != null &&
    dataMatchesTemplate

  const isSenderWithSavedTemplate =
    role === 'sender' &&
    senderFacade.isEnabled &&
    editingTemplateId != null &&
    dataMatchesTemplate

  const recipientToggleChecked =
    role === 'recipient' && recipientFacade.isEnabled
  const recipientToggleDisabled = false

  const dispatch = useAppDispatch()
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)

  const openAddressForm = (r: 'sender' | 'recipient') => {
    envelopeFacade.setAddressFormViewState(true, r)
    if (r === 'sender') dispatch(setSenderView('addressFormSenderView'))
    else dispatch(setRecipientView('addressFormRecipientView'))
  }

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
              <div
                className={clsx(
                  styles.addressToolbar,
                  styles.addressToolbarSender,
                )}
              >
                <Toolbar section="sender" />
              </div>
              <span className={clsx(styles.addressLegendReplica)}>
                {roleLabel}
              </span>
            </div>

            {isSenderWithSavedTemplate ? (
              <SenderView templateId={editingTemplateId!} address={value} />
            ) : senderView === 'addressFormSenderView' ? (
              <AddressFormView
                role="sender"
                roleLabel={roleLabel}
                address={value}
                onFieldChange={update}
                lang={lang}
              />
            ) : (
              <div
                className={clsx(
                  styles.addressFormPlaceholder,
                  styles.addressFormPlaceholderSender,
                )}
              >
                <button
                  type="button"
                  className={clsx(
                    styles.addressFormPlaceholderBtn,
                    styles.addressFormPlaceholderBtnSender,
                  )}
                  onClick={() => openAddressForm('sender')}
                >
                  Add sender address
                </button>
              </div>
            )}
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
                  {envelopeFacade.selectedRecipientEntriesInOrder.length >
                    0 && (
                    <span className={styles.recipientsCountBadge}>
                      {envelopeFacade.selectedRecipientEntriesInOrder.length}
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
                      recipientFacade.isEnabled
                        ? 'recipients'
                        : ('recipient' as ToolbarSection)
                      // : isSingleRecipientWithSavedTemplate
                      //   ? 'recipientView'
                      //   : ('recipient' as ToolbarSection)
                    }
                  />
                </div>
              </div>

              {!recipientFacade.isEnabled ? (
                <span className={styles.addressLegendReplica}>Recipient</span>
              ) : (
                <span className={styles.addressLegendReplica}>Recipients</span>
              )}
            </div>
            {recipientView === 'addressFormRecipientView' ? (
              <AddressFormView
                role="recipient"
                roleLabel="Recipient"
                address={value}
                onFieldChange={update}
                lang={lang}
              />
            ) : recipientFacade.isEnabled ? (
              <RecipientsView
                entries={recipientFacade.recipientsDisplayList}
                onRemove={recipientFacade.removeFromList}
              />
            ) : isSingleRecipientWithSavedTemplate ? (
              <RecipientView templateId={editingTemplateId!} address={value} />
            ) : (
              <div
                className={clsx(
                  styles.addressFormPlaceholder,
                  styles.addressFormPlaceholderRecipient,
                )}
              >
                <button
                  type="button"
                  className={clsx(
                    styles.addressFormPlaceholderBtn,
                    styles.addressFormPlaceholderBtnRecipient,
                  )}
                  onClick={() => openAddressForm('recipient')}
                >
                  Add recipient address
                </button>
              </div>
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
