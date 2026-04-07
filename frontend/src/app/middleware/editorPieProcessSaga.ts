import { SagaIterator } from 'redux-saga'
import { all, takeLatest, select, put } from 'redux-saga/effects'
import { handleEditorPieToolbarAction } from './editorPieToolbarSaga'
import { toolbarAction } from '@/features/toolbar/application/helpers'
import type { RootState } from '@app/state'
import {
  clearSection,
  requestRainbowStop,
  resetEditor,
  setPieFavorite,
  setSectionComplete,
  startRainbow,
  togglePieFavorite,
} from '@entities/cardEditor/infrastructure/state'
import { selectPieProgress } from '@/entities/cardEditor/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import {
  setDate,
  setSelectedDates,
  setMultiDateMode,
  clearDate,
  hydrateDateFromSession,
} from '@date/infrastructure/state'
import { setAroma, clear as clearAroma } from '@aroma/infrastructure/state'
import {
  updateRecipientField,
  setRecipientApplied,
  setRecipientAppliedWithData,
  removeAppliedAt,
  setRecipientAppliedData,
  restoreRecipient,
  clearRecipient,
} from '@envelope/recipient/infrastructure/state'
import {
  updateSenderField,
  setEnabled,
  setSenderApplied,
  setSenderAppliedIds,
  setSenderAppliedWithData,
  setSenderAppliedData,
  restoreSender,
  clearSender,
} from '@envelope/sender/infrastructure/state'
import {
  setValue,
  setStatus as setCardtextStatus,
  clearText,
  restoreCardtextSession,
  restoreCardtextEditorSession,
  setCardtextAppliedData,
} from '@cardtext/infrastructure/state'
import {
  applyFinal,
  clearApply,
  reset,
  resetCropLayers,
  hydrateEditor,
  restoreSession,
} from '@cardphoto/infrastructure/state'

/** Любое из этих действий может изменить готовность секций без отдельного setSectionComplete. */
const PIE_PROGRESS_SYNC_ACTIONS = [
  setSectionComplete.type,
  clearSection.type,
  resetEditor.type,
  applyFinal.type,
  clearApply.type,
  reset.type,
  resetCropLayers.type,
  hydrateEditor.type,
  restoreSession.type,
  setValue.type,
  setCardtextStatus.type,
  clearText.type,
  restoreCardtextSession.type,
  restoreCardtextEditorSession.type,
  setCardtextAppliedData.type,
  setDate.type,
  setSelectedDates.type,
  setMultiDateMode.type,
  hydrateDateFromSession.type,
  clearDate.type,
  setAroma.type,
  clearAroma.type,
  updateSenderField.type,
  updateRecipientField.type,
  setEnabled.type,
  setSenderApplied.type,
  setSenderAppliedIds.type,
  setSenderAppliedWithData.type,
  setSenderAppliedData.type,
  setRecipientApplied.type,
  setRecipientAppliedWithData.type,
  removeAppliedAt.type,
  setRecipientAppliedData.type,
  clearSender.type,
  clearRecipient.type,
  restoreSender.type,
  restoreRecipient.type,
  togglePieFavorite.type,
  setPieFavorite.type,
] as const

function* handleRainbowLogic() {
  const { sections, isAllComplete, isRainbowActive } = yield select(
    selectPieProgress,
  )

  if (isAllComplete && !isRainbowActive) {
    yield put(startRainbow())
  } else if (!isAllComplete && isRainbowActive) {
    yield put(requestRainbowStop())
  }

  const allRequiredComplete =
    sections.cardphoto && sections.cardtext && sections.envelope && sections.aroma

  const pieFavorite: boolean = yield select(
    (s: RootState) => s.cardEditor.pieFavorite,
  )

  const favoriteToolbarState = !allRequiredComplete
    ? 'disabled'
    : pieFavorite
      ? 'active'
      : 'enabled'
  const addCartToolbarState = isAllComplete ? 'enabled' : 'disabled'

  yield put(
    updateToolbarSection({
      section: 'editorPie',
      value: {
        addCart: addCartToolbarState,
        favorite: favoriteToolbarState,
      },
    }),
  )
}

export function* editorPieProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleEditorPieToolbarAction),

    takeLatest([...PIE_PROGRESS_SYNC_ACTIONS], handleRainbowLogic),
  ])
}
