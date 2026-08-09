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
import { withDisabledToolbarGroups } from '@toolbar/domain/helpers'
import { CARDPHOTO_LIST_TOOLBAR } from '@toolbar/domain/types/cardphotoList.types'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconKey, IconState } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import type { RootState } from '@app/state'
import styles from './CardphotoListMobileFactoryToolbar.module.scss'

function readApplyState(raw: unknown): IconState {
  if (raw == null) return 'disabled'
  if (typeof raw === 'string') return raw as IconState
  if (typeof raw === 'object' && raw !== null && 'state' in raw) {
    return String((raw as { state: unknown }).state) as IconState
  }
  return 'disabled'
}

function selectCardphotoInlineTemplateCount(state: RootState): number {
  const raw = state.toolbar?.cardphoto?.listCardphoto
  if (raw == null || typeof raw === 'string') return 0
  const badge = (
    raw as { options?: { badge?: number | null } }
  ).options?.badge
  return typeof badge === 'number' && badge > 0 ? badge : 0
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
  const inlineTemplateCount = useAppSelector(selectCardphotoInlineTemplateCount)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileCardphotoListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    isOpen &&
    activeSection === 'cardphoto' &&
    showMobileCardphotoListFactoryChrome

  const listEmpty = inlineTemplateCount === 0

  const content = useMemo(() => {
    if (!enabled) return null
    return (
      <div
        className={styles.cardphotoListToolbarRow}
        data-cardphoto-list-toolbar
      >
        <Toolbar
          section="cardphotoList"
          groupsOverride={
            listEmpty
              ? withDisabledToolbarGroups(CARDPHOTO_LIST_TOOLBAR)
              : undefined
          }
        />
      </div>
    )
  }, [enabled, listEmpty])

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory: верхний ряд — applyMedium слева, заголовок, return справа. */
export const CardphotoListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const title = useAppSelector(selectCardphotoTitle)
  const assetId = useAppSelector(selectCardphotoAssetData)?.id
  const previewUrl = useAppSelector(selectCardphotoAssetDisplayPreviewUrl)
  const applyRaw = useAppSelector((s) => s.toolbar?.cardphoto?.apply)
  const applyState = readApplyState(applyRaw)
  const centralTemplateTitle =
    assetId && previewUrl ? title.trim() || null : null

  const applyToolbar = useMemo((): ToolbarConfig => {
    return [
      {
        group: 'cardphoto',
        icons: [{ key: 'applyMedium', state: applyState }],
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

  const handleApplyAction = useCallback(
    (key: IconKey) => {
      if (key !== 'applyMedium') return
      /**
       * Keep the list selection in View: close the list without postcard Apply.
       * Final Apply stays on the View toolbar (`apply`).
       * Must intercept — saga maps applyMedium → crop confirm.
       */
      closeList()
      return false
    },
    [closeList],
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
    <div className={styles.upperRow}>
      <Toolbar
        section="cardphoto"
        groupsOverride={applyToolbar}
        className={toolbarStyles.toolbarAromaUpperApply}
        onActionClick={handleApplyAction}
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
