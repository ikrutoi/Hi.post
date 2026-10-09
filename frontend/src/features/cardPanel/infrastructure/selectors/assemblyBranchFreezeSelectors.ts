import type { RootState } from '@app/state'

export const selectAssemblyBranchFreeze = (state: RootState) =>
  state.assemblyBranchFreeze.freeze

export const selectFactoryCardphotoHold = (state: RootState) =>
  state.assemblyBranchFreeze.factoryCardphotoHold
