import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CardphotoSteps, CardphotoItem } from '../../domain/typesLayout'

const initialState: CardphotoSteps = {
  steps: [],
  currentStepIndex: 0,
}

export const cardphotoStepsSlice = createSlice({
  name: 'cardphotoSteps',
  initialState,
  reducers: {
    pushStep(state, action: PayloadAction<CardphotoItem>) {
      const newSteps = [...state.steps.slice(-2), action.payload]
      state.steps = newSteps
      state.currentStepIndex = newSteps.length - 1
    },
    undo(state) {
      if (state.currentStepIndex > 0) {
        state.currentStepIndex -= 1
      }
    },
    redo(state) {
      if (state.currentStepIndex < state.steps.length - 1) {
        state.currentStepIndex += 1
      }
    },
    setSteps(state, action: PayloadAction<CardphotoItem[]>) {
      state.steps = action.payload
      state.currentStepIndex =
        action.payload.length > 0
          ? Math.min(action.payload.length - 1, state.currentStepIndex)
          : 0
    },
    setCurrentStepIndex(state, action: PayloadAction<number>) {
      state.currentStepIndex =
        state.steps.length > 0
          ? Math.max(0, Math.min(action.payload, state.steps.length - 1))
          : 0
    },
    resetSteps(state) {
      state.steps = []
      state.currentStepIndex = 0
    },
  },
})

export const cardphotoStepsActions = cardphotoStepsSlice.actions
export default cardphotoStepsSlice.reducer
