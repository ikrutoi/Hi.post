import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import { envelopeUiActions } from '../../infrastructure/state'
import { selectEnvelopeUi } from '../../infrastructure/selectors'
import type { EnvelopeUiSignals } from '../../domain/types'

export const useEnvelopeUiController = () => {
  const dispatch = useAppDispatch()
  const state = useSelector(selectEnvelopeUi)

  const actions = {
    update: (payload: Partial<EnvelopeUiSignals>) => {
      dispatch(envelopeUiActions.updateEnvelopeUiState(payload))
    },

    updateSignal: <K extends keyof EnvelopeUiSignals>(
      key: K,
      value: EnvelopeUiSignals[K]
    ) => {
      dispatch(envelopeUiActions.updateEnvelopeUiState({ [key]: value }))
    },

    reset: () => {
      dispatch(
        envelopeUiActions.updateEnvelopeUiState({
          miniAddressClose: null,
          envelopeSave: null,
          envelopeSaveSecond: null,
          envelopeRemoveAddress: null,
        })
      )
    },
  }

  return { state, actions }
}
