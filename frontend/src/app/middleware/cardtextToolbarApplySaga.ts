import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setCardtextAppliedData,
  setStatus,
  setCardtextViewEditMode,
  loadCardtextTemplatesRequest,
  restoreCardtextSession,
} from '@cardtext/infrastructure/state'
import type { RootState } from '@app/state'
import {
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextPlainText,
  selectCardtextLines,
} from '@cardtext/infrastructure/selectors'
import { templateService } from '@entities/templates/domain/services/templateService'

/**
 * Apply: положить текущий текст на открытку (`appliedData`) и выставить статусы.
 * Сохранённый «processed» в БД при этом переводим в `outLine`.
 * Шаблоны inLine/outLine с открытки не переводим в processed — статус сохраняем.
 */
export function* applyCardtextFromToolbar(
  _action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { assetData } = yield select((s: RootState) => s.cardtext)
  if (assetData == null) return

  const value: ReturnType<typeof selectCardtextValue> =
    yield select(selectCardtextValue)
  const style: ReturnType<typeof selectCardtextStyle> =
    yield select(selectCardtextStyle)
  const plainText: string = yield select(selectCardtextPlainText)
  const cardtextLines: number = yield select(selectCardtextLines)

  if (assetData.status === 'processed') {
    let templateId: string | null = assetData.id
    if (templateId == null) {
      const fromDb =
        yield call([templateService, 'getSingleCardtextByStatus'], 'processed')
      templateId = fromDb?.id != null ? String(fromDb.id) : null
    }

    if (templateId != null) {
      const result: { success?: boolean } = yield call(
        [templateService, 'updateCardtextTemplate'],
        templateId,
        {
          value,
          style,
          plainText,
          cardtextLines,
          title: assetData.title ?? '',
          favorite: assetData.favorite ?? null,
          status: 'outLine',
        },
      )
      if (!result?.success) return
    }

    const next = {
      ...assetData,
      value,
      style,
      plainText,
      cardtextLines,
      status: 'outLine' as const,
      id: templateId ?? assetData.id,
    }
    yield put(setCardtextAppliedData(next))
    yield put(restoreCardtextSession(next))
    yield put(setCardtextViewEditMode(false))
    yield put(loadCardtextTemplatesRequest())
    return
  }

  const nextStatus =
    assetData.status === 'inLine' || assetData.status === 'outLine'
      ? assetData.status
      : ('processed' as const)

  const applied = {
    ...assetData,
    value,
    style,
    plainText,
    cardtextLines,
    status: nextStatus,
  }
  yield put(setCardtextAppliedData(applied))
  yield put(setStatus(nextStatus))
  yield put(setCardtextViewEditMode(false))
}
