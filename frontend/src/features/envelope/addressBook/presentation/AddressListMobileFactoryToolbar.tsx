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
  selectRecipientListPanelOpen,
} from '@envelope/infrastructure/selectors'
import { listStatusIsInQuickAddressBook } from '@envelope/domain/helpers'
import { selectRecipientEntriesState } from '@envelope/recipient/infrastructure/selectors'
import { withDisabledToolbarGroups } from '@toolbar/domain/helpers'
import { ADDRESS_LIST_RECIPIENTS_TOOLBAR } from '@toolbar/domain/types/addressList.types'
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

/** Mobile factory: нижний ряд — addressListRecipients toolbar. */
export const AddressListMobileFactoryLowerToolbar: React.FC = () => {
  const recipientListOpen = useAppSelector(selectRecipientListPanelOpen)
  const activeSection = useAppSelector(selectActiveSection)
  const recipientEntries = useAppSelector(selectRecipientEntriesState)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileAddressListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    recipientListOpen &&
    activeSection === 'envelope' &&
    showMobileAddressListFactoryChrome

  const listEmpty = useMemo(() => {
    return !recipientEntries.some((e) =>
      listStatusIsInQuickAddressBook(e.listStatus),
    )
  }, [recipientEntries])

  const content = useMemo(() => {
    if (!enabled) return null
    return (
      <div
        className={clsx(
          styles.addressListToolbarRow,
          styles.addressListToolbarRowRecipient,
        )}
        data-address-list-toolbar-role="recipient"
      >
        <Toolbar
          section="addressListRecipients"
          groupsOverride={
            listEmpty
              ? withDisabledToolbarGroups(ADDRESS_LIST_RECIPIENTS_TOOLBAR)
              : undefined
          }
        />
      </div>
    )
  }, [enabled, listEmpty])

  useMobileScenarioToolbar(content)

  return null
}

const ADDRESS_LIST_FACTORY_UPPER_CLOSE_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'close', state: 'enabled' }],
    status: 'enabled',
  },
]

/** Mobile factory / desktop list header — applyMedium слева. */
export const AddressListMobileFactoryUpperToolbar: React.FC<{
  placement?: 'factory' | 'listHeader'
}> = ({ placement = 'factory' }) => {
  const dispatch = useAppDispatch()
  const { isMobileLayout } = useSizeFacade()
  const showReturn =
    placement === 'listHeader' || (isMobileLayout && placement === 'factory')
  const showApply = placement !== 'listHeader'
  const recipientsToolbar = useAppSelector(selectActiveRecipientsToolbarState)
  const applyState = readApplyState(
    (recipientsToolbar as { apply?: unknown }).apply,
  )

  const applyToolbar = useMemo((): ToolbarConfig => {
    return [
      {
        group: 'recipients',
        icons: [{ key: 'applyMedium', state: applyState }],
        status: 'enabled',
      },
    ]
  }, [applyState])

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

  const handleCloseAction = useCallback(
    (key: IconKey) => {
      if (key !== 'close') return
      dispatch(closeAddressList())
      return false
    },
    [dispatch],
  )

  return (
    <div
      className={clsx(
        styles.upperRow,
        placement === 'listHeader' && styles.upperRowListHeader,
        styles.upperRowRecipient,
      )}
      data-address-list-toolbar-role="recipient"
    >
      <div className={styles.upperApply}>
        {showApply ? (
          <Toolbar
            section="recipients"
            groupsOverride={applyToolbar}
            className={toolbarStyles.toolbarAromaUpperApply}
            onActionClick={handleApplyAction}
          />
        ) : null}
      </div>
      {showReturn ? (
        <div className={styles.upperToolbar}>
          <Toolbar
            section="recipientView"
            groupsOverride={ADDRESS_LIST_FACTORY_UPPER_CLOSE_TOOLBAR}
            className={toolbarStyles.toolbarAromaUpperReturn}
            onActionClick={handleCloseAction}
          />
        </div>
      ) : null}
    </div>
  )
}
