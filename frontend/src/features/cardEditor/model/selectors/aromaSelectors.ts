import type { RootState } from '@app/store/store'

export const selectAroma = (state: RootState) => state.cardEditor.aroma.value
