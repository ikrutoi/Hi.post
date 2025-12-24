import { useImageCropState, useImageCropController } from '../hooksLayer'

export const useImageCropFacade = () => {
  const state = useImageCropState()
  const controller = useImageCropController()

  return {
    ...state,
    ...controller,
  }
}
