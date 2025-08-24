import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ActiveSections = {
  cardphoto: boolean
  cardtext: boolean
  envelope: boolean
  date: boolean
  aroma: boolean
}

const initialState: ActiveSections = {
  cardphoto: false,
  cardtext: false,
  envelope: false,
  date: false,
  aroma: false,
}

const activeSectionsSlice = createSlice({
  name: 'activeSections',
  initialState,
  reducers: {
    setActiveSections: (
      state,
      action: PayloadAction<Partial<ActiveSections>>
    ) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setActiveSections } = activeSectionsSlice.actions
export const activeSectionsReducer = activeSectionsSlice.reducer
export type { ActiveSections }
