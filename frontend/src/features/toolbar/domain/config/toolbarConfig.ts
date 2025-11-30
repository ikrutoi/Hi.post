// toolbarConfig.ts
import {
  CARDPHOTO_KEYS,
  CARDTEXT_KEYS,
  ENVELOPE_KEYS,
  CARD_PANEL_KEYS,
  CARD_PANEL_OVERLAY_KEYS,
  initialCardphotoToolbarState,
  initialCardtextToolbarState,
  initialSenderToolbarState,
  initialRecipientToolbarState,
  initialCardPanelToolbarState,
  initialCardPanelOverlayToolbarState,
} from '../types'

import type { ToolbarSection, ToolbarState } from '../types'

type ToolbarConfig<TSection extends ToolbarSection> = {
  keys: ReadonlyArray<keyof ToolbarState[TSection]>
  initialState: ToolbarState[TSection]
  onAction: (key: keyof ToolbarState[TSection], section: TSection) => void
  getBadges?: (state: ToolbarState[TSection]) => Record<string, number | null>
}

export const TOOLBAR_CONFIG: { [S in ToolbarSection]: ToolbarConfig<S> } = {
  cardphoto: {
    keys: CARDPHOTO_KEYS,
    initialState: initialCardphotoToolbarState,
    onAction: (key, section) => {
      console.log('Cardphoto action', key, section)
    },
  },
  cardtext: {
    keys: CARDTEXT_KEYS,
    initialState: initialCardtextToolbarState,
    onAction: (key, section) => {
      console.log('Cardtext action', key, section)
    },
  },
  sender: {
    keys: ENVELOPE_KEYS,
    initialState: initialSenderToolbarState,
    onAction: (key, section) => {
      console.log('Sender action', key, section)
    },
    getBadges: (state) => ({
      cardUser: state.cardUser === 'enabled' ? 1 : null,
    }),
  },
  recipient: {
    keys: ENVELOPE_KEYS,
    initialState: initialRecipientToolbarState,
    onAction: (key, section) => {
      console.log('Recipient action', key, section)
    },
  },
  cardPanel: {
    keys: CARD_PANEL_KEYS,
    initialState: initialCardPanelToolbarState,
    onAction: (key, section) => {
      console.log('CardPanel action', key, section)
    },
  },
  cardPanelOverlay: {
    keys: CARD_PANEL_OVERLAY_KEYS,
    initialState: initialCardPanelOverlayToolbarState,
    onAction: (key, section) => {
      console.log('CardPanelOverlay action', key, section)
    },
  },
}
