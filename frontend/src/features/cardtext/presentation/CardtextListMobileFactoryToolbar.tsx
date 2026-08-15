import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import {
  selectCardtextListCentralTemplateTitle,
  selectCardtextTemplatesListItems,
  selectIsCardtextListPanelOpen,
} from '@cardtext/infrastructure/selectors'
import { withDisabledToolbarGroups } from '@toolbar/domain/helpers'
import { CARDTEXT_LIST_TOOLBAR } from '@toolbar/domain/types/cardtextList.types'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import toolbarStyles from '@features/toolbar/presentation/Toolbar.module.scss'
import type { IconKey, IconState } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './CardtextListMobileFactoryToolbar.module.scss'

function readApplyState(raw: unknown): IconState {
  if (raw == null) return 'disabled'
  if (typeof raw === 'string') return raw as IconState
  if (typeof raw === 'object' && raw !== null && 'state' in raw) {
    return String((raw as { state: unknown }).state) as IconState
  }
  return 'disabled'
}

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
  const templates = useAppSelector(selectCardtextTemplatesListItems)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileCardtextListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    isOpen &&
    activeSection === 'cardtext' &&
    showMobileCardtextListFactoryChrome

  const listEmpty = (templates?.length ?? 0) === 0

  const content = useMemo(() => {
    if (!enabled) return null
    return (
      <div
        className={styles.cardtextListToolbarRow}
        data-cardtext-list-toolbar
      >
        <Toolbar
          section="cardtextList"
          groupsOverride={
            listEmpty
              ? withDisabledToolbarGroups(CARDTEXT_LIST_TOOLBAR)
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
export const CardtextListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const templates = useAppSelector(selectCardtextTemplatesListItems)
  const listEmpty = (templates?.length ?? 0) === 0
  const centralTemplateTitle = useAppSelector(
    selectCardtextListCentralTemplateTitle,
  )
  const applyRaw = useAppSelector((s) => s.toolbar?.cardtext?.apply)
  const applyState = listEmpty ? 'disabled' : readApplyState(applyRaw)

  const applyToolbar = useMemo((): ToolbarConfig => {
    return [
      {
        group: 'cardtext',
        icons: [{ key: 'applyMedium', state: applyState }],
        status: listEmpty ? 'disabled' : 'enabled',
      },
    ]
  }, [applyState, listEmpty])

  const closeList = useCallback(() => {
    dispatch(setCardtextListPanelOpen(false))
  }, [dispatch])

  const handleApplyAction = useCallback(
    (key: IconKey) => {
      if (key !== 'applyMedium') return
      if (listEmpty) return false
      /**
       * Keep the list selection in View: close the list without postcard Apply.
       * Final Apply stays on the View toolbar (`apply`).
       * Must intercept — saga maps applyMedium → applyLight (processed upsert).
       */
      dispatch(setCardtextListPanelOpen(false))
      return false
    },
    [dispatch, listEmpty],
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
      <div className={styles.upperApply}>
        <Toolbar
          section="cardtext"
          groupsOverride={applyToolbar}
          className={toolbarStyles.toolbarAromaUpperApply}
          onActionClick={handleApplyAction}
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
