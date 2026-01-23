import {
  CARDPHOTO_KEYS,
  CARDPHOTO_TOOLBAR,
  CARDTEXT_KEYS,
  CARDTEXT_TOOLBAR,
  ENVELOPE_KEYS,
  PANEL_KEYS,
  CARD_PANEL_OVERLAY_KEYS,
  SECTION_EDITOR_MENU_KEYS,
  SECTION_EDITOR_MENU_TOOLBAR,
  initialCardphotoToolbarState,
  initialSenderToolbarState,
  initialRecipientToolbarState,
  initialCardPanelToolbarState,
  initialCardPanelOverlayToolbarState,
  initialSectionEditorMenuToolbarState,
  ENVELOPE_TOOLBAR,
  CARD_PANEL_OVERLAY_TOOLBAR,
} from '../types'
import { initialCardtextToolbarState } from '@cardtext/domain/types'
import { cardtextToolbarController } from '@cardtext/application/controllers'

import type { ToolbarState, ToolbarSectionConfigMap } from '../types'

export const TOOLBAR_CONFIG: ToolbarSectionConfigMap = {
  cardphoto: {
    keys: CARDPHOTO_KEYS,
    initialState: initialCardphotoToolbarState,
    onAction: (key, section, editor, dispatch) => {
      dispatch({ type: 'toolbar/action', payload: { section, key } })
    },
    group: 'photo',
    toolbar: CARDPHOTO_TOOLBAR,
    getBadges: (mergedState) => {
      const count = mergedState.cropIndices ? mergedState.cropIndices.length : 0

      return {
        cropHistory: count > 0 ? count : null,
      }
    },
  },
  cardtext: {
    keys: CARDTEXT_KEYS,
    initialState: initialCardtextToolbarState,
    onAction: (key, section, editor, dispatch) => {
      switch (key) {
        case 'bold':
          cardtextToolbarController.toggleBold(editor, dispatch)
          break
        case 'italic':
          cardtextToolbarController.toggleItalic(editor, dispatch)
          break
        case 'underline':
          cardtextToolbarController.toggleUnderline(editor, dispatch)
          break
        case 'left':
        case 'center':
        case 'right':
        case 'justify':
          cardtextToolbarController.setAlign(editor, dispatch, key as any)
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
  sectionEditorMenu: {
    keys: SECTION_EDITOR_MENU_KEYS,
    initialState: initialSectionEditorMenuToolbarState,
    onAction: (key, section) =>
      console.log('SectionEditorMenu action', key, section),
    group: 'menu',
    getBadges: (state: ToolbarState['sectionEditorMenu']) => ({}),
    toolbar: SECTION_EDITOR_MENU_TOOLBAR,
  },
}
