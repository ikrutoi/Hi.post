import { RootState } from '@app/state'
import type { Card, CardStatus } from '../../domain/types'

export const selectCards = (state: RootState): Card[] => state.card.cards

export const selectCardById = (
  state: RootState,
  id: string
): Card | undefined => state.card.cards.find((c) => c.id === id)

export const selectCardsByStatus = (
  state: RootState,
  status: CardStatus
): Card[] => state.card.cards.filter((c) => c.status === status)

export const selectHasCard = (state: RootState, id: string): boolean =>
  state.card.cards.some((c) => c.id === id)
