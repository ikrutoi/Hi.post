import type { RootState } from '@app/store'

export const selectAroma = (state: RootState) => state.aroma.selected
