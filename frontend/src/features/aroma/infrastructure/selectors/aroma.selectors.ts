import type { RootState } from '@app/state'

export const selectAroma = (state: RootState) => state.aroma.selected
