import { takeEvery, put, select, call } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { syncSectionMenuVisuals } from './sectionEditorMenuHandlers'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import { syncCardOrientationStatus } from './cardtextProcessSaga'
import type {
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
} from '@toolbar/domain/types'
import type { CardSection } from '@shared/config/constants'
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family'

export function* handleSectionEditorMenuToolbarAction(
  action: PayloadAction<{ section: string; key: SectionEditorMenuKey }>,
) {
  const { section, key } = action.payload

  if (section === 'sectionEditorMenu') {
    yield put(setActiveSection(key))

    yield call(syncSectionMenuVisuals, key)

    // if (key === 'cardtext') {
    //   yield call(syncCardtextToolbarVisuals)
    // }
  }
}

// export function* handleSectionEditorMenuToolbarAction2(
//   action: PayloadAction<{ section: string; key: SectionEditorMenuKey }>,
// ) {
//   const { section, key } = action.payload

//   if (section === 'sectionEditorMenu') {
//     console.log('editorMenu key', key)
//     yield put(setActiveSection(key as CardSection))

//     const currentState: SectionEditorMenuToolbarState = yield select(
//       selectToolbarSectionState('sectionEditorMenu'),
//     )

//     const updatedFlatKeys = Object.fromEntries(
//       Object.keys(currentState)
//         .filter((k) => k !== 'config')
//         .map((iconKey) => [iconKey, iconKey === key ? 'active' : 'enabled']),
//     )

//     const updatedConfig = currentState.config.map((group) => ({
//       ...group,
//       icons: group.icons.map((icon) => ({
//         ...icon,
//         state: icon.key === key ? 'active' : 'enabled',
//       })),
//     }))

//     const newState = {
//       ...updatedFlatKeys,
//       config: updatedConfig,
//     }

//     yield put(
//       updateToolbarSection({ section: 'sectionEditorMenu', value: newState }),
//     )
//   }
// }

// function* handleSectionEditorMenuToolbarAction1(
//   action: PayloadAction<{ section: string; key: SectionEditorMenuKey }>,
// ) {
//   const { section, key } = action.payload

//   if (section === 'sectionEditorMenu') {
//     yield put(setActiveSection(key as CardSection))

//     const currentState: SectionEditorMenuToolbarState = yield select(
//       selectToolbarSectionState('sectionEditorMenu'),
//     )

//     const updatedFlatKeys = Object.fromEntries(
//       Object.keys(currentState)
//         .filter((k) => k !== 'config')
//         .map((iconKey) => [iconKey, iconKey === key ? 'active' : 'enabled']),
//     )

//     const updatedConfig = currentState.config.map((group) => ({
//       ...group,
//       icons: group.icons.map((icon) => ({
//         ...icon,
//         state: icon.key === key ? 'active' : 'enabled',
//       })),
//     }))

//     const newState = {
//       ...updatedFlatKeys,
//       config: updatedConfig,
//     }

//     yield put(
//       updateToolbarSection({ section: 'sectionEditorMenu', value: newState }),
//     )
//   }
// }

export function* sectionEditorMenuSaga() {
  yield takeEvery(toolbarAction.type, handleSectionEditorMenuToolbarAction)
}
