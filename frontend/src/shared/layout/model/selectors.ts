import { RootState } from 'app/store/store'

export const selectSavedCardId = (state: RootState) => state.layout.savedCardId
