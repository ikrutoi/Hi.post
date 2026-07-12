import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import {
  selectCardtextListCentralTemplateTitle,
  selectIsCardtextListPanelOpen,
} from '@cardtext/infrastructure/selectors'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './CardtextListMobileFactoryToolbar.module.scss'

const CARDTEXT_LIST_FACTORY_UPPER_APPLY_TOOLBAR: ToolbarConfig = [
  {
    group: 'cardtext',
    icons: [{ key: 'apply', state: 'disabled' }],
    status: 'enabled',
  },
]

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

/** Mobile factory: верхний ряд — apply слева, заголовок, return справа. */
export const CardtextListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const centralTemplateTitle = useAppSelector(selectCardtextListCentralTemplateTitle)

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
      <div className={styles.upperApply}>
        <Toolbar
          section="cardtext"
          groupsOverride={CARDTEXT_LIST_FACTORY_UPPER_APPLY_TOOLBAR}
          className={toolbarStyles.toolbarAromaUpperApply}
        />
      </div>
      {centralTemplateTitle ? (
        <div className={styles.upperTitle} title={centralTemplateTitle}>
          {centralTemplateTitle}
        </div>
      ) : null}
      <div className={styles.upperToolbar}>
        <Toolbar
          section="cardtextCreate"
          groupsOverride={CARDTEXT_LIST_FACTORY_UPPER_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
    </div>
  )
}
