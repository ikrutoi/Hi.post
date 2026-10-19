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
import {
  canApplyMirrorSection,
  selectableMirrorDispatchDates,
} from '@cardPanel/application/helpers/mirrorSectionEditorSync'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import {
  buildCardPieInnerDataFromPostcard,
  buildPieSectionFlagsFromPostcard,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { prepareForRedux, hydrateSessionImageMeta } from '@app/middleware/cardphotoHelpers'
import { applyFinal, clearApply, markLoaded } from '@cardphoto/infrastructure/state'
import { rebuildConfigFromMeta } from '@app/middleware/cardphotoProcessSaga'
import type { ImageMeta } from '@cardphoto/domain/types'
import { loadCardphotoImageMetaFromIdb } from '@cardphoto/application/helpers/loadCardphotoImageMetaFromIdb'
import { cardImageMetaLookupIdsFromCard } from '@entities/card/domain/helpers'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import {
  restoreCardtextSession,
  setCardtextAppliedData,
  setCardtextViewEditMode,
} from '@cardtext/infrastructure/state'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { cardtextValueForReadOnlyPreview } from '@cardtext/domain/editor/editor.types'
import { restoreRecipient } from '@envelope/recipient/infrastructure/state'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { syncEnvelopeFormsFromAppliedRequested } from '@envelope/infrastructure/state'
import { processEnvelopeVisuals } from './envelopeProcessSaga'
import {
  setAroma,
  setViewAroma,
  clearApplied as clearAromaApplied,
} from '@aroma/infrastructure/state'
import {
  clearDate,
  setMultiDateMode,
  setSelectedDates,
} from '@date/infrastructure/state'
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

function trimmedUrl(url: string | null | undefined): string | null {
  if (typeof url !== 'string') return null
  const trimmed = url.trim()
  return trimmed !== '' ? trimmed : null
}

function durableUrl(url: string | null | undefined): string | null {
  const trimmed = trimmedUrl(url)
  if (trimmed == null || trimmed.startsWith('blob:')) return null
  return trimmed
}

/** Мини-превью берёт сначала thumbnail. Мёртвый blob: там гасит живой url. */
function withDisplayUrl(meta: ImageMeta, url: string): ImageMeta {
  const thumb = durableUrl(meta.thumbnail?.url) ?? url
  return {
    ...meta,
    url,
    full: {
      ...meta.full,
      url,
      blob: undefined,
    },
    thumbnail: meta.thumbnail
      ? { ...meta.thumbnail, url: thumb, blob: undefined }
      : meta.thumbnail,
  }
}

function cardphotoMetaHasDisplayUrl(meta: ImageMeta | null | undefined): boolean {
  if (meta == null) return false
  return trimmedUrl(meta.url) != null || trimmedUrl(meta.thumbnail?.url) != null
}

/**
 * Адрес для applied фабрики. Реестр и кэш центрального пая не трогаем:
 * туда записан живой url открытки корзины, его подмена рвёт сектор пая.
 * Старый applied сборки остаётся в mirror-backup.
 */
function* resolveCopyCardphotoMeta(
  postcard: PostcardHydrated,
): SagaIterator<ImageMeta | null> {
  const persisted =
    postcard.card.cardphoto?.appliedData ??
    postcard.card.cardphoto?.assetData ??
    null
  const lookupIds = cardImageMetaLookupIdsFromCard(
    postcard.card,
    postcard.postcard,
  )
  const root: RootState = yield select((state: RootState) => state)

  let registryUrl: string | null = null
  for (const id of lookupIds) {
    const asset = root.assetRegistry.images[id]
    if (!asset) continue
    registryUrl =
      durableUrl(asset.url) ||
      trimmedUrl(asset.url) ||
      durableUrl(asset.thumbUrl) ||
      trimmedUrl(asset.thumbUrl)
    if (registryUrl) break
  }
  const cached = trimmedUrl(root.card.calendarPreviewCache[postcard.card.id])

  let fromIdb: ImageMeta | null = null
  for (const id of lookupIds) {
    const loaded: ImageMeta | null = yield call(
      loadCardphotoImageMetaFromIdb,
      id,
    )
    if (loaded) {
      fromIdb = loaded
      break
    }
  }
  const merged = hydrateSessionImageMeta(persisted, fromIdb)
  const base = merged ?? persisted
  if (base == null) return null

  const durable =
    durableUrl(merged?.url) ||
    durableUrl(merged?.full?.url) ||
    durableUrl(merged?.thumbnail?.url) ||
    durableUrl(registryUrl) ||
    durableUrl(cached)
  if (durable) return withDisplayUrl(base, durable)

  const liveBlob =
    (registryUrl?.startsWith('blob:') ? registryUrl : null) ||
    (cached?.startsWith('blob:') ? cached : null)
  if (liveBlob) return withDisplayUrl(base, liveBlob)

  if (fromIdb != null && merged != null) {
    const fresh =
      trimmedUrl(merged.url) ||
      trimmedUrl(merged.full?.url) ||
      trimmedUrl(merged.thumbnail?.url)
    if (fresh) return withDisplayUrl(merged, fresh)
  }
  return null
}

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
  options?: {
    clearCardtextApplied?: boolean
    clearCardphotoApplied?: boolean
    clearAromaApplied?: boolean
  },
): SagaIterator {
  const card = postcard.card

  switch (section) {
    case 'cardphoto': {
      const meta: ImageMeta | null = yield call(
        resolveCopyCardphotoMeta,
        postcard,
      )
      if (!meta || !cardphotoMetaHasDisplayUrl(meta)) return
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
      const raw = inner.cardtext
      /**
       * Archive/mirror can store text in plainText / nested Slate while `value`
       * looks empty to factory selectors (shallow children only). Materialize
       * the same preview value peek/minis already use, so left pie + strip show
       * the copy.
       */
      const branch = {
        ...raw,
        value: cardtextValueForReadOnlyPreview(raw),
      }
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
      /**
       * Do not `setCardtextStatus` after restore: that reducer already wrote
       * `assetData.status`. A follow-up status action runs
       * `maybePersistCreateDraftOnExitView`, which can `restoreCardtextSession`
       * from `presetData` and wipe the copied cardtext.
       */
      {
        const complete: boolean = yield select(selectCardtextIsComplete)
        yield put(
          setSectionComplete({ section: 'cardtext', isComplete: complete }),
        )
      }
      break
    }
    case 'envelope': {
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
      /**
       * postcardEdit: не пишем session-apply (сектор CardPie пустой до Apply),
       * но плитку открытки сразу выделяем — Apply enabled.
       */
      if (options?.clearAromaApplied) {
        yield put(clearAromaApplied())
        if (card.aroma != null) {
          yield put(setViewAroma(card.aroma))
        }
      } else {
        yield put(setAroma(card.aroma))
      }
      break
    }
    case 'date': {
      /**
       * `cartdate`: дата открытки живёт в cartDatePickDraft / postcard —
       * не писать в assembly selectedDates (иначе смешивается со сборкой).
       */
      const notebookStripTab: ReturnType<typeof selectNotebookStripTab> =
        yield select(selectNotebookStripTab)
      if (notebookStripTab === 'cartdate') {
        yield put(clearDate())
        break
      }
      const inner = buildCardPieInnerDataFromPostcard(postcard)
      const dates = selectableMirrorDispatchDates(
        inner.dates,
        postcard.status,
      )
      /**
       * cartBlocked: нет доступных дат — сбросить черновик сборки, иначе
       * календарь откроется на месяце незаапрувленной даты из assembly.
       */
      if (dates.length === 0) {
        yield put(clearDate())
        break
      }
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
    clearAromaApplied?: boolean
  }>,
): SagaIterator {
  const {
    section,
    sourceLocalId,
    clearCardtextApplied,
    clearCardphotoApplied,
    clearAromaApplied,
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
  const allowClearAroma =
    Boolean(clearAromaApplied) &&
    section === 'aroma' &&
    postcard.card.aroma != null
  if (
    !canApply &&
    !allowClearCardtext &&
    !allowClearCardphoto &&
    !allowClearAroma
  ) {
    return
  }

  yield call(stashMirrorSectionBackupIfNeeded, section)
  yield call(applyArchiveSectionFromPostcard, section, postcard, {
    clearCardtextApplied,
    clearCardphotoApplied,
    clearAromaApplied,
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
