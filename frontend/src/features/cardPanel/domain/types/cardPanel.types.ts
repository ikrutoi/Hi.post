import { CardtextState } from '@features/cardtext/domain/types'
import { EnvelopeAddresses } from '@features/envelope/domain/types'
import { DispatchDate } from '@entities/date/domain/types'
import { AromaItem } from '@entities/aroma/domain/types'

import type { CardPanelState } from './cardPanelState'
import type { CardPanelHandlers } from './cardPanelHandlers'
import type { CardPanelSections } from './cardPanelSections'
import type { FULL_CARD_ACTIONS } from '../constants'

export type CardPanel = CardPanelState & CardPanelHandlers & CardPanelSections

export interface CardData {
  cardphoto: string
  cardtext: CardtextState
  envelope: EnvelopeAddresses
  date: DispatchDate
  aroma: AromaItem
  personalId?: string
}

export interface MiniCardSize {
  width: number
  height: number
}

export interface ExpendCard {
  id: string | number
  source: 'cart' | 'drafts'
}

export type FullCardAction = (typeof FULL_CARD_ACTIONS)[number]

export interface CardActionsState {
  fullCard: FullCardState
}

export type FullCardState = Record<FullCardAction, boolean>
