import { useAppDispatch, useAppSelector } from '@app/hooks'
import { cardphotoStepsActions } from '../../infrastructure/state'
import {
  selectCardphotoSteps,
  selectCurrentStepIndex,
  selectCurrentStep,
  selectCanUndo,
  selectCanRedo,
} from '../../infrastructure/selectors'
import type { CardphotoItem } from '../../domain/types'

export function useCardphotoSteps() {
  const dispatch = useAppDispatch()

  const steps = useAppSelector(selectCardphotoSteps)
  const currentStepIndex = useAppSelector(selectCurrentStepIndex)
  const currentStep = useAppSelector(selectCurrentStep)
  const canUndo = useAppSelector(selectCanUndo)
  const canRedo = useAppSelector(selectCanRedo)

  const undo = () => {
    if (canUndo) {
      dispatch(cardphotoStepsActions.undo())
    }
  }

  const redo = () => {
    if (canRedo) {
      dispatch(cardphotoStepsActions.redo())
    }
  }

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
      canUndo,
      canRedo,
    },
    actions: {
      undo,
      redo,
      pushStep,
      resetSteps,
      setSteps,
      setCurrentStepIndex,
    },
  }
}
