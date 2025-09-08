import type { RootState } from '@app/store'

export const selectIsLoading = (state: RootState) =>
  state.layout.status.isLoading
export const selectError = (state: RootState) => state.layout.status.error
