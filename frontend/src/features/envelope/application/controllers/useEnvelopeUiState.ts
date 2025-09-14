import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { RootState } from '@app/state'
import {
  updateEnvelopeUiState,
  updateEnvelopeButtons,
} from '@envelope/application/store'
import type {
  EnvelopeUiSignals,
  EnvelopeButtonsState,
  EnvelopeUiState,
} from '@envelope/domain'

export interface EnvelopeUiController extends EnvelopeUiState {
  setUiState: (payload: Partial<EnvelopeUiSignals>) => void
  setButtonsState: (payload: Partial<EnvelopeButtonsState>) => void
}

export const useEnvelopeUiState = (): EnvelopeUiController => {
  const dispatch = useAppDispatch()
  const uiState = useAppSelector((state: RootState) => state.envelopeUi)

  return {
    ...uiState,
    setUiState: (payload) => dispatch(updateEnvelopeUiState(payload)),
    setButtonsState: (payload) => dispatch(updateEnvelopeButtons(payload)),
  }
}
