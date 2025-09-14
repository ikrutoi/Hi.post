import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  DraftLayoutState,
  MemorySection,
  MemoryCardInfo,
} from '../../domain/types/layout.types'

const initialState: DraftLayoutState['memory'] = {
  memoryCrop: null,
  choiceMemorySection: {},
  expendMemoryCard: null,
  lockExpendMemoryCard: false,
}

export const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    addMemoryCrop(state, action: PayloadAction<any>) {
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
    setLockExpendMemoryCard(state, action: PayloadAction<boolean>) {
      state.lockExpendMemoryCard = action.payload
    },
  },
})

export const memoryActions = memorySlice.actions
export default memorySlice.reducer
