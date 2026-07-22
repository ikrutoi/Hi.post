import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { closeAddressList } from '@envelope/infrastructure/state'
import {
  selectActiveRecipientsToolbarState,
  selectActiveSenderToolbarState,
  selectRecipientListPanelOpen,
  selectSenderListPanelOpen,
} from '@envelope/infrastructure/selectors'
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
  const { isMobileLayout } = useSizeFacade()
  const { showMobileAddressListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    (senderListOpen || recipientListOpen) &&
    activeSection === 'envelope' &&
    showMobileAddressListFactoryChrome

  const content = useMemo(() => {
    if (!enabled) return null
    if (senderListOpen) return <Toolbar section="addressListSender" />
    return <Toolbar section="addressListRecipients" />
  }, [enabled, senderListOpen])

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory: верхний ряд — apply слева, return справа. */
export const AddressListMobileFactoryUpperToolbar: React.FC = () => {
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
        icons: [{ key: 'apply', state: applyState }],
        status: 'enabled',
      },
    ]
  }, [applyState, senderListOpen])

  const closeList = useCallback(() => {
    dispatch(closeAddressList())
  }, [dispatch])

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key !== 'return') return
      closeList()
      return false
    },
    [closeList],
  )

  return (
    <div className={styles.upperRow}>
      <div className={styles.upperApply}>
        <Toolbar
          section={applySection}
          groupsOverride={applyToolbar}
          className={toolbarStyles.toolbarAromaUpperApply}
        />
      </div>
      <div className={styles.upperToolbar}>
        <Toolbar
          section={upperSection}
          groupsOverride={ADDRESS_LIST_FACTORY_UPPER_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
    </div>
  )
}
