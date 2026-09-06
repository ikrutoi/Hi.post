import React, { useMemo } from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import {
  resolveCardtextToolbarSection,
  shouldHideEmptyCreateToolbar,
} from '@cardtext/application/helpers'
import {
  selectCardtextAddTemplateOpen,
  selectCardtextAssetStatus,
  selectCardtextId,
  selectCardtextSource,
  selectCardtextState,
  selectCardtextTemplatesListItems,
  selectCardtextValue,
  selectCardtextViewInQuickList,
} from '@cardtext/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { CARDTEXT_VIEW_TOOLBAR } from '@toolbar/domain/types/cardtext.types'
import styles from './Cardtext.module.scss'

type UseCardtextViewToolbarContentOptions = {
  enabled: boolean
}

export function useCardtextViewToolbarContent({
  enabled,
}: UseCardtextViewToolbarContentOptions): React.ReactNode {
  const cardtextState = useAppSelector(selectCardtextState)
  const currentView = useAppSelector(selectCardtextSource)
  const currentTemplateId = useAppSelector(selectCardtextId)
  const value = useAppSelector(selectCardtextValue)
  const isAddTemplateOpen = useAppSelector(selectCardtextAddTemplateOpen)
  const cardtextAssetStatus = useAppSelector(selectCardtextAssetStatus)
  const cardtextTemplates = useAppSelector(selectCardtextTemplatesListItems)
  const cardtextViewInQuickList = useAppSelector(selectCardtextViewInQuickList)
  const viewToolbarState = useAppSelector(
    selectToolbarSectionState('cardtextView'),
  )
  const { assemblyCardtextSimplifiedPeek } = useMobileFactoryListChrome()

  const toolbarSection = resolveCardtextToolbarSection({
    cardtextAssetStatus,
    currentView,
    currentTemplateId,
    isCardtextViewEditMode: cardtextState.isCardtextViewEditMode,
  })

  const hideEmptyCreateToolbar = shouldHideEmptyCreateToolbar({
    currentView,
    currentTemplateId,
    value,
    isAddTemplateOpen,
    cardtext: {
      assetData: cardtextState.assetData,
      isDraftEngaged: cardtextState.isDraftEngaged,
    },
  })

  const factorySessionActive =
    cardtextState.assetData != null || cardtextState.isDraftEngaged === true

  const showToolbarControls =
    factorySessionActive &&
    !hideEmptyCreateToolbar &&
    !assemblyCardtextSimplifiedPeek

  const groupsOverride = useMemo(() => {
    if (toolbarSection === 'cardtextView' && !cardtextViewInQuickList) {
      return CARDTEXT_VIEW_TOOLBAR.map((group) =>
        group.group === 'close'
          ? {
              ...group,
              icons: [{ key: 'delete' as const, state: 'enabled' as const }],
            }
          : group,
      )
    }
    return undefined
  }, [cardtextViewInQuickList, toolbarSection])

  const stateOverride = useMemo(() => {
    if (
      toolbarSection === 'cardtextView' &&
      !cardtextViewInQuickList &&
      viewToolbarState?.close
    ) {
      return { delete: viewToolbarState.close }
    }
    return undefined
  }, [cardtextViewInQuickList, toolbarSection, viewToolbarState])

  const show =
    enabled &&
    showToolbarControls &&
    toolbarSection === 'cardtextView'

  if (!show) return null

  return (
    <div className={styles.cardtextViewToolbarRow}>
      <Toolbar
        section="cardtextView"
        groupsOverride={groupsOverride}
        stateOverride={stateOverride}
      />
    </div>
  )
}
