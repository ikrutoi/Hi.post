import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import {
  syncEnvelopeFormsFromAppliedRequested,
  setRecipientsPendingIds,
  setRecipientsList,
} from '@envelope/infrastructure/state'
import { selectRecipientsList } from '@envelope/infrastructure/selectors'
import {
  setSenderView,
  setSenderViewId,
  setSenderViewDraft,
} from '@envelope/sender/infrastructure/state'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import {
  setRecipientView,
  setRecipientViewId,
  setRecipientViewDraft,
  setRecipientsViewIds,
} from '@envelope/recipient/infrastructure/state'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import type { RecipientState, SenderState } from '@envelope/domain/types'

function hasAddressData(data: Record<string, string>): boolean {
  return Object.values(data).some((v) => (v ?? '').trim() !== '')
}

function* loadRecipientAddressForAppliedId(
  recipient: RecipientState,
  id: string,
): Generator<unknown, RecipientState['viewDraft'] | null, unknown> {
  if (
    recipient.appliedData != null &&
    hasAddressData(recipient.appliedData) &&
    (recipient.applied ?? []).includes(id)
  ) {
    return recipient.appliedData
  }

  const envelopeList: RecipientState[] =
    ((yield select(selectRecipientsList)) as RecipientState[]) ?? []
  const fromEnvelope = envelopeList.find((r) => r.recipientViewId === id)
  if (
    fromEnvelope?.viewDraft != null &&
    hasAddressData(fromEnvelope.viewDraft)
  ) {
    return fromEnvelope.viewDraft
  }

  const record = (yield call([recipientAdapter, 'getById'], id)) as {
    id: string
    address?: Record<string, string>
  } | null
  if (record?.address != null && hasAddressData(record.address)) {
    return record.address as RecipientState['viewDraft']
  }

  return null
}

function* ensureEnvelopeRecipientsListForApplied(appliedIds: string[]) {
  const envelopeList: RecipientState[] =
    ((yield select(selectRecipientsList)) as RecipientState[]) ?? []
  const byId = new Map(
    envelopeList
      .filter((r) => r.recipientViewId != null)
      .map((r) => [r.recipientViewId as string, r]),
  )
  const nextOrdered: RecipientState[] = []
  let changed = false

  for (const id of appliedIds) {
    let row = byId.get(id)
    if (!row) {
      const record = (yield call([recipientAdapter, 'getById'], id)) as {
        id: string
        address?: Record<string, string>
      } | null
      if (record?.address) {
        const address = record.address as RecipientState['viewDraft']
        row = {
          currentView: 'recipientView',
          formDraft: address,
          viewDraft: address,
          formIsComplete: Object.values(address).every(
            (v) => (v ?? '').trim() !== '',
          ),
          formIsEmpty: true,
          sortOptions: { sortedBy: 'name', direction: 'asc' },
          recipientsViewSortDirection: 'asc',
          recipientViewId: id,
          recipientsViewIdsFirstList: [],
          recipientsViewIdsSecondList: [],
          currentRecipientsList: 'first',
          applied: [id],
          appliedData: address,
        }
        changed = true
      }
    }
    if (row) nextOrdered.push(row)
  }

  const prevKey = envelopeList.map((r) => r.recipientViewId).join('\u0000')
  const nextKey = nextOrdered.map((r) => r.recipientViewId).join('\u0000')
  if (nextOrdered.length > 0 && (changed || prevKey !== nextKey)) {
    yield put(setRecipientsList(nextOrdered))
  }
}

/** Отправитель: только если есть applied на конверте. */
function* syncSenderFormFromApplied() {
  const sender: SenderState = yield select(selectSenderState)
  const appliedIds = (sender.applied ?? []).filter(
    (id): id is string => id != null && id !== '',
  )
  if (appliedIds.length === 0) return

  const id = appliedIds[0]
  let address: SenderState['viewDraft'] | null =
    sender.appliedData != null && hasAddressData(sender.appliedData)
      ? sender.appliedData
      : null

  if (!address) {
    const record = (yield call([senderAdapter, 'getById'], id)) as {
      id: string
      address?: Record<string, string>
    } | null
    if (record?.address != null && hasAddressData(record.address)) {
      address = record.address as SenderState['viewDraft']
    }
  }

  if (!address) return

  yield put(setSenderViewDraft(address))
  yield put(setSenderViewId(id))
  yield put(setSenderView('senderView'))
}

/** Получатели: только если есть applied на конверте. */
function* syncRecipientFormFromApplied() {
  const recipient: RecipientState = yield select(selectRecipientState)
  const appliedIds = (recipient.applied ?? []).filter(
    (id): id is string => id != null && id !== '',
  )
  if (appliedIds.length === 0) return

  yield call(ensureEnvelopeRecipientsListForApplied, appliedIds)
  yield put(setRecipientsViewIds(appliedIds))
  yield put(setRecipientsPendingIds(appliedIds))

  if (appliedIds.length === 1) {
    const id = appliedIds[0]
    const address: RecipientState['viewDraft'] | null = yield call(
      loadRecipientAddressForAppliedId,
      recipient,
      id,
    )
    if (address) {
      yield put(setRecipientViewDraft(address))
    }
    yield put(setRecipientViewId(id))
    yield put(setRecipientView('recipientView'))
    return
  }

  yield put(setRecipientViewId(null))
  yield put(setRecipientView('recipientsView'))
}

function* handleSyncEnvelopeFormsFromApplied() {
  yield all([
    call(syncSenderFormFromApplied),
    call(syncRecipientFormFromApplied),
  ])
}

export function* envelopeFormSyncSaga() {
  yield takeLatest(
    syncEnvelopeFormsFromAppliedRequested.type,
    handleSyncEnvelopeFormsFromApplied,
  )
}
