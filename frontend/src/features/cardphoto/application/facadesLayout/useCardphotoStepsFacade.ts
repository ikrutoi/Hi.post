import { cardphotoStepsActions } from '../../infrastructure/stateLayout'
import {
  selectCardphotoSteps,
  selectCurrentStepIndex,
  selectCurrentStep,
} from '../../infrastructure/selectorsLayout'
import { useCardphotoSteps } from '../hooksLayer'

export const cardphotoStepsFacade = {
  actions: cardphotoStepsActions,
  selectors: {
    selectCardphotoSteps,
    selectCurrentStepIndex,
    selectCurrentStep,
  },
  use: useCardphotoSteps,
}
