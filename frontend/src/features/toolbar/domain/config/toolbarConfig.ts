import {
  CARDPHOTO_KEYS,
  CARDTEXT_KEYS,
  CARDTEXT_TOOLBAR,
  ENVELOPE_KEYS,
  PANEL_KEYS,
  CARD_PANEL_OVERLAY_KEYS,
  initialCardphotoToolbarState,
  initialSenderToolbarState,
  initialRecipientToolbarState,
  initialCardPanelToolbarState,
  initialCardPanelOverlayToolbarState,
  ENVELOPE_TOOLBAR,
  CARD_PANEL_OVERLAY_TOOLBAR,
} from '../types'
import { initialCardtextToolbarState } from '@cardtext/domain/types'
import { cardtextController } from '@cardtext/application/controllers'

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
    onAction: (key, section, editor, dispatch) => {
      switch (key) {
        case 'bold':
          cardtextController.toggleBold(editor, dispatch)
          break
        case 'italic':
          cardtextController.toggleItalic(editor, dispatch)
          break
        case 'underline':
          cardtextController.toggleUnderline(editor, dispatch)
          break
        case 'left':
        case 'center':
        case 'right':
        case 'justify':
          cardtextController.setAlign(editor, dispatch, key as any)
          break
      }
    },
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
    group: 'address',
    toolbar: ENVELOPE_TOOLBAR,
  },
  recipient: {
    keys: ENVELOPE_KEYS,
    initialState: initialRecipientToolbarState,
    onAction: (key, section) => console.log('Recipient action', key, section),
    group: 'address',
    getBadges: (state: ToolbarState['recipient']) => ({}),
    toolbar: ENVELOPE_TOOLBAR,
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
    toolbar: CARD_PANEL_OVERLAY_TOOLBAR,
  },
}
