import {
  CARDPHOTO_KEYS,
  CARDTEXT_KEYS,
  CARDTEXT_TOOLBAR,
  ENVELOPE_KEYS,
  PANEL_KEYS,
  CARD_PANEL_OVERLAY_KEYS,
  initialCardphotoToolbarState,
  initialCardtextToolbarState,
  initialSenderToolbarState,
  initialRecipientToolbarState,
  initialCardPanelToolbarState,
  initialCardPanelOverlayToolbarState,
} from '../types'

import type { ToolbarState, ToolbarSectionConfigMap } from '../types'

export const TOOLBAR_CONFIG: ToolbarSectionConfigMap = {
  cardphoto: {
    keys: CARDPHOTO_KEYS,
    initialState: initialCardphotoToolbarState,
    onAction: (key, section) => console.log('Cardphoto action', key, section),
    group: 'photo',
    getBadges: (state: ToolbarState['cardphoto']) => ({}),
  },
  cardtext: {
    keys: CARDTEXT_KEYS,
    initialState: initialCardtextToolbarState,
    onAction: (key, section) => console.log('Cardtext action', key, section),
    group: 'text',
    toolbar: CARDTEXT_TOOLBAR,
    getBadges: (state: ToolbarState['cardtext']) => ({}),
  },
  sender: {
    keys: ENVELOPE_KEYS,
    initialState: initialSenderToolbarState,
    onAction: (key, section) => console.log('Sender action', key, section),
    getBadges: (state: ToolbarState['sender']) => ({
      cardUser: state.cardUser === 'enabled' ? 1 : null,
    }),
    group: 'sender',
  },
  recipient: {
    keys: ENVELOPE_KEYS,
    initialState: initialRecipientToolbarState,
    onAction: (key, section) => console.log('Recipient action', key, section),
    group: 'recipient',
    getBadges: (state: ToolbarState['recipient']) => ({}),
  },
  cardPanel: {
    keys: PANEL_KEYS,
    initialState: initialCardPanelToolbarState,
    onAction: (key, section) => console.log('CardPanel action', key, section),
    group: 'panel',
    getBadges: (state: ToolbarState['cardPanel']) => ({}),
  },
  cardPanelOverlay: {
    keys: CARD_PANEL_OVERLAY_KEYS,
    initialState: initialCardPanelOverlayToolbarState,
    onAction: (key, section) =>
      console.log('CardPanelOverlay action', key, section),
    group: 'overlay',
    getBadges: (state: ToolbarState['cardPanelOverlay']) => ({}),
  },
}
