import { RootState } from '@app/state'

export const selectActiveImage = (state: RootState) =>
  state.cardphoto.activeImage

export const selectHistory = (state: RootState) => state.cardphoto.history

export const selectActiveIndex = (state: RootState) =>
  state.cardphoto.history?.activeIndex ?? -1

export const selectOperations = (state: RootState) =>
  state.cardphoto.history?.operations ?? []

export const selectIsComplete = (state: RootState) => state.cardphoto.isComplete

export const selectHasConfirmedImage = (state: RootState) =>
  !!state.cardphoto.activeImage && state.cardphoto.isComplete

export const selectOriginalImage = (state: RootState) =>
  state.cardphoto.history?.original ?? null
