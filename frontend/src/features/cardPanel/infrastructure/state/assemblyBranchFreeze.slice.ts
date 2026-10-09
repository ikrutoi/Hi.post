import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  AssemblyBranchFreeze,
  AssemblyBranchFreezeState,
  FactoryCardphotoHold,
} from '../../domain/types/assemblyBranchFreeze.types'

const initialState: AssemblyBranchFreezeState = {
  freeze: null,
  factoryCardphotoHold: null,
}

const assemblyBranchFreezeSlice = createSlice({
  name: 'assemblyBranchFreeze',
  initialState,
  reducers: {
    setAssemblyBranchFreeze(
      state,
      action: PayloadAction<AssemblyBranchFreeze>,
    ) {
      state.freeze = action.payload
    },
    clearAssemblyBranchFreeze(state) {
      state.freeze = null
    },
    setFactoryCardphotoHold(
      state,
      action: PayloadAction<FactoryCardphotoHold>,
    ) {
      state.factoryCardphotoHold = action.payload
    },
    clearFactoryCardphotoHold(state) {
      state.factoryCardphotoHold = null
    },
  },
})

export const {
  setAssemblyBranchFreeze,
  clearAssemblyBranchFreeze,
  setFactoryCardphotoHold,
  clearFactoryCardphotoHold,
} = assemblyBranchFreezeSlice.actions

export default assemblyBranchFreezeSlice.reducer
