import type { RootState } from '@app/state'

export const selectEnvelope = (state: RootState) => state.envelope
export const selectEnvelopeUi = (state: RootState) => state.envelopeUi
