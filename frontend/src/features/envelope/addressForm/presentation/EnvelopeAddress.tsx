import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { SenderView, RecipientView } from './AddressView'
import { RecipientsView } from './RecipientsView'
import { SenderEnvelopeView } from './SenderEnvelopeView'
import { AddressFormView } from './AddressFormView'
import { useEnvelopeFacade } from '../../application/facades'
import { useSenderFacade } from '../../sender/application/facades'
import { useRecipientFacade } from '../../recipient/application/facades'
import { useAppSelector, useAppDispatch } from '@app/hooks'
import {
  selectSenderApplied,
  selectSenderView,
} from '../../sender/infrastructure/selectors'
import { selectRecipientView, selectRecipientsFormViewIdsCount } from '../../recipient/infrastructure/selectors'
import { selectRecipientsToolbarStateWithLiveAddressList } from '../../infrastructure/selectors'
import {
  clearSenderViewDraft,
  setSenderApplied,
  setSenderView,
  setSenderViewId,
} from '../../sender/infrastructure/state'
import {
  setRecipientView,
  setRecipientViewId,
} from '../../recipient/infrastructure/state'
import { setRecipientViewEditMode } from '@envelope/infrastructure/state'
import {
  selectRecipientViewEditMode,
  selectSenderViewEditMode,
} from '@envelope/infrastructure/selectors'
import styles from './EnvelopeAddress.module.scss'
import type { EnvelopeAddressProps } from '../domain/types'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import {
  IconUsers,
  IconUserSender,
  IconUserSenderCentered,
} from '@shared/ui/icons'
import { toolbarAction } from '@toolbar/application/helpers'

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
  const senderAppliedIds = useAppSelector(selectSenderApplied)
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const recipientView = useAppSelector(selectRecipientView)
  const recipientsToolbarStateWithLiveAddressList = useAppSelector(
    selectRecipientsToolbarStateWithLiveAddressList,
  )
  const recipientsFormViewIdsCount = useAppSelector(
    selectRecipientsFormViewIdsCount,
  )

  const recipientFieldsetRef = useRef<HTMLFieldSetElement | null>(null)
  const senderFieldsetRef = useRef<HTMLFieldSetElement | null>(null)

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

  // console.log('recipient state', recipientFacade.state)
  // console.log('sender state', senderFacade.state)
  // console.log('envelope state', envelopeFacade.isEnvelopeComplete)

  const hasRecipientAddressData =
    role === 'recipient' &&
    Object.values(value).some((v) => (v ?? '').trim() !== '')

  const recipientsDisplayList = recipientFacade.recipientsDisplayList

  const showRecipientDetailCard =
    role === 'recipient' &&
    recipientView === 'recipientView' &&
    (hasRecipientAddressData ||
      (editingTemplateId != null && dataMatchesTemplate))

  const showRecipientsEnvelopeList =
    role === 'recipient' &&
    recipientView !== 'addressFormRecipientView' &&
    recipientView !== 'recipientView' &&
    recipientsDisplayList.length > 0

  useEffect(() => {
    if (role !== 'recipient') return
    if (recipientView === 'addressFormRecipientView') return

    if (
      recipientsDisplayList.length > 0 &&
      recipientView === 'recipientView' &&
      !recipientViewEditMode &&
      editingTemplateId == null
    ) {
      dispatch(setRecipientView('recipientsView'))
      dispatch(setRecipientViewId(null))
    }
  }, [
    role,
    recipientView,
    recipientsDisplayList.length,
    editingTemplateId,
    recipientViewEditMode,
    dispatch,
  ])

  const senderIdForDisplay =
    role === 'sender'
      ? (editingTemplateId ?? senderAppliedIds[0] ?? null)
      : null

  const senderDisplayEntry = useMemo((): AddressBookEntry | null => {
    if (role !== 'sender' || !senderFacade.isEnabled || !senderIdForDisplay) {
      return null
    }
    const fromBook = senderEntries.find((e) => e.id === senderIdForDisplay)
    if (fromBook) return fromBook
    if (!Object.values(value).some((v) => (v ?? '').trim() !== '')) return null
    return {
      id: senderIdForDisplay,
      role: 'sender',
      address: { ...value },
      createdAt: new Date().toISOString(),
    }
  }, [
    role,
    senderFacade.isEnabled,
    senderIdForDisplay,
    senderEntries,
    value,
  ])

  useEffect(() => {
    if (role !== 'sender' || !senderFacade.isEnabled) return
    if (senderView === 'addressFormSenderView') return

    if (
      senderDisplayEntry != null &&
      senderView === 'senderView' &&
      !senderViewEditMode &&
      editingTemplateId == null
    ) {
      dispatch(setSenderViewId(senderIdForDisplay))
      dispatch(setSenderView('senderEnvelopeView'))
    }
  }, [
    role,
    senderFacade.isEnabled,
    senderDisplayEntry,
    senderView,
    senderViewEditMode,
    editingTemplateId,
    senderIdForDisplay,
    dispatch,
  ])

  const showSenderDetailCard =
    role === 'sender' &&
    senderFacade.isEnabled &&
    senderView === 'senderView' &&
    senderDisplayEntry != null

  const showSenderEnvelopeList =
    role === 'sender' &&
    senderFacade.isEnabled &&
    senderView !== 'addressFormSenderView' &&
    senderView !== 'senderView' &&
    senderDisplayEntry != null

  const openAddressForm = (r: 'sender' | 'recipient') => {
    envelopeFacade.setAddressFormViewState(true, r)
    if (r === 'sender') dispatch(setSenderView('addressFormSenderView'))
    else dispatch(setRecipientView('addressFormRecipientView'))
  }

  const handleOpenSenderFromList = (entry: AddressBookEntry) => {
    dispatch(setSenderViewId(entry.id))
    ;(Object.entries(entry.address) as [keyof typeof value, string][]).forEach(
      ([field, fieldValue]) => {
        update(field as any, fieldValue)
      },
    )
    dispatch(setSenderView('senderView'))
  }

  const handleRemoveSenderFromEnvelope = () => {
    dispatch(setSenderViewId(null))
    dispatch(setSenderApplied(false))
    dispatch(clearSenderViewDraft())
    dispatch(setSenderView('senderEnvelopeView'))
  }

  const handleOpenRecipientFromList = (entry: AddressBookEntry) => {
    dispatch(setRecipientViewId(entry.id))
    ;(Object.entries(entry.address) as [keyof typeof value, string][]).forEach(
      ([field, fieldValue]) => {
        update(field as any, fieldValue)
      },
    )
    dispatch(setRecipientView('recipientView'))
    if (recipientViewEditMode) {
      dispatch(
        setRecipientViewEditMode({ enabled: false, keepRecipientView: true }),
      )
    }
  }

  const handlePlaceholderClick = (r: 'sender' | 'recipient') => {
    const entries = r === 'sender' ? senderEntries : recipientEntries
    if (entries.length > 0) {
      dispatch(
        toolbarAction({
          section: r === 'sender' ? 'sender' : 'recipients',
          key: 'addressList',
        }),
      )
    } else {
      openAddressForm(r)
    }
  }

  /** Same path as Toolbar → envelope saga (`handleEnvelopeToolbarAction`, key addressList). */
  const handleRecipientFieldsetMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLFieldSetElement>) => {
      const fieldset = recipientFieldsetRef.current
      const el = e.target as HTMLElement | null
      if (!fieldset || !el || !fieldset.contains(el)) return
      if (
        el.closest(
          `.${styles.addressToolbarRecipient}, .${styles.envelopeRecipientToolbarIconContainer}`,
        )
      )
        return
      if (el.closest('button, a, input, textarea, select, [role="button"]'))
        return
      if (el.closest('[data-scrollarea-track]')) return
      if (el.closest('[data-address-book-entry]')) return
      dispatch(toolbarAction({ section: 'recipients', key: 'addressList' }))
    },
    [dispatch],
  )

  const handleSenderFieldsetMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLFieldSetElement>) => {
      const fieldset = senderFieldsetRef.current
      const el = e.target as HTMLElement | null
      if (!fieldset || !el || !fieldset.contains(el)) return
      if (
        el.closest(
          `.${styles.addressToolbarSender}, .${styles.envelopeSenderToolbarIconContainer}`,
        )
      )
        return
      if (el.closest('button, a, input, textarea, select, [role="button"]'))
        return
      dispatch(toolbarAction({ section: 'sender', key: 'addressList' }))
    },
    [dispatch],
  )

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
            ref={senderFieldsetRef}
            className={clsx(
              styles.addressFieldset,
              styles.addressFormSender,
              styles.recipientFieldsetMulti,
              showSenderEnvelopeList && styles.recipientFieldsetWithList,
            )}
            onMouseDownCapture={handleSenderFieldsetMouseDownCapture}
          >
            <legend
              className={clsx(styles.addressLegend, styles.addressLegendSender)}
            >
              {roleLabel}
            </legend>
            <div
              className={clsx(
                styles.addressToolbar,
                styles.addressToolbarSender,
              )}
            >
              <Toolbar section="sender" />
            </div>
            <div className={styles.envelopeSenderToolbarIconContainer}>
              <IconUserSenderCentered
                className={styles.envelopeSenderToolbarIcon}
              />
            </div>

            {senderView === 'addressFormSenderView' ? (
              <AddressFormView
                key="addressFormSenderView"
                role="sender"
                roleLabel={roleLabel}
                address={senderFacade.formDraft}
                onFieldChange={update}
                lang={lang}
              />
            ) : showSenderDetailCard ? (
              <SenderView templateId={editingTemplateId!} address={value} />
            ) : showSenderEnvelopeList && senderDisplayEntry ? (
              <SenderEnvelopeView
                entry={senderDisplayEntry}
                onOpenSender={handleOpenSenderFromList}
                onRemove={handleRemoveSenderFromEnvelope}
              />
            ) : (
              <div
                role="button"
                tabIndex={0}
                className={clsx(
                  styles.addressFormPlaceholder,
                  styles.addressFormPlaceholderSender,
                  styles.addressFormPlaceholderBg,
                  styles.senderPlaceholderInset,
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
          <div
            ref={setRecipientFieldsetContainerScrollRef}
            className={styles.recipientFieldsetContainerScroll}
          />
          <fieldset
            ref={recipientFieldsetRef}
            className={clsx(
              styles.addressFieldset,
              styles.addressFormRecipient,
              styles.recipientFieldsetContent,
              styles.recipientFieldsetMulti,
              showRecipientsEnvelopeList && styles.recipientFieldsetWithList,
            )}
            onMouseDownCapture={handleRecipientFieldsetMouseDownCapture}
          >
            <legend
              className={clsx(
                styles.addressLegend,
                styles.addressLegendRecipient,
                styles.addressLegendMulti,
              )}
            >
              Recipients
            </legend>
            <div
              className={clsx(
                styles.addressToolbar,
                styles.addressToolbarRecipient,
              )}
            >
              <Toolbar
                section="recipients"
                stateOverride={recipientsToolbarStateWithLiveAddressList}
              />
            </div>
            <div className={styles.envelopeRecipientToolbarIconContainer}>
              {recipientsFormViewIdsCount > 0 && (
                <span className={styles.recipientsCountBadge}>
                  {recipientsFormViewIdsCount}
                </span>
              )}
              <IconUsers className={styles.envelopeRecipientToolbarIcon} />
            </div>
            {recipientView === 'addressFormRecipientView' ? (
              <AddressFormView
                key="addressFormRecipientView"
                role="recipient"
                roleLabel={roleLabel}
                address={recipientFacade.formDraft}
                onFieldChange={update}
                lang={lang}
              />
            ) : showRecipientDetailCard ? (
              <RecipientView
                templateId={editingTemplateId ?? ''}
                address={value}
              />
            ) : showRecipientsEnvelopeList ? (
              <RecipientsView
                entries={recipientsDisplayList}
                onRemove={recipientFacade.removeFromList}
                onOpenRecipient={handleOpenRecipientFromList}
                scrollbarPortalTarget={
                  recipientScrollContainerReady
                    ? recipientFieldsetContainerScrollRef
                    : undefined
                }
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
                aria-label="Add recipients"
              >
                <IconUsers className={styles.addressFormPlaceholderIconBg} />
              </div>
            )}
          </fieldset>
        </div>
      )}
    </form>
  )
}
