import { RootState } from '@app/state'

export const selectImageHistory = (state: RootState) => state.imageHistory

export const selectActiveImage = (state: RootState) => {
  const { activeBranch, activeIndex, stockImages, userImages } =
    state.imageHistory
  const list = activeBranch === 'stock' ? stockImages : userImages
  return list[activeIndex] ?? null
}
