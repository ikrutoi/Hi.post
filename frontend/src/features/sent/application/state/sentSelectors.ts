import type { RootState } from '@app/store'

export const selectSentCards = (state: RootState) => state.sent
export const selectSentCount = (state: RootState) => state.sent.length
