import { takeEvery, put, select } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  markComplete,
  cancelSelection,
  reset,
  setActiveImage,
} from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import type {
  ToolbarState,
  CardphotoKey,
  CardphotoToolbarState,
} from '@toolbar/domain/types'
import type { ImageMeta } from '@cardphoto/domain/types'

function* handleDownloadClick(action: ReturnType<typeof toolbarAction>) {
  const { section, key } = action.payload
  console.log('handleDownload0', section, key)
  if (section === 'cardphoto' && key === 'download') {
    console.log('handleDownload1', section, key)
    const state: CardphotoToolbarState = yield select(
      selectToolbarSectionState('cardphoto')
    )
    yield put(
      updateToolbarSection({
        section: 'cardphoto',
        value: { ...state, download: 'disabled' },
      })
    )
  }
}

// function* handleActiveImageSet(action: PayloadAction<ImageMeta>) {
//   // картинка выбрана → обновляем activeImage
//   yield put(setActiveImage(action.payload))

//   // и возвращаем кнопку в enabled
//   const state: CardphotoToolbarState = yield select(
//     selectToolbarSectionState('cardphoto')
//   )
//   yield put(
//     updateToolbarSection({
//       section: 'cardphoto',
//       value: { ...state, download: 'enabled' },
//     })
//   )
// }

function* handleCardphotoToolbarAction(
  action: PayloadAction<{
    section: 'cardphoto'
    key: CardphotoKey
    payload?: any
  }>
) {
  const { section, key } = action.payload
  if (section === 'cardphoto') {
    switch (key) {
      case 'close':
        yield put(cancelSelection())
        break
      case 'save':
        yield put(reset())
        break
      case 'photoTemplates':
        console.log('Open photo templates')
        break
      // ❌ download здесь больше не трогаем
    }

    const currentState: CardphotoToolbarState = yield select(
      selectToolbarSectionState('cardphoto')
    )
    const newState: CardphotoToolbarState = { ...currentState }

    switch (key) {
      case 'close':
        newState[key] = 'active'
        break
      case 'save':
        newState[key] = 'active'
        break
      default:
        newState[key] = 'active'
        break
    }

    yield put(updateToolbarSection({ section: 'cardphoto', value: newState }))
  }
}

export function* cardphotoToolbarSagaLayer() {
  // yield takeEvery(toolbarAction.type, handleCardphotoToolbarAction)
  // yield takeEvery(toolbarAction.type, handleDownloadClick)
  // yield takeEvery(setActiveImage.type, handleActiveImageSet)
}
