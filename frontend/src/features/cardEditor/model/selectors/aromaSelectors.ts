import type { RootState } from '@app/state/store'

export const selectAroma = (state: RootState) => state.cardEditor.aroma.value
