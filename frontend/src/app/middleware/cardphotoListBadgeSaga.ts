import { call, put } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { ImageMeta } from '@cardphoto/domain/types'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  beginCardphotoInlineBadgeRead,
  cardphotoListBadgeUpperBound,
  isCurrentCardphotoInlineBadgeRead,
  readCardphotoInlineTemplates,
} from '@cardphoto/application/helpers/cardphotoInlineTemplates'

/** Badge counts live inLine templates. A read started before the last unstar is dropped. */
export function* syncCardphotoListBadgeFromIdb(): SagaIterator {
  const generation = beginCardphotoInlineBadgeRead()
  const inline: ImageMeta[] = yield call(readCardphotoInlineTemplates)
  if (!isCurrentCardphotoInlineBadgeRead(generation)) return
  const cap = cardphotoListBadgeUpperBound()
  const count = cap == null ? inline.length : Math.min(inline.length, cap)
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'listCardphoto',
      value: { options: { badge: count > 0 ? count : null } },
    }),
  )
}
