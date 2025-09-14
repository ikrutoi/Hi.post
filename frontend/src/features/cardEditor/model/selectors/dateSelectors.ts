import type { RootState } from '@app/state/store'

export const selectDate = (state: RootState) => state.cardEditor.date.value
