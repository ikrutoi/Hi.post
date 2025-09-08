import type { RootState } from '@app/store'

export const selectTheme = (state: RootState) => state.layout.ui.theme
export const selectLayoutMode = (state: RootState) => state.layout.ui.layoutMode
