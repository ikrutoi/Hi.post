import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { SenderView, RecipientView } from './AddressView'
import { RecipientsView } from './RecipientsView'
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
import { setSenderView, setSenderViewId } from '../../sender/infrastructure/state'
import {
  setRecipientView,
  setRecipientViewId,
} from '../../recipient/infrastructure/state'
import { closeAddressEditSession } from '@envelope/infrastructure/state'
import {
  selectActiveAddressEdit,
  selectRecipientViewEditMode,
  selectSenderViewEditMode,
} from '@envelope/infrastructure/selectors'
import styles from './EnvelopeAddress.module.scss'
import type { EnvelopeAddressProps } from '../domain/types'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import {
  IconUsers,
  IconUserSender,
} from '@shared/ui/icons'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { toolbarAction } from '@toolbar/application/helpers'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useEnvelopeMobileAddressFocus } from '../../presentation/EnvelopeMobileAddressFocusContext'

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

  const senderAppliedIds = useAppSelector(selectSenderApplied)
  const activeAddressEdit = useAppSelector(selectActiveAddressEdit)
  const editingTemplateId =
    role === 'sender'
      ? envelopeFacade.senderTemplateId
      : envelopeFacade.recipientTemplateId
  const cardTemplateId =
    role === 'sender'
      ? activeAddressEdit?.role === 'sender'
        ? activeAddressEdit.templateId
        : (editingTemplateId ?? senderAppliedIds[0] ?? null)
      : activeAddressEdit?.role === 'recipient'
        ? activeAddressEdit.templateId
        : editingTemplateId

  const senderEntries = useAppSelector(
    (state) => state.addressBook?.senderEntries ?? [],
  )
  const recipientEntries = useAppSelector(
    (state) => state.addressBook?.recipientEntries ?? [],
  )

  const dispatch = useAppDispatch()
  const isMobile = useAppSelector(selectIsMobileLayout)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const senderView = useAppSelector(selectSenderView)
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const senderViewEditMode = useAppSelector(selectSenderViewEditMode)
  const recipientView = useAppSelector(selectRecipientView)
  const recipientsFormViewIdsCount = useAppSelector(
    selectRecipientsFormViewIdsCount,
  )

  const recipientFieldsetRef = useRef<HTMLDivElement | null>(null)
  const senderFieldsetRef = useRef<HTMLDivElement | null>(null)

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

  const recipientIdForDisplay =
    role === 'recipient' ? (editingTemplateId ?? null) : null

  const recipientDisplayEntry = useMemo((): AddressBookEntry | null => {
    if (
      role !== 'recipient' ||
      recipientView !== 'recipientView' ||
      recipientIdForDisplay == null
    ) {
      return null
    }
    const fromBook = recipientEntries.find((e) => e.id === recipientIdForDisplay)
    if (fromBook) return fromBook
    if (!Object.values(value).some((v) => (v ?? '').trim() !== '')) return null
    return {
      id: recipientIdForDisplay,
      role: 'recipient',
      address: { ...value },
      createdAt: new Date().toISOString(),
    }
  }, [
    role,
    recipientView,
    recipientIdForDisplay,
    recipientEntries,
    value,
  ])

  const showRecipientDetailCard = recipientDisplayEntry != null

  const showRecipientsEnvelopeList =
    role === 'recipient' &&
    recipientView !== 'recipientCreate' &&
    recipientView !== 'recipientView' &&
    recipientsDisplayList.length > 1

  const applyRecipientEntry = useCallback(
    (entry: AddressBookEntry) => {
      dispatch(setRecipientViewId(entry.id))
      ;(
        Object.entries(entry.address) as [keyof typeof value, string][]
      ).forEach(([field, fieldValue]) => {
        update(field as any, fieldValue)
      })
    },
    [dispatch, update],
  )

  useEffect(() => {
    if (role !== 'recipient') return
    if (recipientView === 'recipientCreate') return
    // После Close (recipientsView) не открываем карточку снова, даже если в списке 1 id.
    if (recipientView === 'recipientsView') return

    if (recipientsDisplayList.length === 1) {
      const entry = recipientsDisplayList[0]
      if (
        recipientView === 'recipientView' &&
        editingTemplateId != null &&
        editingTemplateId !== entry.id &&
        hasRecipientAddressData
      ) {
        return
      }
      if (recipientView !== 'recipientView' || editingTemplateId !== entry.id) {
        applyRecipientEntry(entry)
        dispatch(setRecipientView('recipientView'))
      }
      return
    }

    if (
      recipientsDisplayList.length > 1 &&
      recipientView === 'recipientView' &&
      !recipientViewEditMode &&
      editingTemplateId == null &&
      !hasRecipientAddressData
    ) {
      dispatch(setRecipientView('recipientsView'))
      dispatch(setRecipientViewId(null))
    }
  }, [
    role,
    recipientView,
    recipientsDisplayList,
    editingTemplateId,
    recipientViewEditMode,
    hasRecipientAddressData,
    dispatch,
    applyRecipientEntry,
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

  const applySenderEntry = useCallback(
    (entry: AddressBookEntry) => {
      dispatch(setSenderViewId(entry.id))
      ;(Object.entries(entry.address) as [keyof typeof value, string][]).forEach(
        ([field, fieldValue]) => {
          update(field as any, fieldValue)
        },
      )
    },
    [dispatch, update],
  )

  useEffect(() => {
    if (role !== 'sender' || !senderFacade.isEnabled) return
    if (senderView === 'senderCreate') return
    // После Close на applied-карточке (senderEnvelopeView) не открываем карточку снова.
    if (senderView === 'senderEnvelopeView') return

    if (senderDisplayEntry != null) {
      if (
        senderView !== 'senderView' ||
        editingTemplateId !== senderDisplayEntry.id
      ) {
        applySenderEntry(senderDisplayEntry)
        dispatch(setSenderView('senderView'))
      }
    }
  }, [
    role,
    senderFacade.isEnabled,
    senderDisplayEntry,
    senderView,
    editingTemplateId,
    dispatch,
    applySenderEntry,
  ])

  const showSenderDetailCard =
    role === 'sender' &&
    senderFacade.isEnabled &&
    senderView === 'senderView' &&
    senderDisplayEntry != null

  const showSenderMobileViewToolbar =
    isMobile && (mobileFocus?.isFocused('sender') ?? false) && showSenderDetailCard

  const showRecipientMobileViewToolbar =
    isMobile &&
    (mobileFocus?.isFocused('recipient') ?? false) &&
    showRecipientDetailCard

  const renderMobileViewToolbar = (
    section: 'senderView' | 'recipientView',
  ) => (
    <div
      className={styles.envelopeAddressViewToolbar}
      data-envelope-address-view-toolbar
    >
      <Toolbar section={section} />
    </div>
  )

  const openAddressForm = (r: 'sender' | 'recipient') => {
    envelopeFacade.setAddressFormViewState(true, r)
    if (r === 'sender') dispatch(setSenderView('senderCreate'))
    else dispatch(setRecipientView('recipientCreate'))
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
        closeAddressEditSession({ role: 'recipient', keepRecipientView: true }),
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

  const tryToggleMobileAddressFocus = useCallback(
    (targetRole: 'sender' | 'recipient', el: HTMLElement) => {
      if (!isMobile || mobileFocus == null) return false
      if (targetRole === 'sender' && senderView === 'senderCreate') return false
      if (targetRole === 'recipient' && recipientView === 'recipientCreate') {
        return false
      }
      const isEditMode =
        targetRole === 'sender' ? senderViewEditMode : recipientViewEditMode
      if (isEditMode) return false
      if (
        el.closest(
          'button, a, input, textarea, select, [role="button"], [data-envelope-address-close], [data-address-edit-row], [data-scrollarea-track], [data-address-book-entry]',
        )
      ) {
        return false
      }
      mobileFocus.toggleFocus(targetRole)
      return true
    },
    [
      isMobile,
      mobileFocus,
      senderView,
      recipientView,
      senderViewEditMode,
      recipientViewEditMode,
    ],
  )

  /** Same path as Toolbar → envelope saga (`handleEnvelopeToolbarAction`, key addressList). */
  const handleRecipientFieldsetMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const fieldset = recipientFieldsetRef.current
      const el = e.target as HTMLElement | null
      if (!fieldset || !el || !fieldset.contains(el)) return
      if (
        el.closest(`.${styles.envelopeRecipientToolbarIconContainer}`)
      ) {
        if (recipientViewEditMode) {
          dispatch(toolbarAction({ section: 'recipientView', key: 'edit' }))
        }
        return
      }
      if (tryToggleMobileAddressFocus('recipient', el)) {
        e.stopPropagation()
        return
      }
      if (el.closest('button, a, input, textarea, select, [role="button"]'))
        return
      if (el.closest('[data-scrollarea-track]')) return
      if (el.closest('[data-address-book-entry]')) return
      if (el.closest('[data-envelope-address-surface]')) return
      if (recipientViewEditMode) {
        dispatch(toolbarAction({ section: 'recipientView', key: 'edit' }))
        return
      }
      dispatch(toolbarAction({ section: 'recipients', key: 'addressList' }))
    },
    [dispatch, recipientViewEditMode, tryToggleMobileAddressFocus],
  )

  const handleSenderFieldsetMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const fieldset = senderFieldsetRef.current
      const el = e.target as HTMLElement | null
      if (!fieldset || !el || !fieldset.contains(el)) return
      if (tryToggleMobileAddressFocus('sender', el)) {
        e.stopPropagation()
        return
      }
      if (el.closest('button, a, input, textarea, select, [role="button"]'))
        return
      if (el.closest('[data-envelope-address-surface]')) return
      if (senderViewEditMode) {
        dispatch(toolbarAction({ section: 'senderView', key: 'edit' }))
        return
      }
      dispatch(toolbarAction({ section: 'sender', key: 'addressList' }))
    },
    [dispatch, senderViewEditMode, tryToggleMobileAddressFocus],
  )

  return (
    <form
      className={clsx(
        styles.addressForm,
        styles[`addressForm${roleLabel}`],
        role === 'sender' && styles.addressFormSenderFill,
      )}
      onSubmit={(e) => e.preventDefault()}
    >
      {senderFacade.isEnabled && role === 'sender' && (
        <div className={styles.addressFormSenderBody}>
          <div className={styles.addressFieldsetStack}>
            {showSenderMobileViewToolbar
              ? renderMobileViewToolbar('senderView')
              : null}
            <div
              ref={senderFieldsetRef}
              data-envelope-address-fieldset
              role="group"
              aria-label={roleLabel}
              className={clsx(
                styles.addressFieldset,
                styles.addressFormSender,
                senderView === 'senderCreate' && styles.addressFieldsetCreateOpen,
              )}
              onMouseDownCapture={handleSenderFieldsetMouseDownCapture}
            >
              <div className={styles.addressFieldsetInner}>
                {senderView === 'senderCreate' ? (
                  <AddressFormView
                    key="senderCreate"
                    role="sender"
                    roleLabel={roleLabel}
                    address={senderFacade.formDraft}
                    onFieldChange={update}
                    lang={lang}
                  />
                ) : showSenderDetailCard ? (
                  <SenderView templateId={cardTemplateId!} address={value} />
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
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'recipient' && (
        <div className={styles.addressFormRecipientBody}>
          <div
            ref={setRecipientFieldsetContainerScrollRef}
            className={styles.recipientFieldsetContainerScroll}
          />
          <div className={styles.addressFieldsetStack}>
            {showRecipientMobileViewToolbar
              ? renderMobileViewToolbar('recipientView')
              : null}
            <div
              ref={recipientFieldsetRef}
              data-envelope-address-fieldset
              role="group"
              aria-label="Recipients"
              className={clsx(
                styles.addressFieldset,
                styles.addressFormRecipient,
                styles.recipientFieldsetContent,
                showRecipientsEnvelopeList && styles.recipientFieldsetMulti,
                showRecipientsEnvelopeList && styles.recipientFieldsetWithList,
                recipientView === 'recipientCreate' &&
                  styles.addressFieldsetCreateOpen,
              )}
              onMouseDownCapture={handleRecipientFieldsetMouseDownCapture}
            >
              <div className={styles.envelopeRecipientToolbarIconContainer}>
                {recipientsFormViewIdsCount > 0 && (
                  <span className={styles.recipientsCountBadge}>
                    {recipientsFormViewIdsCount}
                  </span>
                )}
                <IconUsers className={styles.envelopeRecipientToolbarIcon} />
              </div>
              <div className={styles.addressFieldsetInner}>
                {recipientView === 'recipientCreate' ? (
                  <AddressFormView
                    key="recipientCreate"
                    role="recipient"
                    roleLabel={roleLabel}
                    address={recipientFacade.formDraft}
                    onFieldChange={update}
                    lang={lang}
                  />
                ) : showRecipientDetailCard ? (
                  <RecipientView
                    templateId={cardTemplateId ?? ''}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
