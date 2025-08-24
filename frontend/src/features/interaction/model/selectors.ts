import type { RootState } from '@app/store/store'

export const selectInteraction = (state: RootState) => state.interaction
export const selectCardPhotoClick = (state: RootState) =>
  state.interaction.cardphotoClick
