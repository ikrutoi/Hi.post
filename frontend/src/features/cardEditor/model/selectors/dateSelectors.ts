import type { RootState } from '@app/store/store'

export const selectDate = (state: RootState) => state.cardEditor.date.value
