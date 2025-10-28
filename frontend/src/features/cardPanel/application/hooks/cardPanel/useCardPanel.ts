import { useCardPanelState } from './useCardPanelState'
import { useCardPanelHandlers } from './useCardPanelHandlers'
import { useCardPanelDb } from './useCardPanelDb'
import { useCardPanelSections } from './useCardPanelSections'
import type { CardPanel } from '@features/cardPanel/domain/types'

export const useCardPanel = (): CardPanel => {
  const state = useCardPanelState()
  const db = useCardPanelDb(state)
  const handlers = useCardPanelHandlers(state, db)
  const sections = useCardPanelSections(state)

  return {
    ...state,
    ...handlers,
    ...sections,
  }
}
