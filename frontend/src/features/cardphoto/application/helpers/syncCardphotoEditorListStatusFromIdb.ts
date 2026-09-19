import { call, put, select } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { prepareForRedux } from '@app/middleware/cardphotoHelpers'
import {
  bumpCardphotoInlineTemplateList,
  setProcessedImage,
} from '../../infrastructure/state'
import { selectCardphotoState } from '../../infrastructure/selectors'
import type { ImageMeta } from '../../domain/types'

/** After a v2 library pull, View star follows IndexedDB inLine/outLine. */
export function* syncCardphotoEditorListStatusFromIdbSaga(): SagaIterator {
  const state: ReturnType<typeof selectCardphotoState> =
    yield select(selectCardphotoState)
  const asset = state?.assetData
  if (!asset?.id) return

  const record: ImageMeta | null = yield call(
    [storeAdapters.cardphotoImages, 'getById'],
    asset.id,
  )
  if (!record) return
  if (record.status !== 'inLine' && record.status !== 'outLine') return
  if (asset.status === record.status) return

  yield put(
    setProcessedImage(prepareForRedux({ ...asset, status: record.status })),
  )
  yield put(bumpCardphotoInlineTemplateList())
}
