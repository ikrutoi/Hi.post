import { RootState } from '@app/state/store'

export const selectSavedCardId = (state: RootState) => state.layout.savedCardId
