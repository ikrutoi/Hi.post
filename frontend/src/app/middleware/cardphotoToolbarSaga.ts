import { takeLatest, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import type { CardphotoToolbarState } from '@toolbar/domain/types'

function* handleCardphotoToolbarAction(
  action: ReturnType<typeof toolbarAction>
) {
  const { section, key } = action.payload

  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  if (section !== 'cardphoto') return

  switch (key) {
    case 'crop':
      yield put(
        updateToolbarIcon({
          section: 'cardphoto',
          key: 'crop',
          value: state.crop === 'enabled' ? 'active' : 'enabled',
        })
      )

      break
  }
}

export function* cardphotoToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleCardphotoToolbarAction)
}
