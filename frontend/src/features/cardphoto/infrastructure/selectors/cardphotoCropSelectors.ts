import { RootState } from '@app/state'
import { CropState } from '../state'

export const selectCrop = (state: RootState): CropState => state.cardphotoCrop

export const selectCropLeft = (state: RootState): number =>
  state.cardphotoCrop.left

export const selectCropTop = (state: RootState): number =>
  state.cardphotoCrop.top

export const selectCropWidth = (state: RootState): number =>
  state.cardphotoCrop.width

export const selectCropHeight = (state: RootState): number =>
  state.cardphotoCrop.height

export const selectCropCenter = (
  state: RootState
): { x: number; y: number } => {
  const crop = state.cardphotoCrop
  return {
    x: crop.left + crop.width / 2,
    y: crop.top + crop.height / 2,
  }
}
