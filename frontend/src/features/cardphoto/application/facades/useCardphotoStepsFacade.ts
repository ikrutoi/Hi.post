import { cardphotoStepsActions } from '../../infrastructure/state'
import {
  selectCardphotoSteps,
  selectCurrentStepIndex,
  selectCurrentStep,
  selectCanUndo,
  selectCanRedo,
} from '../../infrastructure/selectors'
import { useCardphotoSteps } from '../hooks'

export const cardphotoStepsFacade = {
  actions: cardphotoStepsActions,
  selectors: {
    selectCardphotoSteps,
    selectCurrentStepIndex,
    selectCurrentStep,
    selectCanUndo,
    selectCanRedo,
  },
  use: useCardphotoSteps,
}
