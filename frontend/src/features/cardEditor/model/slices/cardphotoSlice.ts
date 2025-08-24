import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Cardphoto = {
  url: string | null
  source: string | null
}

const initialState: Cardphoto = {
  url: null,
  source: null,
}

const cardPhotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    setCardphoto: (state, action: PayloadAction<Partial<Cardphoto>>) => ({
      ...state,
      ...action.payload,
    }),
  },
})

export const { setCardphoto } = cardPhotoSlice.actions
export const cardphotoReducer = cardPhotoSlice.reducer
