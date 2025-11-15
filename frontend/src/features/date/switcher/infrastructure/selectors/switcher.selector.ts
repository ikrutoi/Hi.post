import { RootState } from '@app/state'

export const selectActiveSwitcher = (state: RootState) => state.switcher.active
