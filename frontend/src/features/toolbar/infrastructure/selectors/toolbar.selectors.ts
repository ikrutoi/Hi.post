import { RootState } from '@app/state'
import type { ToolbarState, ToolbarSection } from '../../domain/types'

export const selectToolbar = (state: RootState): ToolbarState => state.toolbar

export const selectToolbarSection = (
  state: RootState,
  section: ToolbarSection
): ToolbarState[ToolbarSection] => state.toolbar[section]

export const selectCardphotoToolbar = (state: RootState) =>
  selectToolbarSection(state, 'cardphoto')

export const selectCardtextToolbar = (state: RootState) =>
  selectToolbarSection(state, 'cardtext')

export const selectSenderToolbar = (state: RootState) =>
  selectToolbarSection(state, 'sender')

export const selectRecipientToolbar = (state: RootState) =>
  selectToolbarSection(state, 'recipient')

export const selectCardPanelToolbar = (state: RootState) =>
  selectToolbarSection(state, 'cardPanel')

export const selectCardPanelOverlayToolbar = (state: RootState) =>
  selectToolbarSection(state, 'cardPanelOverlay')
