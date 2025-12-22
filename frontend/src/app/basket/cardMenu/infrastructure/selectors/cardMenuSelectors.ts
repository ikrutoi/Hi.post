import { RootState } from '@app/state'

export const getActiveSection = (state: RootState) =>
  state.cardMenu.activeSection
