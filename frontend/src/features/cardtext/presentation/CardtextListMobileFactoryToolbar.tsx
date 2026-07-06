import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import { selectIsCardtextListPanelOpen } from '@cardtext/infrastructure/selectors'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './CardtextListMobileFactoryToolbar.module.scss'

const CARDTEXT_LIST_FACTORY_UPPER_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'enabled' }],
    status: 'enabled',
  },
]

/** Mobile factory: нижний ряд — cardtextList toolbar в общем shell. */
export const CardtextListMobileFactoryLowerToolbar: React.FC = () => {
  const isOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const activeSection = useAppSelector(selectActiveSection)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileCardtextListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    isOpen &&
    activeSection === 'cardtext' &&
    showMobileCardtextListFactoryChrome

  const content = useMemo(
    () => (enabled ? <Toolbar section="cardtextList" /> : null),
    [enabled],
  )

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory: верхний ряд — return справа. */
export const CardtextListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()

  const closeList = useCallback(() => {
    dispatch(setCardtextListPanelOpen(false))
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
      <Toolbar
        section="cardtextCreate"
        groupsOverride={CARDTEXT_LIST_FACTORY_UPPER_TOOLBAR}
        onActionClick={handleAction}
      />
    </div>
  )
}
