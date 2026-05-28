import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import type { CardPanelSection } from '@cardPanel/domain/types'
import type { MirrorSectionBackup } from '@cardPanel/domain/types/mirrorSectionBackup.types'
import { prepareForRedux } from '@app/middleware/cardphotoHelpers'
import { applyFinal, clearApply, markLoaded } from '@cardphoto/infrastructure/state'
import { rebuildConfigFromMeta } from '@app/middleware/cardphotoProcessSaga'
import type { ImageMeta } from '@cardphoto/domain/types'
import {
  selectCardphotoAppliedData,
  selectCardphotoAssetData,
  selectCardphotoIsComplete,
} from '@cardphoto/infrastructure/selectors'
import {
  restoreCardtextEditorSession,
  setCardtextViewEditMode,
  clearText,
} from '@cardtext/infrastructure/state'
import { selectCardtextEditorSessionSnapshot } from '@cardtext/infrastructure/selectors'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { restoreSender } from '@envelope/sender/infrastructure/state'
import { restoreRecipient } from '@envelope/recipient/infrastructure/state'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { syncEnvelopeFormsFromAppliedRequested } from '@envelope/infrastructure/state'
import { processEnvelopeVisuals } from './envelopeProcessSaga'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import {
  clearDate,
  setMultiDateMode,
  setSelectedDates,
} from '@date/infrastructure/state'
import {
  selectIsMultiDateMode,
  selectSelectedDates,
} from '@date/infrastructure/selectors'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { setSectionComplete } from '@entities/cardEditor/infrastructure/state'
import type { RootState } from '@app/state'
import type { SenderState } from '@envelope/sender/domain/types'
import type { RecipientState } from '@envelope/recipient/domain/types'
import type { CardtextEditorSessionSnapshot } from '@cardtext/domain/editor/editor.types'

function cloneSenderState(state: SenderState): SenderState {
  return JSON.parse(JSON.stringify(state)) as SenderState
}

function cloneRecipientState(state: RecipientState): RecipientState {
  return JSON.parse(JSON.stringify(state)) as RecipientState
}

export function* captureMirrorSectionBackup(
  section: CardPanelSection,
): SagaIterator<MirrorSectionBackup> {
  switch (section) {
    case 'cardphoto': {
      const applied: ImageMeta | null = yield select(selectCardphotoAppliedData)
      const asset: ImageMeta | null = yield select(selectCardphotoAssetData)
      const meta = applied ?? asset
      return {
        section: 'cardphoto',
        meta: meta != null ? (prepareForRedux(meta) as ImageMeta) : null,
      }
    }
    case 'cardtext': {
      const session = yield select(selectCardtextEditorSessionSnapshot)
      return { section: 'cardtext', session }
    }
    case 'envelope': {
      const root: RootState = yield select((s: RootState) => s)
      return {
        section: 'envelope',
        sender: cloneSenderState(root.sender),
        recipient: cloneRecipientState(root.recipient),
      }
    }
    case 'aroma': {
      const aroma = yield select(selectSelectedAroma)
      return { section: 'aroma', aroma: aroma ?? null }
    }
    case 'date': {
      const dates = yield select(selectSelectedDates)
      const isMultiDateMode: boolean = yield select(selectIsMultiDateMode)
      return {
        section: 'date',
        dates: dates.map((d) => ({ ...d })),
        isMultiDateMode,
      }
    }
    default:
      throw new Error(`Unsupported mirror backup section: ${section}`)
  }
}

function cardtextSessionIsEmpty(session: CardtextEditorSessionSnapshot): boolean {
  return (
    session.assetData == null &&
    session.presetData == null &&
    session.appliedData == null &&
    session.draftData == null
  )
}

export function* restoreMirrorSectionBackup(
  backup: MirrorSectionBackup,
): SagaIterator {
  switch (backup.section) {
    case 'cardphoto': {
      if (backup.meta != null) {
        const serializable = prepareForRedux(backup.meta) as ImageMeta
        yield put(applyFinal(serializable))
        yield call(rebuildConfigFromMeta, serializable, false)
        yield put(markLoaded())
      } else {
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
      if (cardtextSessionIsEmpty(backup.session)) {
        yield put(clearText())
      } else {
        yield put(restoreCardtextEditorSession(backup.session))
      }
      yield put(
        setCardtextViewEditMode(backup.session.isCardtextViewEditMode ?? false),
      )
      {
        const complete: boolean = yield select(selectCardtextIsComplete)
        yield put(
          setSectionComplete({ section: 'cardtext', isComplete: complete }),
        )
      }
      break
    }
    case 'envelope': {
      yield put(restoreSender(backup.sender))
      yield put(restoreRecipient(backup.recipient))
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
      if (backup.aroma != null) {
        yield put(setAroma(backup.aroma))
      } else {
        yield put(clearAroma())
      }
      break
    }
    case 'date': {
      if (backup.dates.length === 0) {
        yield put(clearDate())
      } else {
        yield put(setMultiDateMode(backup.isMultiDateMode))
        yield put(setSelectedDates(backup.dates))
      }
      break
    }
    default:
      break
  }
}
