import { RootState } from '@app/state'
import { CardPanelState } from '../../domain/types'

export const selectCardPanel = (state: RootState): CardPanelState =>
  state.cardPanel

export const selectCardPanelSource = (state: RootState) =>
  state.cardPanel.source
export const selectIsPacked = (state: RootState) => state.cardPanel.isPacked
export const selectActiveSection = (state: RootState) =>
  state.cardPanel.activeSection

export const selectTemplateMode = (state: RootState) =>
  state.cardPanel.source === 'templates'
export const selectActiveTemplate = (state: RootState) =>
  state.cardPanel.activeTemplate
export const selectTemplateList = (state: RootState) =>
  state.cardPanel.templateList

export const selectScrollIndex = (state: RootState) =>
  state.cardPanel.scrollIndex
export const selectValueScroll = (state: RootState) =>
  state.cardPanel.valueScroll
