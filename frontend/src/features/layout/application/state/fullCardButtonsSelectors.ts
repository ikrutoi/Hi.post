import type { RootState } from '@app/state'

export const selectFullCardButtons = (state: RootState) => state.layout.buttons
