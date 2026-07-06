import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCardphotoListPanelOpen } from '@cardphoto/infrastructure/state'
import { selectIsListPanelOpen } from '@cardphoto/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './CardphotoListMobileFactoryToolbar.module.scss'

const CARDPHOTO_LIST_FACTORY_UPPER_TOOLBAR: ToolbarConfig = [
  {
    group: 'crop',
    icons: [{ key: 'applyMedium', state: 'enabled' }],
    status: 'enabled',
  },
]

/** Mobile factory: нижний ряд — cardphotoList toolbar в общем shell. */
export const CardphotoListMobileFactoryLowerToolbar: React.FC = () => {
  const isOpen = useAppSelector(selectIsListPanelOpen)
  const activeSection = useAppSelector(selectActiveSection)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileCardphotoListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    isOpen &&
    activeSection === 'cardphoto' &&
    showMobileCardphotoListFactoryChrome

  const content = useMemo(
    () => (enabled ? <Toolbar section="cardphotoList" /> : null),
    [enabled],
  )

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory: верхний ряд — одна иконка applyMedium (закрыть список). */
export const CardphotoListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key !== 'applyMedium') return
      dispatch(setCardphotoListPanelOpen(false))
      dispatch(
        updateToolbarIcon({
          section: 'cardphoto',
          key: 'listCardphoto',
          value: 'enabled',
        }),
      )
      return false
    },
    [dispatch],
  )

  return (
    <div className={styles.upperRow}>
      <Toolbar
        section="cardphotoCreate"
        groupsOverride={CARDPHOTO_LIST_FACTORY_UPPER_TOOLBAR}
        onActionClick={handleAction}
      />
    </div>
  )
}
