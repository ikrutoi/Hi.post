import type { RootState } from '@app/state'

export const selectAssemblyBranchFreeze = (state: RootState) =>
  state.assemblyBranchFreeze.freeze
