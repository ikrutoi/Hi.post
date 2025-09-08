import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  MemorySection,
  MemoryCardInfo,
  CropRect,
} from '@shared/layoutLegacy/model/layoutTypes'

interface LayoutMemoryState {
  memoryCrop: CropRect | null
  choiceMemorySection: MemorySection
  expendMemoryCard: MemoryCardInfo | null
}

const initialState: LayoutMemoryState = {
  memoryCrop: null,
  choiceMemorySection: { section: null, id: null },
  expendMemoryCard: null,
}

const layoutMemorySlice = createSlice({
  name: 'layoutMemory',
  initialState,
  reducers: {
    setMemoryCrop(state, action: PayloadAction<CropRect | null>) {
      state.memoryCrop = action.payload
    },
    setChoiceMemorySection(
      state,
      action: PayloadAction<Partial<MemorySection>>
    ) {
      state.choiceMemorySection = {
        ...state.choiceMemorySection,
        ...action.payload,
      }
    },
    setExpendMemoryCard(state, action: PayloadAction<MemoryCardInfo | null>) {
      state.expendMemoryCard = action.payload
    },
  },
})

export const { setMemoryCrop, setChoiceMemorySection, setExpendMemoryCard } =
  layoutMemorySlice.actions
export default layoutMemorySlice.reducer
