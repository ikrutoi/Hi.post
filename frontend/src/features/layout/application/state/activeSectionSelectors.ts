import type { RootState } from '@app/store'

export const selectActiveSections = (state: RootState) =>
  state.layout.active.sections
