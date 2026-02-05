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
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { syncCardtextToolbarVisuals } from './cardtextHandlers'
import { syncSectionMenuVisuals } from './sectionEditorMenuHandlers'
import { selectCardtextSessionRecord } from '@cardtext/infrastructure/selectors'
import { setTextStyle } from '@cardtext/infrastructure/state'
import { restoreEditorSession } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import type { SessionData } from '@entities/db/domain/types'
import type { CardtextSessionRecord } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { CardphotoSessionRecord } from '@cardphoto/domain/types'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'

export function* persistGlobalSession() {
  const cardphoto: CardphotoSessionRecord | null = yield select(
    selectCardphotoSessionRecord,
  )
  const cardtext: CardtextSessionRecord | null = yield select(
    selectCardtextSessionRecord,
  )

  const currentSection: SectionEditorMenuKey | null =
    yield select(selectActiveSection)

  const activeSection = currentSection || 'cardphoto'

  const sessionData: SessionData = {
    id: 'current_session',
    cardphoto,
    cardtext,
    envelope: null,
    activeSection,
    timestamp: Date.now(),
  }

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
  // toolbarSlice.actions.setActiveSection.type,
]

export function* hydrateAppSession() {
  try {
    const session: SessionData | null = yield call(
      [storeAdapters.session, 'getById'],
      'current_session',
    )

    if (!session) return

    if (session.cardphoto) {
      yield put(restoreSession(session.cardphoto))
    }

    if (session.cardtext) {
      yield put(setTextStyle(session.cardtext))
    }

    if (session.activeSection) {
      yield put(restoreEditorSession(session.activeSection))

      yield call(syncSectionMenuVisuals, session.activeSection)

      if (session.activeSection === 'cardtext') {
        yield call(syncCardtextToolbarVisuals)
      }
    }

    // if (session.activeSection) {
    //   yield put(setActiveSection(session.activeSection))
    // }

    // yield call(syncFontSizeButtonsStatus)
    // yield call(syncOrientationButtonStatus)
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
