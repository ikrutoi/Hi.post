import type { RootState } from '@app/state'
import type { AppDispatch } from '@app/state/store'
import type { SectionEditorMenuToolbarState } from '@toolbar/domain/types'
import {
  RIGHT_SIDEBAR_KEYS,
  type RightSidebarKey,
} from '@toolbar/domain/types/rightSidebar.types'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import {
  updateToolbarIcon,
  updateToolbarSection,
} from '@toolbar/infrastructure/state'

/** Снять active со всех пунктов sectionEditorMenu (режим корзины/истории поверх фабрики). */
export function dispatchSectionEditorMenuAllEnabled(
  dispatch: AppDispatch,
  getState: () => RootState,
): void {
  const section = 'sectionEditorMenu' as const
  const currentState = selectToolbarSectionState(section)(
    getState(),
  ) as SectionEditorMenuToolbarState

  const updatedFlatKeys = Object.fromEntries(
    Object.keys(currentState)
      .filter((k) => k !== 'config')
      .map((iconKey) => [iconKey, 'enabled']),
  )

  const updatedConfig = currentState.config.map((group) => ({
    ...group,
    icons: group.icons.map((icon) => ({
      ...icon,
      state: 'enabled' as const,
    })),
  }))

  dispatch(
    updateToolbarSection({
      section,
      value: {
        ...updatedFlatKeys,
        config: updatedConfig,
      },
    }),
  )
}

/** Подсветить cart или history в rightSidebar, остальные ключи — enabled. */
export function dispatchRightSidebarTabActive(
  dispatch: AppDispatch,
  activeKey: Extract<RightSidebarKey, 'cart' | 'history'>,
): void {
  for (const iconKey of RIGHT_SIDEBAR_KEYS) {
    dispatch(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: iconKey,
        value: iconKey === activeKey ? 'active' : 'enabled',
      }),
    )
  }
}

/** Правый режим списка корзины/истории: активная закладка справа, меню секций без active. */
export function applyRightListArchiveToolbarVisuals(
  dispatch: AppDispatch,
  getState: () => RootState,
  source: 'cart' | 'history',
): void {
  dispatchRightSidebarTabActive(dispatch, source)
  dispatchSectionEditorMenuAllEnabled(dispatch, getState)
}
