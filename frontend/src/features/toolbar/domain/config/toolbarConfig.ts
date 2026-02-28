import {
  CARDPHOTO_KEYS,
  CARDPHOTO_TOOLBAR,
  CARDTEXT_KEYS,
  CARDTEXT_TOOLBAR,
  ENVELOPE_KEYS,
  EDITOR_PIE_KEYS,
  EDITOR_PIE_TOOLBAR,
  CARD_PANEL_OVERLAY_KEYS,
  SECTION_EDITOR_MENU_KEYS,
  SECTION_EDITOR_MENU_TOOLBAR,
  initialCardphotoToolbarState,
  initialSenderToolbarState,
  initialRecipientToolbarState,
  initialEditorPieToolbarState,
  initialCardPanelOverlayToolbarState,
  initialSectionEditorMenuToolbarState,
  SENDER_TOOLBAR,
  RECIPIENT_TOOLBAR,
  CARD_PANEL_OVERLAY_TOOLBAR,
  ADDRESS_LIST_KEYS,
  initialAddressListToolbarState,
  ADDRESS_LIST_TOOLBAR,
  RECIPIENTS_KEYS,
  initialRecipientsToolbarState,
  RECIPIENTS_TOOLBAR,
  ADDRESS_FAVORITE_KEYS,
  ADDRESS_FAVORITE_TOOLBAR,
  initialSenderFavoriteToolbarState,
  initialRecipientFavoriteToolbarState,
  initialRecipientSavedAddressToolbarState,
  RECIPIENT_SAVED_ADDRESS_TOOLBAR,
} from '../types'
import {
  RECIPIENTS_SAVED_ADDRESS_TOOLBAR,
  SAVED_ADDRESS_KEYS,
  SENDER_SAVED_ADDRESS_TOOLBAR,
  initialRecipientsSavedAddressToolbarState,
  initialSenderSavedAddressToolbarState,
} from '../types/savedAddress.types'
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
      const count = mergedState.cropCount || 0

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
        case 'left':
        case 'center':
        case 'right':
        case 'justify':
          cardtextToolbarController.setAlign(editor, dispatch, key as any)
          break
        default:
          dispatch({ type: 'toolbar/action', payload: { section, key } })
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
    getBadges: (state: ToolbarState['sender']) => {
      const addressListBadge = (state.addressList as any)?.options?.badge
      return {
        cardUser: state.cardUser === 'enabled' ? 1 : null,
        addressList:
          addressListBadge && addressListBadge > 0 ? addressListBadge : null,
      }
    },
    group: 'address',
    toolbar: SENDER_TOOLBAR,
  },

  recipient: {
    keys: ENVELOPE_KEYS,
    initialState: initialRecipientToolbarState,
    onAction: (key, section) => console.log('Recipient action', key, section),
    group: 'recipient',
    getBadges: (state: ToolbarState['recipient']) => {
      const addressListBadge = (state.addressList as any)?.options?.badge
      return {
        addressList:
          addressListBadge && addressListBadge > 0 ? addressListBadge : null,
      }
    },
    toolbar: RECIPIENT_TOOLBAR,
  },

  recipients: {
    keys: RECIPIENTS_KEYS,
    initialState: initialRecipientsToolbarState,
    onAction: (key, section) => console.log('Recipients action', key, section),
    group: 'recipients',
    getBadges: (state: ToolbarState['recipients']) => ({}),
    toolbar: RECIPIENTS_TOOLBAR,
  },

  editorPie: {
    keys: EDITOR_PIE_KEYS,
    initialState: initialEditorPieToolbarState,
    onAction: (key, section) => console.log('EditorPie action', key, section),
    group: 'main',
    getBadges: (state: ToolbarState['editorPie']) => ({}),
    toolbar: EDITOR_PIE_TOOLBAR,
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

  addressList: {
    keys: ADDRESS_LIST_KEYS,
    initialState: initialAddressListToolbarState,
    onAction: (key, section) => console.log('AddressList action', key, section),
    group: 'address',
    getBadges: (state: ToolbarState['addressList']) => ({}),
    toolbar: ADDRESS_LIST_TOOLBAR,
  },

  recipientFavorite: {
    keys: ADDRESS_FAVORITE_KEYS,
    initialState: initialRecipientFavoriteToolbarState,
    onAction: (key, section, _editor, dispatch) => {
      dispatch({ type: 'toolbar/action', payload: { section, key } })
    },
    group: 'addressFavorite',
    getBadges: (state: ToolbarState['recipientFavorite']) => ({}),
    toolbar: ADDRESS_FAVORITE_TOOLBAR,
  },

  senderFavorite: {
    keys: ADDRESS_FAVORITE_KEYS,
    initialState: initialSenderFavoriteToolbarState,
    onAction: (key, section, _editor, dispatch) => {
      dispatch({ type: 'toolbar/action', payload: { section, key } })
    },
    group: 'addressFavorite',
    getBadges: (state: ToolbarState['senderFavorite']) => ({}),
    toolbar: ADDRESS_FAVORITE_TOOLBAR,
  },

  senderSavedAddress: {
    keys: SAVED_ADDRESS_KEYS,
    initialState: initialSenderSavedAddressToolbarState,
    onAction: (key, section, _editor, dispatch) => {
      dispatch({ type: 'toolbar/action', payload: { section, key } })
    },
    group: 'senderSavedAddress',
    getBadges: (state: ToolbarState['senderSavedAddress']) => ({}),
    toolbar: SENDER_SAVED_ADDRESS_TOOLBAR,
  },

  recipientSavedAddress: {
    keys: SAVED_ADDRESS_KEYS,
    initialState: initialRecipientSavedAddressToolbarState,
    onAction: (key, section, _editor, dispatch) => {
      dispatch({ type: 'toolbar/action', payload: { section, key } })
    },
    group: 'recipientSavedAddress',
    getBadges: (state: ToolbarState['recipientSavedAddress']) => {
      const addressListBadge = (
        state.addressList as { options?: { badge?: number | null } }
      )?.options?.badge
      return {
        addressList:
          addressListBadge != null && addressListBadge > 0
            ? addressListBadge
            : null,
      }
    },
    toolbar: RECIPIENT_SAVED_ADDRESS_TOOLBAR,
  },

  recipientsSavedAddress: {
    keys: SAVED_ADDRESS_KEYS,
    initialState: initialRecipientsSavedAddressToolbarState,
    onAction: (key, section, _editor, dispatch) => {
      dispatch({ type: 'toolbar/action', payload: { section, key } })
    },
    group: 'recipientsSavedAddress',
    getBadges: (state: ToolbarState['recipientsSavedAddress']) => ({}),
    toolbar: RECIPIENTS_SAVED_ADDRESS_TOOLBAR,
  },
}
