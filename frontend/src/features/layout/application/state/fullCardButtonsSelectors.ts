import type { RootState } from '@app/store'

export const selectFullCardButtons = (state: RootState) => state.layout.buttons
