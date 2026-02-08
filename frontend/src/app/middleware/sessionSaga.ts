import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { selectCardphotoSessionRecord } from '@cardphoto/infrastructure/selectors'
import {
  addOperation,
  hydrateEditor,
  initCardphoto,
  setActiveSource,
  setOrientation,
  restoreSession,
  applyFinal,
  addCropId,
} from '@cardphoto/infrastructure/state'
import {
  updateRecipientField,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { setSizeCard } from '@layout/infrastructure/state'
import { restoreRecipient } from '@envelope/recipient/infrastructure/state'
import { restoreSender } from '@envelope/sender/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { syncCardtextToolbarVisuals } from './cardtextHandlers'
import { syncSectionMenuVisuals } from './sectionEditorMenuHandlers'
import { syncCardOrientationStatus } from './cardtextProcessSaga'
import { selectCardtextSessionRecord } from '@cardtext/infrastructure/selectors'
import { setTextStyle } from '@cardtext/infrastructure/state'
import {
  selectEnvelopeSessionRecord,
  selectIsEnvelopeReady,
} from '@envelope/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { prepareForRedux, hydrateMeta } from './cardphotoHelpers'
import { processEnvelopeVisuals } from './envelopeProcessSaga'
import { restoreEditorSession } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectAromaState } from '@aroma/infrastructure/selectors'
import { setAroma } from '@aroma/infrastructure/state'
import { selectDateState } from '@date/infrastructure/selectors'
import { setDate } from '@date/infrastructure/state'
import {
  syncCardphotoStatus,
  syncCardtextStatus,
  syncEnvelopeStatus,
} from './cardEditorSaga'
import type { SessionData } from '@entities/db/domain/types'
import type { CardtextSessionRecord } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type {
  ImageRecord,
  CardphotoBase,
  CardphotoSessionRecord,
  ImageMeta,
  WorkingConfig,
} from '@cardphoto/domain/types'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { SizeCard } from '@layout/domain/types'
import type { AromaState } from '@entities/aroma/domain/types'
import type { DateState } from '@entities/date/domain/types'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import { getRandomStockMeta } from './cardphotoHistorySaga'
import { CardSection } from '@shared/config/constants'

export function* persistGlobalSession() {
  const cardphoto: CardphotoSessionRecord | null = yield select(
    selectCardphotoSessionRecord,
  )

  if (!cardphoto) {
    console.log('>>>>PERSIST SKIP: Cardphoto not ready<<<<')
    return
  }

  const cardtext: CardtextSessionRecord | null = yield select(
    selectCardtextSessionRecord,
  )
  const envelope: EnvelopeSessionRecord | null = yield select(
    selectEnvelopeSessionRecord,
  )
  const aroma: AromaState = yield select(selectAromaState)
  const date: DateState = yield select(selectDateState)
  const activeSection: CardSection =
    (yield select(selectActiveSection)) || 'cardphoto'
  const sizeCard: SizeCard = yield select(selectSizeCard)

  const sessionData: SessionData = {
    id: 'current_session',
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date,
    activeSection,
    sizeCard,
    timestamp: Date.now(),
  }

  console.log('>>>>PERSIST SAVING<<<<')

  yield call([storeAdapters.session, 'put'], sessionData)
}

export function* persistGlobalSession1() {
  console.log('>>>>PERSIST<<<<')
  const cardphoto: CardphotoSessionRecord | null = yield select(
    selectCardphotoSessionRecord,
  )

  const cardtext: CardtextSessionRecord | null = yield select(
    selectCardtextSessionRecord,
  )

  // console.log('PERSIST envelope', selectEnvelopeSessionRecord)
  const envelope: EnvelopeSessionRecord | null = yield select(
    selectEnvelopeSessionRecord,
  )

  const aroma: AromaState = yield select(selectAromaState)

  const date: DateState = yield select(selectDateState)

  const currentSection: SectionEditorMenuKey | null =
    yield select(selectActiveSection)

  const activeSection = currentSection || 'cardphoto'

  const sizeCard: SizeCard = yield select(selectSizeCard)

  const sessionData: SessionData = {
    id: 'current_session',
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date,
    activeSection,
    sizeCard,
    timestamp: Date.now(),
  }

  yield call([storeAdapters.session, 'put'], sessionData)
}

const SESSION_WATCH_ACTIONS = [
  setTextStyle.type,
  setActiveSection.type,
  updateRecipientField.type,
  updateSenderField.type,
  setEnabled.type,
  clearRecipient.type,
  clearSender.type,
  // cardtextSlice.actions.setFontFamily.type,
  addOperation.type,
  initCardphoto.type,
  setOrientation.type,
  setActiveSource.type,
  addCropId.type,
  applyFinal.type,
  hydrateEditor.type,
  setAroma.type,
]

export function* hydrateAppSession() {
  try {
    const session: SessionData | null = yield call(
      [storeAdapters.session, 'getById'],
      'current_session',
    )

    if (!session) return

    console.log('SESSION', session)

    if (session.cardphoto) {
      console.log('SESSION_CARDPHOTO cardphoto', session.cardphoto)
      const { activeMetaId, cropIds, source, config } = session.cardphoto

      const [stockRec, userRec, rawProcess, applyRec]: [
        { image: ImageMeta } | null,
        { image: ImageMeta } | null,
        ImageMeta | null,
        { image: ImageMeta } | null,
      ] = yield all([
        call([storeAdapters.stockImages, 'getById'], 'current_stock_image'),
        call([storeAdapters.userImages, 'getById'], 'current_user_image'),
        activeMetaId
          ? call([storeAdapters.cropImages, 'getById'], activeMetaId)
          : null,
        call([storeAdapters.applyImage, 'getById'], 'current_apply_image'),
      ])

      const base: CardphotoBase = {
        stock: { image: hydrateMeta(stockRec?.image || null) },
        user: { image: hydrateMeta(userRec?.image || null) },
        processed: { image: hydrateMeta(rawProcess) },
        apply: { image: hydrateMeta(applyRec?.image || null) },
      }

      const cropCount: number = yield call([storeAdapters.cropImages, 'count'])
      let finalCropIds = cropIds || []

      if (cropCount > 0 && finalCropIds.length !== cropCount) {
        const allCrops: ImageMeta[] = yield call([
          storeAdapters.cropImages,
          'getAll',
        ])
        finalCropIds = allCrops.map((c) => c.id)
      }

      console.log('SESSION_CARDPHOTO cropIds', finalCropIds)

      let activeImage = base[source]?.image || base.stock.image

      if (!activeImage) {
        console.log('>>> Image missing, fetching emergency stock...')
        const emergencyRaw: ImageMeta = yield call(getRandomStockMeta)
        activeImage = hydrateMeta(emergencyRaw)
        if (activeImage) base.stock.image = activeImage
      }

      if (!activeImage) return

      let finalConfig: WorkingConfig

      if (source === 'user' && config) {
        finalConfig = {
          ...config,
          image: { ...config.image, meta: activeImage },
        }
      } else {
        finalConfig = yield call(
          rebuildConfigFromMeta,
          activeImage,
          source,
          activeImage.orientation,
        )
      }

      yield put(
        hydrateEditor({
          base,
          config: finalConfig,
          activeSource: source,
          cropIds: finalCropIds || [],
          cropCount,
        }),
      )

      yield call(syncCardphotoStatus)
    } else {
      console.log('>>> SESSION EMPTY: Initializing default Cardphoto')

      const rawStock: ImageMeta = yield call(getRandomStockMeta)
      const stockImage = hydrateMeta(rawStock)

      if (!stockImage) return

      const sizeCard: SizeCard = yield select(selectSizeCard)

      const config: WorkingConfig = yield call(
        rebuildConfigFromMeta,
        stockImage,
        'stock',
        sizeCard.orientation,
      )

      const base: CardphotoBase = {
        stock: { image: stockImage },
        user: { image: null },
        processed: { image: null },
        apply: { image: null },
      }

      yield put(
        hydrateEditor({
          base,
          config,
          activeSource: 'stock',
          cropIds: [],
          cropCount: 0,
        }),
      )
    }

    console.log('SESSION>>>')

    if (session.cardtext) {
      yield put(setTextStyle(session.cardtext))
    }

    if (session.envelope) {
      const { sender, recipient } = session.envelope

      if (sender) {
        yield put(restoreSender(sender))
      }

      if (recipient) {
        yield put(restoreRecipient(recipient))
      }

      yield call(processEnvelopeVisuals)
    }

    if (session.aroma && session.aroma.selectedAroma) {
      yield put(setAroma(session.aroma.selectedAroma))
    }

    if (session.date && session.date.selectedDate) {
      yield put(setDate(session.date.selectedDate))
    }

    if (session.sizeCard) {
      yield put(setSizeCard(session.sizeCard))
    }

    if (session.activeSection) {
      yield put(restoreEditorSession(session.activeSection))
      yield call(syncSectionMenuVisuals, session.activeSection)

      if (session.activeSection === 'cardtext') {
        yield call(syncCardtextToolbarVisuals)
      }
    }

    if (session.cardtext) {
      yield call(syncCardtextStatus)
    }
    if (session.envelope) {
      yield call(syncEnvelopeStatus)
    }
  } catch (e) {
    console.error('Session hydration failed', e)
  }
}

export function* watchSessionChanges() {
  yield takeLatest(SESSION_WATCH_ACTIONS, function* () {
    yield delay(900)
    yield call(persistGlobalSession)
  })
}
