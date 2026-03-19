import { useAppDispatch, useAppSelector } from '@app/hooks'
import { cardphotoStepsActions } from '../../infrastructure/stateLayout'
import {
  selectCardphotoSteps,
  selectCurrentStepIndex,
  selectCurrentStep,
} from '../../infrastructure/selectorsLayout'
import type { CardphotoItem } from '../../domain/typesLayout'

export function useCardphotoSteps() {
  const dispatch = useAppDispatch()

  const steps = useAppSelector(selectCardphotoSteps)
  const currentStepIndex = useAppSelector(selectCurrentStepIndex)
  const currentStep = useAppSelector(selectCurrentStep)

  const pushStep = (newStep: CardphotoItem) => {
    dispatch(cardphotoStepsActions.pushStep(newStep))
  }

  const resetSteps = () => {
    dispatch(cardphotoStepsActions.resetSteps())
  }

  const setSteps = (newSteps: CardphotoItem[]) => {
    dispatch(cardphotoStepsActions.setSteps(newSteps))
  }

  const setCurrentStepIndex = (index: number) => {
    dispatch(cardphotoStepsActions.setCurrentStepIndex(index))
  }

  return {
    state: {
      steps,
      currentStepIndex,
      currentStep,
    },
    actions: {
      pushStep,
      resetSteps,
      setSteps,
      setCurrentStepIndex,
    },
  }
}
