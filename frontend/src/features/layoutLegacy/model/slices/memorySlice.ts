import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type MemorySection = { section: string | null; id: string | null }
type MemoryCardInfo = { source: 'sender' | 'recipient'; id: number | string }

interface MemoryState {
  memoryCrop: any
  choiceMemorySection: MemorySection
  expendMemoryCard: MemoryCardInfo | null
  lockExpendMemoryCard: boolean
}

const initialState: MemoryState = {
  memoryCrop: null,
  choiceMemorySection: { section: null, id: null },
  expendMemoryCard: null,
  lockExpendMemoryCard: true,
}

const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    setMemoryCrop: (state, action: PayloadAction<any>) => {
      state.memoryCrop = action.payload
    },
    setChoiceMemorySection: (
      state,
      action: PayloadAction<Partial<MemorySection>>
    ) => {
      state.choiceMemorySection = {
        ...state.choiceMemorySection,
        ...action.payload,
      }
    },
    setExpendMemoryCard: (
      state,
      action: PayloadAction<MemoryCardInfo | null>
    ) => {
      state.expendMemoryCard = action.payload
    },
    setLockExpendMemoryCard: (state, action: PayloadAction<boolean>) => {
      state.lockExpendMemoryCard = action.payload
    },
  },
})

export const {
  setMemoryCrop,
  setChoiceMemorySection,
  setExpendMemoryCard,
  setLockExpendMemoryCard,
} = memorySlice.actions
export const memoryReducer = memorySlice.reducer
export type { MemoryState }
