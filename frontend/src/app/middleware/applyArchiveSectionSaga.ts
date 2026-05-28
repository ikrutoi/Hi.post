import type { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import type { PostcardHydrated } from '@entities/postcard'
import {
  applyArchiveSectionToEditorRequested,
  revertMirrorSectionCopyRequested,
} from '@cardPanel/infrastructure/state'
import { selectMirrorSectionBackup } from '@cardPanel/infrastructure/selectors/mirrorSectionBackupSelectors'
import {
  setMirrorSectionBackup,
  clearMirrorSectionBackup,
} from '@cardPanel/infrastructure/state/mirrorSectionBackup.slice'
import {
  captureMirrorSectionBackup,
  restoreMirrorSectionBackup,
} from './mirrorSectionBackup.helpers'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { buildCardPieInnerDataFromPostcard } from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { prepareForRedux } from '@app/middleware/cardphotoHelpers'
import { applyFinal, markLoaded } from '@cardphoto/infrastructure/state'
import { rebuildConfigFromMeta } from '@app/middleware/cardphotoProcessSaga'
import type { ImageMeta } from '@cardphoto/domain/types'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import {
  restoreCardtextSession,
  setCardtextAppliedData,
  setCardtextViewEditMode,
  setStatus as setCardtextStatus,
} from '@cardtext/infrastructure/state'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { restoreSender } from '@envelope/sender/infrastructure/state'
import {
  restoreRecipient,
} from '@envelope/recipient/infrastructure/state'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { syncEnvelopeFormsFromAppliedRequested } from '@envelope/infrastructure/state'
import { processEnvelopeVisuals } from './envelopeProcessSaga'
import { setAroma } from '@aroma/infrastructure/state'
import {
  setMultiDateMode,
  setSelectedDates,
} from '@date/infrastructure/state'
import { setSectionComplete } from '@entities/cardEditor/infrastructure/state'
import type { CardPanelSection } from '@cardPanel/domain/types'
import type { RootState } from '@app/state'

function* stashMirrorSectionBackupIfNeeded(section: CardPanelSection): SagaIterator {
  const existing = yield select((state: RootState) =>
    selectMirrorSectionBackup(state, section),
  )
  if (existing != null) return
  const backup = yield call(captureMirrorSectionBackup, section)
  yield put(setMirrorSectionBackup(backup))
}

function* handleApplyArchiveSection(
  action: PayloadAction<{
    section: CardPanelSection
    sourceLocalId: number
  }>,
): SagaIterator {
  const { section, sourceLocalId } = action.payload
  const items: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = items.find((p) => p.localId === sourceLocalId)
  if (!postcard) return

  yield call(stashMirrorSectionBackupIfNeeded, section)

  const card = postcard.card

  switch (section) {
    case 'cardphoto': {
      const meta = card.cardphoto?.appliedData ?? card.cardphoto?.assetData
      if (!meta) return
      const serializable = prepareForRedux(meta) as ImageMeta
      yield put(applyFinal(serializable))
      yield call(rebuildConfigFromMeta, serializable, false)
      yield put(markLoaded())
      {
        const complete: boolean = yield select(selectCardphotoIsComplete)
        yield put(setSectionComplete({ section: 'cardphoto', isComplete: complete }))
      }
      break
    }
    case 'cardtext': {
      const inner = buildCardPieInnerDataFromPostcard(postcard)
      const branch = inner.cardtext
      yield put(setCardtextAppliedData(branch))
      yield put(restoreCardtextSession(branch))
      yield put(setCardtextViewEditMode(false))
      if (branch.status != null) {
        yield put(setCardtextStatus(branch.status))
      }
      {
        const complete: boolean = yield select(selectCardtextIsComplete)
        yield put(setSectionComplete({ section: 'cardtext', isComplete: complete }))
      }
      break
    }
    case 'envelope': {
      yield put(restoreSender(card.envelope.sender))
      yield put(restoreRecipient(card.envelope.recipient))
      yield call(processEnvelopeVisuals)
      yield put(syncEnvelopeFormsFromAppliedRequested())
      {
        const ready: boolean = yield select(selectIsEnvelopeReady)
        yield put(setSectionComplete({ section: 'envelope', isComplete: ready }))
      }
      break
    }
    case 'aroma': {
      yield put(setAroma(card.aroma))
      break
    }
    case 'date': {
      const inner = buildCardPieInnerDataFromPostcard(postcard)
      const dates = inner.dates
      if (dates.length === 0) return
      yield put(setMultiDateMode(dates.length > 1))
      yield put(setSelectedDates(dates))
      break
    }
    default:
      break
  }
}

function* handleRevertMirrorSectionCopy(
  action: PayloadAction<{ section: CardPanelSection }>,
): SagaIterator {
  const { section } = action.payload
  const backup = yield select((state: RootState) =>
    selectMirrorSectionBackup(state, section),
  )
  if (backup == null) return
  yield call(restoreMirrorSectionBackup, backup)
  yield put(clearMirrorSectionBackup(section))
}

export function* watchApplyArchiveSection(): SagaIterator {
  yield takeLatest(
    applyArchiveSectionToEditorRequested.type,
    handleApplyArchiveSection,
  )
  yield takeLatest(
    revertMirrorSectionCopyRequested.type,
    handleRevertMirrorSectionCopy,
  )
}
