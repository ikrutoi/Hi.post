import React, { useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { Mark } from '@envelope/view/presentation'
import { getSafeLang } from '@i18n/helpers'
import { i18n } from '@i18n/i18n'
import { EnvelopeAddress } from '../addressForm/presentation'
import { AddressFormView } from '../addressForm/presentation/AddressFormView'
import { RecipientView } from '../addressForm/presentation/AddressView'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import {
  ENVELOPE_MOBILE_ADDRESS_VIEW_TOOLBAR,
  ENVELOPE_MOBILE_ADDRESS_VIEW_DELETE_TOOLBAR,
} from '@toolbar/domain/types/addressView.types'
import addressFormStyles from '../addressForm/presentation/AddressFormView.module.scss'
import { EnvelopePeekAddressBlock } from './EnvelopePeekAddressBlock'
import { useRecipientFacade } from '../recipient/application/facades'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { NotebookPeekShell } from '@date/presentation/NotebookPeekShell'
import { useSectionEditorNotebookTabsOuter } from '@features/cardSectionEditor/presentation/SectionEditorNotebookTabsOuterContext'
import { EnvelopeMobileAddressViewToolbar } from './EnvelopeMobileAddressViewToolbar'
import { EnvelopeMobileAddressForm } from './EnvelopeMobileAddressForm'
import { useEnvelopeMobileAddressFocus } from './EnvelopeMobileAddressFocusContext'
import { useArchiveEditPeekGate } from '@cardPanel/application/hooks/useArchiveEditPeekGate'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import {
  selectSenderView,
  selectIsSenderEnabled,
} from '../sender/infrastructure/selectors'
import { setEnabled, setSenderApplied, setSenderView } from '../sender/infrastructure/state'
import { selectRecipientView, selectRecipientAddressFormData, selectRecipientEntriesState } from '../recipient/infrastructure/selectors'
import {
  selectArchiveEnvelopeSandboxActive,
  selectArchiveSandboxSender,
  selectArchiveSandboxRecipient,
} from '@cardPanel/infrastructure/selectors/archiveEnvelopeSandboxSelectors'
import {
  setArchiveSenderApplied,
  setArchiveSenderEnabled,
  setArchiveSenderView,
} from '@cardPanel/infrastructure/state'
import {
  isAddressDraftComplete,
  isAddressDraftEmpty,
  listStatusIsInQuickAddressBook,
} from '@envelope/domain/helpers'
import type { AddressFields } from '@shared/config/constants'
import styles from './Envelope.module.scss'

type EnvelopeProps = {
  cardPuzzleRef: React.RefObject<HTMLDivElement | null>
}

export const Envelope: React.FC<EnvelopeProps> = ({ cardPuzzleRef }) => {
  return <EnvelopeBody cardPuzzleRef={cardPuzzleRef} />
}

const EnvelopeBody: React.FC<EnvelopeProps> = ({ cardPuzzleRef: _cardPuzzleRef }) => {
  const dispatch = useAppDispatch()
  const notebookTabsOuter = useSectionEditorNotebookTabsOuter()
  const lang = getSafeLang(i18n.language)
  const recipientFacade = useRecipientFacade()
  const isMobile = useAppSelector(selectIsMobileLayout)
  const sandboxActive = useAppSelector(selectArchiveEnvelopeSandboxActive)
  const sandboxSender = useAppSelector(selectArchiveSandboxSender)
  const sandboxRecipient = useAppSelector(selectArchiveSandboxRecipient)
  const sessionSenderView = useAppSelector(selectSenderView)
  const sessionRecipientView = useAppSelector(selectRecipientView)
  const sessionSenderEnabled = useAppSelector(selectIsSenderEnabled)
  const sessionSenderAppliedLocked = useAppSelector(
    (s) => s.sender.appliedLocked === true,
  )
  const senderView = sandboxActive
    ? sandboxSender.currentView
    : sessionSenderView
  const recipientView = sandboxActive
    ? sandboxRecipient.currentView
    : sessionRecipientView
  const mobileFocus = useEnvelopeMobileAddressFocus()
  const mobileFocusRole = mobileFocus?.focusRole ?? null
  const {
    rightPieEnvelopePeekNoToolbar,
    listRowLocalId,
    listRowPostcardStatus,
  } = useRightListArchiveMini()
  const archiveEditPeekGate = useArchiveEditPeekGate('envelope')
  const {
    assemblySenderSimplifiedPeek,
    assemblyRecipientSimplifiedPeek,
    archiveCartEnvelopeSimplifiedPeek,
  } = useMobileFactoryListChrome()
  /**
   * Cart envelope: session apply-peek like left (not list-row peek UI).
   * Peek flag only hides cart list / keeps right chrome.
   */
  const envelopePeekMode =
    (rightPieEnvelopePeekNoToolbar && !archiveCartEnvelopeSimplifiedPeek) ||
    archiveEditPeekGate
  const showRecipientSimplified =
    !envelopePeekMode && assemblyRecipientSimplifiedPeek
  const bothFormsApplied =
    assemblySenderSimplifiedPeek && assemblyRecipientSimplifiedPeek

  const sessionRecipientViewDraft = useAppSelector(
    selectRecipientAddressFormData,
  )
  const recipientVisibleAddress = (
    sandboxActive ? sandboxRecipient.viewDraft : sessionRecipientViewDraft
  ) as AddressFields
  const hasIncompleteVisibleRecipient =
    !isAddressDraftEmpty(recipientVisibleAddress) &&
    !isAddressDraftComplete(recipientVisibleAddress)
  const addressAddSoloRole =
    isMobile &&
    !envelopePeekMode &&
    !bothFormsApplied &&
    hasIncompleteVisibleRecipient
      ? ('recipient' as const)
      : null

  const showMobileAddressFocus =
    isMobile &&
    addressAddSoloRole != null &&
    !envelopePeekMode
  const mobileAddressCreateRole: 'sender' | 'recipient' | null =
    isMobile && !envelopePeekMode
      ? recipientView === 'recipientCreate'
        ? 'recipient'
        : senderView === 'senderCreate'
          ? 'sender'
          : null
      : null
  const showMobileAddressCreateForm = mobileAddressCreateRole != null
  const showEnvelopeTopCreate =
    !isMobile &&
    !envelopePeekMode &&
    !showRecipientSimplified &&
    recipientView === 'recipientCreate'
  const showEnvelopeTopRecipientDetail =
    !isMobile &&
    !envelopePeekMode &&
    !showRecipientSimplified &&
    recipientView === 'recipientView' &&
    recipientFacade.recipientsDisplayList.length > 1
  const showEnvelopeTopSlotForm =
    showEnvelopeTopCreate || showEnvelopeTopRecipientDetail
  const recipientEntries = useAppSelector(selectRecipientEntriesState)
  const topSlotAddressViewToolbar = useMemo(() => {
    const id = recipientFacade.recipientTemplateId
    const entry = id != null ? recipientEntries.find((e) => e.id === id) : null
    const inQuickList =
      entry != null && listStatusIsInQuickAddressBook(entry.listStatus)
    return inQuickList
      ? ENVELOPE_MOBILE_ADDRESS_VIEW_TOOLBAR
      : ENVELOPE_MOBILE_ADDRESS_VIEW_DELETE_TOOLBAR
  }, [recipientEntries, recipientFacade.recipientTemplateId])

  useEffect(() => {
    if (!isMobile || envelopePeekMode) {
      mobileFocus?.clearFocus()
    }
  }, [
    isMobile,
    envelopePeekMode,
    mobileFocus,
  ])

  useEffect(() => {
    if (recipientView === 'recipientCreate') {
      mobileFocus?.clearFocus()
    }
  }, [recipientView, mobileFocus])

  const prevRecipientViewRef = useRef(recipientView)

  useEffect(() => {
    if (
      mobileFocusRole === 'recipient' &&
      prevRecipientViewRef.current === 'recipientView' &&
      recipientView !== 'recipientView'
    ) {
      mobileFocus?.clearFocus()
    }
    prevRecipientViewRef.current = recipientView
  }, [recipientView, mobileFocusRole, mobileFocus])

  useEffect(() => {
    if (mobileFocus == null) return
    if (mobileFocus.dualSide !== 'recipient') {
      mobileFocus.setDualSide('recipient')
    }
    if (mobileFocus.focusRole === 'sender') {
      mobileFocus.clearFocus()
    }
  }, [mobileFocus])

  /**
   * Sender form is removed: confirm “no sender” so envelope completion
   * still depends only on the recipient Apply.
   */
  useEffect(() => {
    if (envelopePeekMode) return
    const appliedLocked = sandboxActive
      ? sandboxSender.appliedLocked === true
      : sessionSenderAppliedLocked
    const enabled = sandboxActive
      ? sandboxSender.enabled === true
      : sessionSenderEnabled
    const view = sandboxActive ? sandboxSender.currentView : senderView
    if (view === 'senderCreate') {
      if (sandboxActive) dispatch(setArchiveSenderView('senderView'))
      else dispatch(setSenderView('senderView'))
    }
    if (enabled) {
      if (sandboxActive) dispatch(setArchiveSenderEnabled(false))
      else dispatch(setEnabled(false))
    }
    if (!appliedLocked) {
      if (sandboxActive) dispatch(setArchiveSenderApplied(true))
      else dispatch(setSenderApplied(true))
    }
  }, [
    dispatch,
    envelopePeekMode,
    sandboxActive,
    sandboxSender.appliedLocked,
    sandboxSender.enabled,
    sandboxSender.currentView,
    sessionSenderAppliedLocked,
    sessionSenderEnabled,
    senderView,
  ])

  const envelopeWorkZone = showMobileAddressCreateForm ? (
    <EnvelopeMobileAddressForm
      role={mobileAddressCreateRole ?? 'recipient'}
      lang={lang}
    />
  ) : (
    <div className={styles.envelopeWorkZone}>
      <div
        className={clsx(
          styles.envelopeTopSlot,
          showEnvelopeTopSlotForm && styles.envelopeTopSlotCreate,
        )}
      >
        {showEnvelopeTopCreate ? (
          <div className={styles.envelopeTopCreate}>
            <AddressFormView
              key="recipientCreate"
              role="recipient"
              roleLabel="Recipients"
              address={recipientFacade.formDraft}
              onFieldChange={recipientFacade.update}
              lang={lang}
            />
          </div>
        ) : showEnvelopeTopRecipientDetail ? (
          <div
            className={clsx(
              styles.envelopeTopCreate,
              styles.envelopeTopCreateDetail,
            )}
          >
            <div className={addressFormStyles.addressFormView}>
              <div className={addressFormStyles.addressFormTopBar}>
                <Toolbar
                  section="recipientView"
                  groupsOverride={topSlotAddressViewToolbar}
                />
              </div>
              <div className={addressFormStyles.addressFormDetailBody}>
                <RecipientView
                  templateId={recipientFacade.recipientTemplateId ?? ''}
                  address={recipientFacade.address as AddressFields}
                  viewOnly
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={styles.envelopeLogo}
              data-envelope-mobile-focus-chrome
            />
            <div
              className={styles.envelopeMark}
              data-envelope-mobile-focus-chrome
            >
              <Mark
                simplifiedPeek={envelopePeekMode}
                listArchivePostcardStatus={listRowPostcardStatus}
              />
            </div>
            <div
              className={clsx(
                styles.envelopeSection,
                styles.envelopeSectionSender,
              )}
              data-envelope-mobile-focus-sender
            >
              {envelopePeekMode ? (
                <EnvelopePeekAddressBlock
                  key={
                    listRowLocalId != null
                      ? `peek-env-sender-${listRowLocalId}`
                      : 'peek-env-sender'
                  }
                  role="sender"
                  compact={isMobile}
                  className={styles.envelopePeekBlock}
                />
              ) : null}
            </div>
          </>
        )}
      </div>
      <div
        className={styles.envelopeBottomSlot}
        data-envelope-mobile-focus-recipient
      >
        <div
          className={clsx(
            styles.envelopeSection,
            styles.envelopeSectionRecipient,
          )}
        >
          {envelopePeekMode ? (
            <EnvelopePeekAddressBlock
              key={
                listRowLocalId != null
                  ? `peek-env-recipient-${listRowLocalId}`
                  : 'peek-env-recipient'
              }
              role="recipient"
              compact={isMobile}
              className={styles.envelopePeekBlock}
            />
          ) : showRecipientSimplified ? (
            <EnvelopePeekAddressBlock
              key="peek-env-recipient-simplified"
              role="recipient"
              compact={isMobile}
              fromSessionApplied
              addressFallback={recipientFacade.address}
              className={styles.envelopePeekBlock}
            />
          ) : (
            <EnvelopeAddress
              role="recipient"
              roleLabel="Recipients"
              lang={lang}
              embedCreateForm={false}
            />
          )}
        </div>
      </div>

      <div
        className={styles.envelopeSenderToggle}
        data-envelope-mobile-focus-chrome
      >
        <div className={styles.envelopeFooterSpacer} aria-hidden />
      </div>

      <div
        className={styles.envelopeRecipientToggle}
        data-envelope-mobile-focus-chrome
      >
        <div className={styles.envelopeFooterSpacer} aria-hidden />
      </div>
    </div>
  )

  const showEnvelopeToolbar = !envelopePeekMode

  const body = (
    <div
      className={styles.envelope}
      data-envelope-mobile-form={
        showMobileAddressCreateForm ? 'true' : undefined
      }
      data-envelope-mobile-focus={
        showMobileAddressFocus ? addressAddSoloRole! : undefined
      }
    >
      <div className={styles.envelopeViewWrap}>
        <EnvelopeMobileAddressViewToolbar enabled={showEnvelopeToolbar} />
        <div className={styles.envelopeViewContent}>{envelopeWorkZone}</div>
      </div>
    </div>
  )

  return envelopePeekMode ? (
    notebookTabsOuter ? (
      body
    ) : (
      <NotebookPeekShell>{body}</NotebookPeekShell>
    )
  ) : (
    body
  )
}
