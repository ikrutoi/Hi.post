import { useAppDispatch, useAppSelector } from '@app/hooks'
import { cardphotoStepsActions } from '../../infrastructure/state'
import type { CardphotoItem } from '../../domain/types'

export function useCardphotoSteps() {
  const dispatch = useAppDispatch()

  const steps = useAppSelector((state) => state.cardphotoSteps.steps)
  const currentStepIndex = useAppSelector(
    (state) => state.cardphotoSteps.currentStepIndex
  )
  const currentStep = steps[currentStepIndex] ?? null

  const canUndo = currentStepIndex > 0
  const canRedo = currentStepIndex < steps.length - 1

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
    steps,
    currentStepIndex,
    currentStep,
    canUndo,
    canRedo,
    undo,
    redo,
    pushStep,
    resetSteps,
    setSteps,
    setCurrentStepIndex,
  }
}
