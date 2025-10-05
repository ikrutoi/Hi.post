import { RootState } from '@app/state'

export const selectEnvelope = (state: RootState) => ({
  sender: state.envelope.sender,
  recipient: state.envelope.recipient,
})

export const selectEnvelopeUi = (state: RootState) => state.envelope.ui
