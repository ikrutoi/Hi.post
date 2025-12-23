import type { RootState } from '@app/state'

export const selectCardphotoSteps = (state: RootState) =>
  state.cardphotoSteps.steps
export const selectCurrentStepIndex = (state: RootState) =>
  state.cardphotoSteps.currentStepIndex
export const selectCurrentStep = (state: RootState) => {
  const index = state.cardphotoSteps.currentStepIndex
  return state.cardphotoSteps.steps[index] ?? null
}
export const selectCanUndo = (state: RootState) =>
  state.cardphotoSteps.currentStepIndex > 0
export const selectCanRedo = (state: RootState) =>
  state.cardphotoSteps.currentStepIndex < state.cardphotoSteps.steps.length - 1
