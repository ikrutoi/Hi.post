import type { RootState } from '@app/state/store'

export const selectDrafts = (state: RootState) => state.drafts
export const selectDraftsCount = (state: RootState) => state.drafts.length
