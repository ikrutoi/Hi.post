import type { RootState } from '@app/state'

export const selectCardphotoSteps = (state: RootState) =>
  state.cardphotoSteps.steps
export const selectCurrentStepIndex = (state: RootState) =>
  state.cardphotoSteps.currentStepIndex
export const selectCurrentStep = (state: RootState) => {
  const index = state.cardphotoSteps.currentStepIndex
  return state.cardphotoSteps.steps[index] ?? null
}
