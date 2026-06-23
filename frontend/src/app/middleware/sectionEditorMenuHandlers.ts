import { select, put, call } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import { computeNotebookStripTabFromState } from '@date/calendar/infrastructure/selectors'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import type {
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
} from '@toolbar/domain/types'
import type { RightSidebarToolbarState } from '@toolbar/domain/types/rightSidebar.types'
import { RIGHT_SIDEBAR_KEYS } from '@toolbar/domain/types/rightSidebar.types'
import { syncCardPieToolbarActiveStateFromStore } from './cardPieToolbarSync'
import type { IconState } from '@shared/config/constants'

function* resolveCardPieMenuIconState(): Generator<
  unknown,
  IconState,
  unknown
> {
  yield call(syncCardPieToolbarActiveStateFromStore)
  const currentState: SectionEditorMenuToolbarState = yield select(
    selectToolbarSectionState('sectionEditorMenu'),
  )
  const raw = currentState.cardPie
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object' && 'state' in raw) {
    return (raw as { state: IconState }).state
  }
  return 'enabled'
}

export function* syncSectionMenuVisuals(activeKey: SectionEditorMenuKey) {
  const section = 'sectionEditorMenu'

  const currentState: SectionEditorMenuToolbarState = yield select(
    selectToolbarSectionState(section),
  )

  const cardPieState: IconState = yield call(resolveCardPieMenuIconState)

  const updatedFlatKeys = Object.fromEntries(
    Object.keys(currentState)
      .filter((k) => k !== 'config')
      .map((iconKey) => [
        iconKey,
        iconKey === 'cardPie'
          ? cardPieState
          : iconKey === activeKey
            ? 'active'
            : 'enabled',
      ]),
  )

  const updatedConfig = currentState.config.map((group) => ({
    ...group,
    icons: group.icons.map((icon) => ({
      ...icon,
      state:
        icon.key === 'cardPie'
          ? cardPieState
          : icon.key === activeKey
            ? 'active'
            : 'enabled',
    })),
  }))

  const newState = {
    ...updatedFlatKeys,
    config: updatedConfig,
  }

  yield put(updateToolbarSection({ section, value: newState }))
}

/** Все пункты меню секций без активной иконки (например, открыта корзина справа поверх «Дата»). */
export function* syncSectionMenuVisualsAllEnabled() {
  const section = 'sectionEditorMenu'

  const currentState: SectionEditorMenuToolbarState = yield select(
    selectToolbarSectionState(section),
  )

  const cardPieState: IconState = yield call(resolveCardPieMenuIconState)

  const updatedFlatKeys = Object.fromEntries(
    Object.keys(currentState)
      .filter((k) => k !== 'config')
      .map((iconKey) => [
        iconKey,
        iconKey === 'cardPie' ? cardPieState : 'enabled',
      ]),
  )

  const updatedConfig = currentState.config.map((group) => ({
    ...group,
    icons: group.icons.map((icon) => ({
      ...icon,
      state: icon.key === 'cardPie' ? cardPieState : 'enabled',
    })),
  }))

  yield put(
    updateToolbarSection({
      section,
      value: {
        ...updatedFlatKeys,
        config: updatedConfig,
      },
    }),
  )
}

/** Подсветка иконки history в правом сайдбаре при режиме полосы «История» (в т.ч. peek секций с правого CardPie). */
export function* syncRightSidebarHistoryHighlight(
  _activeSection: SectionEditorMenuKey,
) {
  const section = 'rightSidebar'
  const currentState: RightSidebarToolbarState = yield select(
    selectToolbarSectionState(section),
  )

  const state: RootState = yield select()
  const historyActive = computeNotebookStripTabFromState(state) === 'history'

  const updatedFlatKeys = Object.fromEntries(
    RIGHT_SIDEBAR_KEYS.map((iconKey) => {
      const prev = currentState[iconKey] as
        | { state: string; options?: Record<string, unknown> }
        | undefined
      const base = prev ?? { state: 'enabled', options: {} }
      if (iconKey === 'history') {
        return [
          iconKey,
          { ...base, state: historyActive ? 'active' : 'enabled' },
        ] as const
      }
      return [iconKey, base] as const
    }),
  )

  const updatedConfig = currentState.config.map((group) => ({
    ...group,
    icons: group.icons.map((icon) => ({
      ...icon,
      state:
        icon.key === 'history'
          ? historyActive
            ? 'active'
            : 'enabled'
          : icon.state,
    })),
  }))

  yield put(
    updateToolbarSection({
      section,
      value: {
        ...updatedFlatKeys,
        config: updatedConfig,
      },
    }),
  )
}
