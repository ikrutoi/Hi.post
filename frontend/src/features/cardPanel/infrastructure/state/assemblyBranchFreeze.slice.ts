import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  AssemblyBranchFreeze,
  AssemblyBranchFreezeState,
} from '../../domain/types/assemblyBranchFreeze.types'

const initialState: AssemblyBranchFreezeState = {
  freeze: null,
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
  },
})

export const { setAssemblyBranchFreeze, clearAssemblyBranchFreeze } =
  assemblyBranchFreezeSlice.actions

export default assemblyBranchFreezeSlice.reducer
