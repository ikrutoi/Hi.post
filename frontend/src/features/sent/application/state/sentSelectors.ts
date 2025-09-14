import type { RootState } from '@app/state'

export const selectSentCards = (state: RootState) => state.sent
export const selectSentCount = (state: RootState) => state.sent.length
