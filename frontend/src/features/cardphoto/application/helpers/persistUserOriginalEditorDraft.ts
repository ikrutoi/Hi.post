import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import type { ImageRecord } from '@cardphoto/domain/types'
import {
  setUserOriginalData,
  setUserOriginalDraftConfig,
} from '@cardphoto/infrastructure/state'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import {
  prepareConfigForRedux,
  prepareForRedux,
} from '@app/middleware/cardphotoHelpers'
import { shouldSyncUserOriginalForState } from './syncUserOriginal'

/** Persist rotation on the IDB user upload (survives Close + page reload). */
export function* persistUserOriginalRotationToIdbSaga(
  rotation: number,
): SagaIterator<void> {
  const record: ImageRecord | null = yield call(
    [storeAdapters.userImages, 'getById'] as const,
    CURRENT_EDITOR_IMAGE_ID,
  )
  if (!record?.image) return

  yield call([storeAdapters.userImages, 'put'] as const, {
    ...record,
    image: {
      ...record.image,
      rotation,
    },
  })
}

/** Save editor draft (rotation/crop/position) before Close without apply. */
export function* persistUserOriginalEditorDraftSaga(): SagaIterator<void> {
  const state = yield select(selectCardphotoState)
  if (!state?.assetConfig || !shouldSyncUserOriginalForState(state)) return

  const rotation = state.assetConfig.image.rotation ?? 0
  const userOriginal = state.userOriginalData

  if (userOriginal) {
    yield put(
      setUserOriginalData(
        prepareForRedux({
          ...userOriginal,
          rotation,
        }),
      ),
    )
  }

  yield call(persistUserOriginalRotationToIdbSaga, rotation)
  yield put(
    setUserOriginalDraftConfig(prepareConfigForRedux(state.assetConfig)),
  )
}
