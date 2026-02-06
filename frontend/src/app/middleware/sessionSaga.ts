import { call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { selectCardphotoSessionRecord } from '@cardphoto/infrastructure/selectors'
import {
  addOperation,
  hydrateEditor,
  initCardphoto,
  setActiveSource,
  setOrientation,
  restoreSession,
} from '@cardphoto/infrastructure/state'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { setSizeCard } from '@layout/infrastructure/state'
import { restoreRecipient } from '@envelope/recipient/infrastructure/state'
import { restoreSender } from '@envelope/sender/infrastructure/state'
import { restoreEnvelopeSession } from '@envelope/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { syncCardtextToolbarVisuals } from './cardtextHandlers'
import { syncSectionMenuVisuals } from './sectionEditorMenuHandlers'
import { selectCardtextSessionRecord } from '@cardtext/infrastructure/selectors'
import { setTextStyle } from '@cardtext/infrastructure/state'
import { selectEnvelopeSessionRecord } from '@envelope/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { restoreEditorSession } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import type { SessionData } from '@entities/db/domain/types'
import type { CardtextSessionRecord } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { CardphotoSessionRecord } from '@cardphoto/domain/types'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { SizeCard } from '@layout/domain/types'

export function* persistGlobalSession() {
  const cardphoto: CardphotoSessionRecord | null = yield select(
    selectCardphotoSessionRecord,
  )
  const cardtext: CardtextSessionRecord | null = yield select(
    selectCardtextSessionRecord,
  )

  const envelope: EnvelopeSessionRecord | null = yield select(
    selectEnvelopeSessionRecord,
  )

  const currentSection: SectionEditorMenuKey | null =
    yield select(selectActiveSection)

  const activeSection = currentSection || 'cardphoto'

  const sizeCard: SizeCard = yield select(selectSizeCard)

  const sessionData: SessionData = {
    id: 'current_session',
    cardphoto,
    cardtext,
    envelope,
    activeSection,
    sizeCard,
    timestamp: Date.now(),
  }

  // console.log('PERSIST sessionData', sessionData)

  yield call([storeAdapters.session, 'put'], sessionData)
}

const SESSION_WATCH_ACTIONS = [
  setTextStyle.type,
  setActiveSection.type,
  // cardtextSlice.actions.setFontFamily.type,
  addOperation.type,
  initCardphoto.type,
  setOrientation.type,
  setActiveSource.type,
  hydrateEditor.type,
]

export function* hydrateAppSession() {
  try {
    const session: SessionData | null = yield call(
      [storeAdapters.session, 'getById'],
      'current_session',
    )

    if (!session) return

    // console.log('SESSION', session)

    if (session.cardphoto) {
      yield put(restoreSession(session.cardphoto))
    }

    if (session.cardtext) {
      yield put(setTextStyle(session.cardtext))
    }

    if (session && session.envelope) {
      const { sender, recipient } = session.envelope

      if (sender) {
        yield put(restoreSender(sender))
      }

      if (recipient) {
        yield put(restoreRecipient(recipient))
      }
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
  } catch (e) {
    console.error('Session hydration failed', e)
  }
}

export function* watchSessionChanges() {
  yield takeLatest(SESSION_WATCH_ACTIONS, function* () {
    yield delay(600)
    yield call(persistGlobalSession)
  })
}
