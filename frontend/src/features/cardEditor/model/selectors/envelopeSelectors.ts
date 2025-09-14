import type { RootState } from '@app/state/store'

export const selectEnvelope = (state: RootState) =>
  state.cardEditor.envelope.value
export const selectSender = (state: RootState) =>
  state.cardEditor.envelope.value.sender
export const selectRecipient = (state: RootState) =>
  state.cardEditor.envelope.value.recipient
