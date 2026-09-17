import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { RecipientView } from './AddressView'
import { RecipientsView } from './RecipientsView'
import { AddressFormView } from './AddressFormView'
import { useEnvelopeFacade } from '../../application/facades'
import { useRecipientFacade } from '../../recipient/application/facades'
import { useAppSelector, useAppDispatch } from '@app/hooks'
import {
  selectRecipientView,
  selectRecipientEntriesState,
} from '../../recipient/infrastructure/selectors'
import {
  setRecipientView,
  setRecipientViewId,
} from '../../recipient/infrastructure/state'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxRecipient,
  selectArchiveSandboxRecipientApplied,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import {
  setArchiveRecipientView,
  setArchiveRecipientViewId,
} from '@cardPanel/infrastructure/state'
import {
  closeAddressEditSession,
  clearRecipientsFormPreviewId,
  clearAddressCreateEditContext,
  setAddressFormView,
} from '@envelope/infrastructure/state'
import {
  selectActiveAddressEdit,
  selectAddressCreateEditContext,
  selectRecipientViewEditMode,
  selectRecipientsFormPreviewId,
} from '@envelope/infrastructure/selectors'
import styles from './EnvelopeAddress.module.scss'
import type { EnvelopeAddressProps } from '../domain/types'
import type { AddressBookEntry } from '@envelope/addressBook/domain/types'
import { IconUsers } from '@shared/ui/icons'
import { toolbarAction } from '@toolbar/application/helpers'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useEnvelopeMobileAddressFocus } from '../../presentation/EnvelopeMobileAddressFocusContext'
import { useEnvelopeAddressViewToolbarContent } from '../../presentation/useEnvelopeAddressViewToolbarContent'
import addressFormStyles from './AddressFormView.module.scss'

export const EnvelopeAddress: React.FC<EnvelopeAddressProps> = ({
  role,
  roleLabel,
  lang,
  embedCreateForm = true,
}) => {
  const envelopeFacade = useEnvelopeFacade()
  const recipientFacade = useRecipientFacade()
  const { update, address: value } = recipientFacade

  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sandboxRecipientAppliedIds = useAppSelector(
    selectArchiveSandboxRecipientApplied,
  )
  const activeAddressEdit = useAppSelector(selectActiveAddressEdit)
  const editingTemplateId = envelopeFacade.recipientTemplateId
  const cardTemplateId =
    activeAddressEdit?.role === 'recipient'
      ? activeAddressEdit.templateId
      : sandboxActive
        ? (sandboxRecipient.recipientViewId ??
          sandboxRecipientAppliedIds[0] ??
          null)
        : editingTemplateId

  const recipientEntries = useAppSelector(selectRecipientEntriesState)

  const dispatch = useAppDispatch()
  const isMobile = useAppSelector(selectIsMobileLayout)
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const {
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
  } = useMobileFactoryListChrome()
  const bothFormsApplied =
    assemblySenderSimplifiedPeek && assemblyRecipientSimplifiedPeek
  const sessionRecipientView = useAppSelector(selectRecipientView)
  const recipientView = sandboxActive
    ? sandboxRecipient.currentView
    : sessionRecipientView
  const recipientSlotToolbar = useEnvelopeAddressViewToolbarContent({
    enabled: true,
    variant: 'envelopeSlot',
  })
  const recipientViewEditMode = useAppSelector(selectRecipientViewEditMode)
  const addressCreateEditContext = useAppSelector(selectAddressCreateEditContext)
  const recipientsFormPreviewId = useAppSelector(selectRecipientsFormPreviewId)

  const recipientFieldsetRef = useRef<HTMLDivElement | null>(null)

  const recipientFieldsetContainerScrollRef = useRef<HTMLDivElement | null>(
    null,
  )
  const [recipientScrollContainerReady, setRecipientScrollContainerReady] =
    useState(false)
  const setRecipientFieldsetContainerScrollRef = useCallback(
    (el: HTMLDivElement | null) => {
      recipientFieldsetContainerScrollRef.current = el
      setRecipientScrollContainerReady(el != null)
    },
    [],
  )

  const hasRecipientAddressData = Object.values(value).some(
    (v) => (v ?? '').trim() !== '',
  )

  const recipientsDisplayList = recipientFacade.recipientsDisplayList
  const keepLowerRecipientsDuringCreate =
    !isMobile &&
    recipientView === 'recipientCreate' &&
    recipientsDisplayList.length >= 1
  const keepLowerRecipientCardDuringCreate =
    keepLowerRecipientsDuringCreate && recipientsDisplayList.length === 1

  const recipientIdForDisplay = keepLowerRecipientCardDuringCreate &&
    addressCreateEditContext?.role === 'recipient'
    ? addressCreateEditContext.templateId
    : sandboxActive
      ? (sandboxRecipient.recipientViewId ??
        sandboxRecipientAppliedIds[0] ??
        null)
      : (editingTemplateId ?? null)

  const recipientDisplayEntry = useMemo((): AddressBookEntry | null => {
    if (keepLowerRecipientCardDuringCreate) {
      return recipientsDisplayList[0] ?? null
    }
    if (recipientView !== 'recipientView') {
      return null
    }
    if (recipientIdForDisplay != null) {
      const fromBook = recipientEntries.find(
        (e) => e.id === recipientIdForDisplay,
      )
      if (fromBook) {
        if (Object.values(value).some((v) => (v ?? '').trim() !== '')) {
          return {
            ...fromBook,
            address: { ...value },
          }
        }
        return fromBook
      }
    }
    if (!Object.values(value).some((v) => (v ?? '').trim() !== '')) return null
    return {
      id: recipientIdForDisplay ?? 'sandbox-recipient-draft',
      role: 'recipient',
      address: { ...value },
      createdAt: new Date().toISOString(),
    }
  }, [
    recipientView,
    keepLowerRecipientCardDuringCreate,
    recipientsDisplayList,
    recipientIdForDisplay,
    recipientEntries,
    value,
  ])

  const showRecipientDetailCard = recipientDisplayEntry != null
  const recipientAddressForView = recipientDisplayEntry?.address ?? value

  const showRecipientsEnvelopeList =
    recipientsDisplayList.length > 1 &&
    (recipientView !== 'recipientCreate' || keepLowerRecipientsDuringCreate)

  useEffect(() => {
    if (recipientsFormPreviewId == null) return
    if (showRecipientsEnvelopeList) return
    dispatch(clearRecipientsFormPreviewId())
  }, [dispatch, recipientsFormPreviewId, showRecipientsEnvelopeList])

  const applyRecipientEntry = useCallback(
    (entry: AddressBookEntry) => {
      if (sandboxActive) {
        dispatch(setArchiveRecipientViewId(entry.id))
      } else {
        dispatch(setRecipientViewId(entry.id))
      }
      ;(
        Object.entries(entry.address) as [keyof typeof value, string][]
      ).forEach(([field, fieldValue]) => {
        update(field as any, fieldValue)
      })
    },
    [dispatch, update, sandboxActive],
  )

  useEffect(() => {
    if (recipientView === 'recipientCreate') return
    if (
      recipientView === 'recipientsView' &&
      recipientsDisplayList.length !== 1
    ) {
      return
    }

    const activeTemplateId = sandboxActive
      ? sandboxRecipient.recipientViewId
      : editingTemplateId

    if (recipientsDisplayList.length === 1) {
      const entry = recipientsDisplayList[0]
      if (
        recipientView === 'recipientView' &&
        activeTemplateId != null &&
        activeTemplateId !== entry.id &&
        hasRecipientAddressData
      ) {
        return
      }
      const needsHydrate =
        recipientView !== 'recipientView' ||
        activeTemplateId !== entry.id ||
        !hasRecipientAddressData
      if (needsHydrate) {
        applyRecipientEntry(entry)
        if (sandboxActive) {
          dispatch(setArchiveRecipientView('recipientView'))
        } else {
          dispatch(setRecipientView('recipientView'))
        }
      }
      return
    }

    if (
      recipientsDisplayList.length > 1 &&
      recipientView === 'recipientView' &&
      !recipientViewEditMode &&
      activeTemplateId == null &&
      !hasRecipientAddressData
    ) {
      if (sandboxActive) {
        dispatch(setArchiveRecipientView('recipientsView'))
        dispatch(setArchiveRecipientViewId(null))
      } else {
        dispatch(setRecipientView('recipientsView'))
        dispatch(setRecipientViewId(null))
      }
    }
  }, [
    recipientView,
    recipientsDisplayList,
    editingTemplateId,
    sandboxRecipient.recipientViewId,
    recipientViewEditMode,
    hasRecipientAddressData,
    dispatch,
    applyRecipientEntry,
    sandboxActive,
  ])

  const openAddressForm = () => {
    envelopeFacade.setAddressFormViewState(true, 'recipient')
    if (sandboxActive) {
      dispatch(setArchiveRecipientView('recipientCreate'))
    } else {
      dispatch(setRecipientView('recipientCreate'))
    }
  }

  const recipientsGridSelectedId =
    recipientView === 'recipientView'
      ? sandboxActive
        ? (sandboxRecipient.recipientViewId ?? null)
        : (editingTemplateId ?? null)
      : recipientView === 'recipientCreate' &&
          addressCreateEditContext?.role === 'recipient'
        ? (addressCreateEditContext.templateId ?? null)
        : null

  const handleOpenRecipientFromList = (entry: AddressBookEntry) => {
    if (recipientsGridSelectedId === entry.id) {
      if (sandboxActive) {
        dispatch(setArchiveRecipientViewId(null))
        dispatch(setArchiveRecipientView('recipientsView'))
        return
      }
      if (recipientView === 'recipientView') {
        dispatch(toolbarAction({ section: 'recipientView', key: 'close' }))
        return
      }
      if (recipientViewEditMode) {
        dispatch(
          closeAddressEditSession({
            role: 'recipient',
            keepRecipientView: true,
          }),
        )
      }
      dispatch(clearAddressCreateEditContext())
      dispatch(setAddressFormView({ show: false, role: null }))
      dispatch(setRecipientViewId(null))
      dispatch(setRecipientView('recipientsView'))
      return
    }
    if (recipientViewEditMode) {
      dispatch(
        closeAddressEditSession({
          role: 'recipient',
          keepRecipientView: true,
        }),
      )
    }
    applyRecipientEntry(entry)
    if (sandboxActive) {
      dispatch(setArchiveRecipientView('recipientView'))
    } else {
      dispatch(setRecipientView('recipientView'))
    }
  }

  const handlePlaceholderClick = () => {
    if (isMobile) {
      if (
        !bothFormsApplied &&
        mobileFocus != null &&
        mobileFocus.dualSide !== 'recipient'
      ) {
        mobileFocus.setDualSide('recipient')
      }
      return
    }
    if (recipientEntries.length > 0) {
      dispatch(
        toolbarAction({
          section: 'recipients',
          key: 'addressList',
        }),
      )
      return
    }
    openAddressForm()
  }

  const trySelectMobileAddressSide = useCallback(
    (el: HTMLElement) => {
      if (!isMobile || mobileFocus == null) return false
      if (bothFormsApplied) return false
      if (assemblyRecipientSimplifiedPeek) {
        return false
      }
      if (recipientView === 'recipientCreate') {
        return false
      }
      if (recipientViewEditMode) return false
      if (
        el.closest(
          'button, a, input, textarea, select, [role="button"], [data-envelope-address-close], [data-address-edit-row], [data-scrollarea-track], [data-address-book-entry]',
        )
      ) {
        return false
      }
      if (mobileFocus.dualSide !== 'recipient') {
        mobileFocus.setDualSide('recipient')
      }
      mobileFocus.clearFocus()
      return true
    },
    [
      isMobile,
      mobileFocus,
      bothFormsApplied,
      assemblyRecipientSimplifiedPeek,
      recipientView,
      recipientViewEditMode,
    ],
  )

  const openAddressListFromFieldset = useCallback(() => {
    dispatch(
      toolbarAction({
        section: 'recipients',
        key: 'addressList',
      }),
    )
  }, [dispatch])

  const handleRecipientFieldsetMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const fieldset = recipientFieldsetRef.current
      const el = e.target as HTMLElement | null
      if (!fieldset || !el || !fieldset.contains(el)) return

      if (isMobile) {
        if (trySelectMobileAddressSide(el)) {
          e.preventDefault()
          e.stopPropagation()
        }
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
      openAddressListFromFieldset()
    },
    [
      dispatch,
      isMobile,
      openAddressListFromFieldset,
      recipientViewEditMode,
      trySelectMobileAddressSide,
    ],
  )

  if (role !== 'recipient') return null

  return (
    <form
      className={clsx(styles.addressForm, styles[`addressForm${roleLabel}`])}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={styles.addressFormRecipientBody}>
        <div className={styles.addressFieldsetStack}>
          <div
            ref={recipientFieldsetRef}
            data-envelope-address-fieldset
            role="group"
            aria-label="Recipients"
            className={clsx(
              styles.addressFieldset,
              styles.addressFormRecipient,
              styles.recipientFieldsetContent,
              recipientSlotToolbar != null &&
                styles.recipientFieldsetWithSlotToolbar,
              showRecipientsEnvelopeList && styles.recipientFieldsetMulti,
              showRecipientsEnvelopeList && styles.recipientFieldsetWithList,
              recipientView === 'recipientCreate' &&
                embedCreateForm &&
                styles.addressFieldsetCreateOpen,
            )}
            onMouseDownCapture={handleRecipientFieldsetMouseDownCapture}
          >
            {recipientSlotToolbar != null ? (
              <div
                className={clsx(
                  addressFormStyles.addressFormTopBar,
                  addressFormStyles.addressFormTopBarSlot,
                  recipientsDisplayList.length > 1 &&
                    addressFormStyles.addressFormTopBarActionsEnd,
                )}
              >
                {recipientSlotToolbar}
              </div>
            ) : null}
            {showRecipientsEnvelopeList ? (
              <div
                ref={setRecipientFieldsetContainerScrollRef}
                className={styles.recipientFieldsetContainerScroll}
              />
            ) : null}
            <div className={styles.addressFieldsetInner}>
              {recipientView === 'recipientCreate' && embedCreateForm ? (
                <AddressFormView
                  key="recipientCreate"
                  role="recipient"
                  roleLabel={roleLabel}
                  address={recipientFacade.formDraft}
                  onFieldChange={update}
                  lang={lang}
                  mobileFullscreen={isMobile}
                />
              ) : showRecipientsEnvelopeList ? (
                <RecipientsView
                  entries={recipientsDisplayList}
                  onRemove={recipientFacade.removeFromList}
                  onOpenRecipient={handleOpenRecipientFromList}
                  selectedId={recipientsGridSelectedId}
                  scrollbarPortalTarget={
                    recipientScrollContainerReady
                      ? recipientFieldsetContainerScrollRef
                      : undefined
                  }
                />
              ) : showRecipientDetailCard ? (
                <RecipientView
                  templateId={
                    keepLowerRecipientCardDuringCreate
                      ? (recipientDisplayEntry?.id ?? '')
                      : (cardTemplateId ?? recipientDisplayEntry?.id ?? '')
                  }
                  address={recipientAddressForView}
                  viewOnly={keepLowerRecipientCardDuringCreate}
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
                  onClick={() => handlePlaceholderClick()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handlePlaceholderClick()
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
    </form>
  )
}
