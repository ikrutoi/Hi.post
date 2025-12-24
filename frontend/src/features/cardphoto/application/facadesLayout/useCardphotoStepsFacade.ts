import { cardphotoStepsActions } from '../../infrastructure/stateLayout'
import {
  selectCardphotoSteps,
  selectCurrentStepIndex,
  selectCurrentStep,
  selectCanUndo,
  selectCanRedo,
} from '../../infrastructure/selectorsLayout'
import { useCardphotoSteps } from '../hooksLayer'

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
