import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PersonalState {
  personalId: string | null
  currentDate: string | null
  choiceSave: string | null
  choiceClip: string | null
}

const initialState: PersonalState = {
  personalId: null,
  currentDate: null,
  choiceSave: null,
  choiceClip: null,
}

const personalSlice = createSlice({
  name: 'personal',
  initialState,
  reducers: {
    setPersonalId: (state, action: PayloadAction<string | null>) => {
      state.personalId = action.payload
    },
    setCurrentDate: (state, action: PayloadAction<string | null>) => {
      state.currentDate = action.payload
    },
    setChoiceSave: (state, action: PayloadAction<string | null>) => {
      state.choiceSave = action.payload
    },
    setChoiceClip: (state, action: PayloadAction<string | null>) => {
      state.choiceClip = action.payload
    },
  },
})

export const { setPersonalId, setCurrentDate, setChoiceSave, setChoiceClip } =
  personalSlice.actions
export const personalReducer = personalSlice.reducer
export type { PersonalState }
