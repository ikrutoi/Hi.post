import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCardphotoListPanelOpen } from '@cardphoto/infrastructure/state'
import {
  selectIsListPanelOpen,
  selectCardphotoAssetData,
  selectCardphotoAssetDisplayPreviewUrl,
  selectCardphotoTitle,
} from '@cardphoto/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconKey, IconState } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './CardphotoListMobileFactoryToolbar.module.scss'

function readApplyState(raw: unknown): IconState {
  if (raw == null) return 'disabled'
  if (typeof raw === 'string') return raw as IconState
  if (typeof raw === 'object' && raw !== null && 'state' in raw) {
    return String((raw as { state: unknown }).state) as IconState
  }
  return 'disabled'
}

/** List chrome: no green Apply — enabled when Redux says the asset can be applied. */
function listChromeApplyState(raw: unknown): 'enabled' | 'disabled' {
  const state = readApplyState(raw)
  return state === 'disabled' ? 'disabled' : 'enabled'
}

const CARDPHOTO_LIST_FACTORY_UPPER_TOOLBAR: ToolbarConfig = [
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

/** Mobile factory: верхний ряд — apply слева, заголовок, return справа. */
export const CardphotoListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const title = useAppSelector(selectCardphotoTitle)
  const assetId = useAppSelector(selectCardphotoAssetData)?.id
  const previewUrl = useAppSelector(selectCardphotoAssetDisplayPreviewUrl)
  const applyRaw = useAppSelector((s) => s.toolbar?.cardphoto?.apply)
  const applyState = listChromeApplyState(applyRaw)
  const centralTemplateTitle =
    assetId && previewUrl ? title.trim() || null : null

  const applyToolbar = useMemo((): ToolbarConfig => {
    return [
      {
        group: 'cardphoto',
        icons: [{ key: 'apply', state: applyState }],
        status: 'enabled',
      },
    ]
  }, [applyState])

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
      if (key !== 'return') return
      closeList()
      return false
    },
    [closeList],
  )

  return (
    <div className={styles.upperRow}>
      <Toolbar
        section="cardphoto"
        groupsOverride={applyToolbar}
        className={toolbarStyles.toolbarAromaUpperApply}
      />
      {centralTemplateTitle ? (
        <div className={styles.upperTitle} title={centralTemplateTitle}>
          {centralTemplateTitle}
        </div>
      ) : null}
      <div className={styles.upperToolbar}>
        <Toolbar
          section="cardphotoCreate"
          groupsOverride={CARDPHOTO_LIST_FACTORY_UPPER_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
    </div>
  )
}
