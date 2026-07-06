import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCardphotoListPanelOpen } from '@cardphoto/infrastructure/state'
import { selectIsListPanelOpen, selectCardphotoViewTemplateInList } from '@cardphoto/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './CardphotoListMobileFactoryToolbar.module.scss'

const buildCardphotoListFactoryUpperToolbar = (
  viewTemplateInList: boolean,
): ToolbarConfig => [
  {
    group: 'crop',
    icons: [
      {
        key: viewTemplateInList ? 'applyMediumCheck' : 'applyMedium',
        state: 'enabled',
      },
    ],
    status: 'enabled',
  },
  {
    group: 'close',
    icons: [{ key: 'return', state: 'enabled' }],
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

/** Mobile factory: верхний ряд — applyMedium слева, return справа. */
export const CardphotoListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const viewTemplateInList = useAppSelector(selectCardphotoViewTemplateInList)
  const upperToolbar = useMemo(
    () => buildCardphotoListFactoryUpperToolbar(viewTemplateInList),
    [viewTemplateInList],
  )

  const closeList = useCallback(() => {
    dispatch(setCardphotoListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'listCardphoto',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const handleAction = useCallback(
    (key: IconKey) => {
      if (
        key !== 'applyMedium' &&
        key !== 'applyMediumCheck' &&
        key !== 'return'
      ) {
        return
      }
      closeList()
      return false
    },
    [closeList],
  )

  return (
    <div className={styles.upperRow}>
      <Toolbar
        section="cardphotoCreate"
        groupsOverride={upperToolbar}
        onActionClick={handleAction}
      />
    </div>
  )
}
