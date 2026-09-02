import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { closeAddressList, clearAddressListPreviewSnapshot } from '@envelope/infrastructure/state'
import {
  selectActiveRecipientsToolbarState,
  selectActiveSenderToolbarState,
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
import { listStatusIsInQuickAddressBook } from '@envelope/domain/helpers'
import { selectSenderEntriesState } from '@envelope/sender/infrastructure/selectors'
import { selectRecipientEntriesState } from '@envelope/recipient/infrastructure/selectors'
import { withDisabledToolbarGroups } from '@toolbar/domain/helpers'
import {
  ADDRESS_LIST_RECIPIENTS_TOOLBAR,
  ADDRESS_LIST_SENDER_TOOLBAR,
} from '@toolbar/domain/types/addressList.types'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconKey, IconState } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './AddressListMobileFactoryToolbar.module.scss'

function readApplyState(raw: unknown): IconState {
  if (raw == null) return 'disabled'
  if (typeof raw === 'string') return raw as IconState
  if (typeof raw === 'object' && raw !== null && 'state' in raw) {
    return String((raw as { state: unknown }).state) as IconState
  }
  return 'disabled'
}

const ADDRESS_LIST_FACTORY_UPPER_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'enabled' }],
    status: 'enabled',
  },
]

/** Mobile factory: нижний ряд — addressListSender / addressListRecipients toolbar. */
export const AddressListMobileFactoryLowerToolbar: React.FC = () => {
  const senderListOpen = useAppSelector(selectSenderListPanelOpen)
  const recipientListOpen = useAppSelector(selectRecipientListPanelOpen)
  const activeSection = useAppSelector(selectActiveSection)
  const senderEntries = useAppSelector(selectSenderEntriesState)
  const recipientEntries = useAppSelector(selectRecipientEntriesState)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileAddressListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    (senderListOpen || recipientListOpen) &&
    activeSection === 'envelope' &&
    showMobileAddressListFactoryChrome

  const listEmpty = useMemo(() => {
    const entries = senderListOpen ? senderEntries : recipientEntries
    return !entries.some((e) => listStatusIsInQuickAddressBook(e.listStatus))
  }, [recipientEntries, senderEntries, senderListOpen])

  const content = useMemo(() => {
    if (!enabled) return null
    const role = senderListOpen ? 'sender' : 'recipient'
    const baseToolbar = senderListOpen
      ? ADDRESS_LIST_SENDER_TOOLBAR
      : ADDRESS_LIST_RECIPIENTS_TOOLBAR
    return (
      <div
        className={clsx(
          styles.addressListToolbarRow,
          role === 'sender'
            ? styles.addressListToolbarRowSender
            : styles.addressListToolbarRowRecipient,
        )}
        data-address-list-toolbar-role={role}
      >
        <Toolbar
          section={
            senderListOpen ? 'addressListSender' : 'addressListRecipients'
          }
          groupsOverride={
            listEmpty ? withDisabledToolbarGroups(baseToolbar) : undefined
          }
        />
      </div>
    )
  }, [enabled, listEmpty, senderListOpen])

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory / desktop list header — applyMedium слева, return справа. */
export const AddressListMobileFactoryUpperToolbar: React.FC<{
  placement?: 'factory' | 'listHeader'
}> = ({ placement = 'factory' }) => {
  const dispatch = useAppDispatch()
  const senderListOpen = useAppSelector(selectSenderListPanelOpen)
  const senderToolbar = useAppSelector(selectActiveSenderToolbarState)
  const recipientsToolbar = useAppSelector(selectActiveRecipientsToolbarState)
  const applySection = senderListOpen ? 'sender' : 'recipients'
  const applyState = readApplyState(
    senderListOpen ? senderToolbar.apply : recipientsToolbar.apply,
  )
  const upperSection = senderListOpen ? 'senderView' : 'recipientView'

  const applyToolbar = useMemo((): ToolbarConfig => {
    return [
      {
        group: senderListOpen ? 'address' : 'recipients',
        icons: [{ key: 'applyMedium', state: applyState }],
        status: 'enabled',
      },
    ]
  }, [applyState, senderListOpen])

  const closeList = useCallback(() => {
    dispatch(closeAddressList())
  }, [dispatch])

  const handleApplyAction = useCallback(
    (key: IconKey) => {
      if (key !== 'applyMedium') return
      /**
       * Keep the list selection in View: drop preview snapshot so Close
       * does not restore the pre-list address, then close the list.
       * Does not Apply the address onto the postcard.
       */
      dispatch(clearAddressListPreviewSnapshot())
      dispatch(closeAddressList())
      return false
    },
    [dispatch],
  )

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key !== 'return') return
      closeList()
      return false
    },
    [closeList],
  )

  return (
    <div
      className={clsx(
        styles.upperRow,
        placement === 'listHeader' && styles.upperRowListHeader,
        placement !== 'listHeader' &&
          (senderListOpen ? styles.upperRowSender : styles.upperRowRecipient),
      )}
      data-address-list-toolbar-role={senderListOpen ? 'sender' : 'recipient'}
    >
      <div className={styles.upperApply}>
        <Toolbar
          section={applySection}
          groupsOverride={applyToolbar}
          className={toolbarStyles.toolbarAromaUpperApply}
          onActionClick={handleApplyAction}
        />
      </div>
      <div className={styles.upperToolbar}>
        <Toolbar
          section={upperSection}
          groupsOverride={ADDRESS_LIST_FACTORY_UPPER_TOOLBAR}
          className={toolbarStyles.toolbarAromaUpperReturn}
          onActionClick={handleAction}
        />
      </div>
    </div>
  )
}
