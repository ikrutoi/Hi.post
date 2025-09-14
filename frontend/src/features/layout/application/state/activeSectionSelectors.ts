import type { RootState } from '@app/state'

export const selectActiveSections = (state: RootState) =>
  state.layout.active.sections
