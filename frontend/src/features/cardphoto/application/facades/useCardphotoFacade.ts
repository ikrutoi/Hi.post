// cardphoto.facade.ts
import { AppDispatch, RootState } from '@app/state'
import { useCardphotoController } from '../controllers'

export const useCardphotoFacade = (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const controller = useCardphotoController(dispatch, getState)

  const helpers = {
    canUndo: () => controller.state.activeIndex >= 0,
    canRedo: () =>
      controller.state.activeIndex < controller.state.operations.length - 1,
    isReadyForMiniSection: () =>
      controller.state.hasConfirmedImage && controller.state.isComplete,
  }

  return {
    ...controller,
    helpers,
  }
}
