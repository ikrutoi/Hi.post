import type { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import type { PostcardHydrated } from '@entities/postcard'
import {
  applyArchiveSectionToEditorRequested,
  revertMirrorSectionCopyRequested,
  applyAllMirrorSectionsCopyRequested,
  revertAllMirrorSectionsCopyRequested,
} from '@cardPanel/infrastructure/state'
import {
  selectMirrorSectionBackup,
  selectMirrorSectionBackupSections,
} from '@cardPanel/infrastructure/selectors/mirrorSectionBackupSelectors'
import {
  setMirrorSectionBackup,
  clearMirrorSectionBackup,
} from '@cardPanel/infrastructure/state/mirrorSectionBackup.slice'
import {
  captureMirrorSectionBackup,
  restoreMirrorSectionBackup,
} from './mirrorSectionBackup.helpers'
import { canApplyMirrorSection } from '@cardPanel/application/helpers/mirrorSectionEditorSync'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  buildCardPieInnerDataFromPostcard,
  buildPieSectionFlagsFromPostcard,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { prepareForRedux } from '@app/middleware/cardphotoHelpers'
import { applyFinal, clearApply, markLoaded } from '@cardphoto/infrastructure/state'
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
import { restoreRecipient } from '@envelope/recipient/infrastructure/state'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { syncEnvelopeFormsFromAppliedRequested } from '@envelope/infrastructure/state'
import { processEnvelopeVisuals } from './envelopeProcessSaga'
import { setAroma } from '@aroma/infrastructure/state'
import { setMultiDateMode, setSelectedDates } from '@date/infrastructure/state'
import { setSectionComplete } from '@entities/cardEditor/infrastructure/state'
import type { CardPanelSection } from '@cardPanel/domain/types'
import type { RootState } from '@app/state'

const MIRROR_COPY_SECTION_ORDER: CardPanelSection[] = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
]

function* stashMirrorSectionBackupIfNeeded(section: CardPanelSection): SagaIterator {
  const existing = yield select((state: RootState) =>
    selectMirrorSectionBackup(state, section),
  )
  if (existing != null) return
  const backup = yield call(captureMirrorSectionBackup, section)
  yield put(setMirrorSectionBackup(backup))
}

function* applyArchiveSectionFromPostcard(
  section: CardPanelSection,
  postcard: PostcardHydrated,
  options?: { clearCardtextApplied?: boolean; clearCardphotoApplied?: boolean },
): SagaIterator {
  const card = postcard.card

  switch (section) {
    case 'cardphoto': {
      const meta = card.cardphoto?.appliedData ?? card.cardphoto?.assetData
      if (!meta) return
      const serializable = prepareForRedux(meta) as ImageMeta
      yield put(applyFinal(serializable))
      yield call(rebuildConfigFromMeta, serializable, false)
      yield put(markLoaded())
      /**
       * Edit (cardPieEdit / postcardEdit): снять session-apply после гидратации —
       * центральный CardPie в edit смотрит isComplete и сектор пустеет.
       * На открытке корзины appliedData не трогаем.
       */
      if (options?.clearCardphotoApplied) {
        yield put(clearApply())
      }
      {
        const complete: boolean = yield select(selectCardphotoIsComplete)
        yield put(
          setSectionComplete({ section: 'cardphoto', isComplete: complete }),
        )
      }
      break
    }
    case 'cardtext': {
      const inner = buildCardPieInnerDataFromPostcard(postcard)
      const branch = inner.cardtext
      yield put(restoreCardtextSession(branch))
      yield put(setCardtextViewEditMode(false))
      /**
       * postcardEdit: снять apply только в session (редактор).
       * На открытке корзины/cartBlocked appliedData не трогаем —
       * у cart не бывает пустых секций; центральный CardPie остаётся полным.
       */
      yield put(
        setCardtextAppliedData(
          options?.clearCardtextApplied ? null : branch,
        ),
      )
      if (branch.status != null) {
        yield put(setCardtextStatus(branch.status))
      }
      {
        const complete: boolean = yield select(selectCardtextIsComplete)
        yield put(
          setSectionComplete({ section: 'cardtext', isComplete: complete }),
        )
      }
      break
    }
    case 'envelope': {
      const sender = card.envelope.sender
      /**
       * Cart/history envelope is complete ⇒ sender result is applied
       * (address or empty/disabled). Force appliedLocked so archive peek
       * shows postcardEdit, not the full sender toolbar.
       */
      yield put(
        restoreSender({
          ...sender,
          appliedLocked:
            Boolean(sender.appliedLocked) ||
            (sender.applied?.length ?? 0) > 0 ||
            Boolean(card.envelope.isComplete),
        }),
      )
      yield put(restoreRecipient(card.envelope.recipient))
      yield call(processEnvelopeVisuals)
      yield put(syncEnvelopeFormsFromAppliedRequested())
      {
        const ready: boolean = yield select(selectIsEnvelopeReady)
        yield put(
          setSectionComplete({ section: 'envelope', isComplete: ready }),
        )
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

function* handleApplyArchiveSection(
  action: PayloadAction<{
    section: CardPanelSection
    sourceLocalId: number
    clearCardtextApplied?: boolean
    clearCardphotoApplied?: boolean
  }>,
): SagaIterator {
  const {
    section,
    sourceLocalId,
    clearCardtextApplied,
    clearCardphotoApplied,
  } = action.payload
  const items: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = items.find((p) => p.localId === sourceLocalId)
  if (!postcard) return

  const mirrorInner = buildCardPieInnerDataFromPostcard(postcard)
  const mirrorSectionFlags = buildPieSectionFlagsFromPostcard(postcard)
  const canApply = canApplyMirrorSection(
    section,
    mirrorInner,
    mirrorSectionFlags,
    postcard.status,
  )
  /** postcardEdit: снять session-apply, даже если сектор на открытке уже «пустой» по флагам. */
  const allowClearCardtext =
    Boolean(clearCardtextApplied) &&
    section === 'cardtext' &&
    postcard.card.cardtext.appliedData != null
  const allowClearCardphoto =
    Boolean(clearCardphotoApplied) &&
    section === 'cardphoto' &&
    (postcard.card.cardphoto?.appliedData != null ||
      postcard.card.cardphoto?.assetData != null)
  if (!canApply && !allowClearCardtext && !allowClearCardphoto) {
    return
  }

  yield call(stashMirrorSectionBackupIfNeeded, section)
  yield call(applyArchiveSectionFromPostcard, section, postcard, {
    clearCardtextApplied,
    clearCardphotoApplied,
  })
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

function* handleApplyAllMirrorSectionsCopy(
  action: PayloadAction<{
    sourceLocalId: number
    clearCardphotoApplied?: boolean
  }>,
): SagaIterator {
  const { sourceLocalId, clearCardphotoApplied } = action.payload
  const items: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = items.find((p) => p.localId === sourceLocalId)
  if (!postcard) return

  const mirrorInner = buildCardPieInnerDataFromPostcard(postcard)
  const mirrorSectionFlags = buildPieSectionFlagsFromPostcard(postcard)

  for (const section of MIRROR_COPY_SECTION_ORDER) {
    if (
      !canApplyMirrorSection(
        section,
        mirrorInner,
        mirrorSectionFlags,
        postcard.status,
      )
    ) {
      continue
    }
    yield call(stashMirrorSectionBackupIfNeeded, section)
    yield call(applyArchiveSectionFromPostcard, section, postcard, {
      clearCardphotoApplied:
        Boolean(clearCardphotoApplied) && section === 'cardphoto',
    })
  }
}

function* handleRevertAllMirrorSectionsCopy(): SagaIterator {
  const backedSections: CardPanelSection[] = yield select(
    selectMirrorSectionBackupSections,
  )
  const sectionsToRevert = MIRROR_COPY_SECTION_ORDER.filter((section) =>
    backedSections.includes(section),
  )

  for (const section of sectionsToRevert) {
    const backup = yield select((state: RootState) =>
      selectMirrorSectionBackup(state, section),
    )
    if (backup == null) continue
    yield call(restoreMirrorSectionBackup, backup)
    yield put(clearMirrorSectionBackup(section))
  }
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
  yield takeLatest(
    applyAllMirrorSectionsCopyRequested.type,
    handleApplyAllMirrorSectionsCopy,
  )
  yield takeLatest(
    revertAllMirrorSectionsCopyRequested.type,
    handleRevertAllMirrorSectionsCopy,
  )
}
