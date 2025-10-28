import { useImageCropState, useImageCropController } from '../hooks'

export const useImageCropFacade = () => {
  const state = useImageCropState()
  const controller = useImageCropController()

  return {
    ...state,
    ...controller,
  }
}
