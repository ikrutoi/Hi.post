import React, { useEffect, useRef, useState, useCallback } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { SenderView, RecipientView } from './AddressView'
import { RecipientsView } from './RecipientsView'
import { AddressFormView } from './AddressFormView'
import { useEnvelopeFacade } from '../../application/facades'
import { useSenderFacade } from '../../sender/application/facades'
import { useRecipientFacade } from '../../recipient/application/facades'
import { useAppSelector, useAppDispatch } from '@app/hooks'
import { selectSenderView } from '../../sender/infrastructure/selectors'
import { selectRecipientView } from '../../recipient/infrastructure/selectors'
import { selectRecipientsToolbarStateWithLiveAddressList } from '../../infrastructure/selectors'
import { setSenderView } from '../../sender/infrastructure/state'
import {
  setRecipientView,
  setRecipientViewId,
} from '../../recipient/infrastructure/state'
import { setRecipientViewEditMode } from '@envelope/infrastructure/state'
import styles from './EnvelopeAddress.module.scss'
import type { EnvelopeAddressProps } from '../domain/types'
import { ToolbarSection } from '@/features/toolbar/domain/types'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { IconUserRecipient, IconUsers, IconUserSender } from '@shared/ui/icons'

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
  const senderEntries = useAppSelector(
    (state) => state.addressBook?.senderEntries ?? [],
  )
  const recipientEntries = useAppSelector(
    (state) => state.addressBook?.recipientEntries ?? [],
  )
  const templateEntry = editingTemplateId
    ? entriesForRole.find((e) => e.id === editingTemplateId)
    : null
  const dataMatchesTemplate = addressMatchesTemplate(
    value,
    templateEntry?.address,
  )

  const dispatch = useAppDispatch()
  const senderView = useAppSelector(selectSenderView)
  const recipientView = useAppSelector(selectRecipientView)
  const recipientsToolbarStateWithLiveAddressList = useAppSelector(
    selectRecipientsToolbarStateWithLiveAddressList,
  )

  const recipientFieldsetContainerScrollRef = useRef<HTMLDivElement | null>(
    null,
  )
  const [recipientScrollContainerReady, setRecipientScrollContainerReady] =
    useState(false)
  const setRecipientFieldsetContainerScrollRef = useCallback(
    (el: HTMLDivElement | null) => {
      recipientFieldsetContainerScrollRef.current = el
      if (el) setRecipientScrollContainerReady(true)
    },
    [],
  )

  console.log('recipient state', recipientFacade.state)
  console.log('sender state', senderFacade.state)
  console.log('envelope state', envelopeFacade.isEnvelopeComplete)

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

  const hasRecipientAddressData =
    role === 'recipient' &&
    Object.values(value).some((v) => (v ?? '').trim() !== '')

  const showSingleRecipientView =
    role === 'recipient' &&
    !recipientFacade.isEnabled &&
    recipientView === 'recipientView' &&
    (isSingleRecipientWithSavedTemplate || hasRecipientAddressData)

  const hasSenderAddressData =
    role === 'sender' &&
    Object.values(value).some((v) => (v ?? '').trim() !== '')

  const isSenderWithSavedTemplate =
    role === 'sender' &&
    senderFacade.isEnabled &&
    editingTemplateId != null &&
    (templateEntry ? dataMatchesTemplate : hasSenderAddressData)

  const openAddressForm = (r: 'sender' | 'recipient') => {
    envelopeFacade.setAddressFormViewState(true, r)
    if (r === 'sender') dispatch(setSenderView('addressFormSenderView'))
    else dispatch(setRecipientView('addressFormRecipientView'))
  }

  const handleEditRecipientFromList = (entry: AddressBookEntry) => {
    // В режиме «Пользователи» открываем универсальный RecipientView в режиме редактирования,
    // тумблер не трогаем. После выхода из редактирования снова покажем RecipientsView.
    dispatch(setRecipientViewId(entry.id))
    ;(Object.entries(entry.address) as [keyof typeof value, string][]).forEach(
      ([field, fieldValue]) => {
        update(field as any, fieldValue)
      },
    )
    dispatch(setRecipientView('recipientView'))
    dispatch(setRecipientViewEditMode(true))
  }

  const handlePlaceholderClick = (r: 'sender' | 'recipient') => {
    const entries = r === 'sender' ? senderEntries : recipientEntries
    if (entries.length > 0) {
      if (r === 'sender') envelopeFacade.toggleSenderListPanelOpen()
      else envelopeFacade.toggleRecipientListPanelOpen()
    } else {
      openAddressForm(r)
    }
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

            {senderView === 'addressFormSenderView' ? (
              <AddressFormView
                role="sender"
                roleLabel={roleLabel}
                address={senderFacade.formDraft}
                onFieldChange={update}
                lang={lang}
              />
            ) : isSenderWithSavedTemplate ? (
              <SenderView templateId={editingTemplateId!} address={value} />
            ) : (
              <div
                role="button"
                tabIndex={0}
                className={clsx(
                  styles.addressFormPlaceholder,
                  styles.addressFormPlaceholderSender,
                  styles.addressFormPlaceholderBg,
                )}
                onClick={() => handlePlaceholderClick('sender')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handlePlaceholderClick('sender')
                  }
                }}
                aria-label="Add sender address"
              >
                <IconUserSender
                  className={styles.addressFormPlaceholderIconBg}
                />
              </div>
            )}
          </fieldset>
        </div>
      )}

      {role === 'recipient' && (
        <div className={styles.addressFormRecipientBody}>
          {recipientFacade.isEnabled && (
            <div
              ref={setRecipientFieldsetContainerScrollRef}
              className={styles.recipientFieldsetContainerScroll}
            />
          )}
          <fieldset
            className={clsx(
              styles.addressFieldset,
              styles.addressFormRecipient,
              styles.recipientFieldsetContent,
              recipientFacade.isEnabled && styles.recipientFieldsetMulti,
              recipientFacade.isEnabled &&
                recipientView !== 'addressFormRecipientView' &&
                recipientFacade.recipientsDisplayList.length > 0 &&
                styles.recipientFieldsetWithList,
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
                    }
                    stateOverride={
                      recipientFacade.isEnabled
                        ? recipientsToolbarStateWithLiveAddressList
                        : undefined
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
                address={recipientFacade.formDraft}
                onFieldChange={update}
                lang={lang}
              />
            ) : recipientView === 'recipientView' &&
              (hasRecipientAddressData ||
                isSingleRecipientWithSavedTemplate) ? (
              <RecipientView
                templateId={editingTemplateId ?? ''}
                address={value}
              />
            ) : recipientFacade.isEnabled &&
              recipientFacade.recipientsDisplayList.length > 0 ? (
              <RecipientsView
                entries={recipientFacade.recipientsDisplayList}
                onRemove={recipientFacade.removeFromList}
                onEdit={handleEditRecipientFromList}
                scrollbarPortalTarget={
                  recipientScrollContainerReady
                    ? recipientFieldsetContainerScrollRef
                    : undefined
                }
              />
            ) : showSingleRecipientView ? (
              <RecipientView
                templateId={editingTemplateId ?? ''}
                address={value}
              />
            ) : (
              <div
                role="button"
                tabIndex={0}
                className={clsx(
                  styles.addressFormPlaceholder,
                  styles.addressFormPlaceholderRecipient,
                  styles.addressFormPlaceholderBg,
                )}
                onClick={() => handlePlaceholderClick('recipient')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handlePlaceholderClick('recipient')
                  }
                }}
                aria-label={
                  recipientFacade.isEnabled
                    ? 'Add recipients'
                    : 'Add recipient address'
                }
              >
                {recipientFacade.isEnabled ? (
                  <IconUsers className={styles.addressFormPlaceholderIconBg} />
                ) : (
                  <IconUserRecipient
                    className={styles.addressFormPlaceholderIconBg}
                  />
                )}
              </div>
            )}
          </fieldset>
        </div>
      )}
    </form>
  )
}
