import { select, put } from 'redux-saga/effects'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import type {
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
} from '@toolbar/domain/types'

export function* syncSectionMenuVisuals(activeKey: SectionEditorMenuKey) {
  const section = 'sectionEditorMenu'

  const currentState: SectionEditorMenuToolbarState = yield select(
    selectToolbarSectionState(section),
  )

  const updatedFlatKeys = Object.fromEntries(
    Object.keys(currentState)
      .filter((k) => k !== 'config')
      .map((iconKey) => [
        iconKey,
        iconKey === activeKey ? 'active' : 'enabled',
      ]),
  )

  const updatedConfig = currentState.config.map((group) => ({
    ...group,
    icons: group.icons.map((icon) => ({
      ...icon,
      state: icon.key === activeKey ? 'active' : 'enabled',
    })),
  }))

  const newState = {
    ...updatedFlatKeys,
    config: updatedConfig,
  }

  yield put(updateToolbarSection({ section, value: newState }))
}
