import type { RootState } from '@app/store/store'

export const selectDrafts = (state: RootState) => state.drafts
export const selectDraftsCount = (state: RootState) => state.drafts.length
