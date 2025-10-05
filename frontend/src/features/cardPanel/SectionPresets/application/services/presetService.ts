import {
  senderAddressAdapter,
  recipientAddressAdapter,
} from '@db/adapters/card'
import { cartAdapter } from '@/db/adapters/cart'
import { draftsAdapter } from '@/db/adapters/drafts'

import type { SectionPreset, PresetSource } from '../../domain/types'

export const presetService = {
  saveBlank: async (card: SectionPreset) => {
    if (card.personalId) {
      await draftsAdapter.addRecordWithId(card.id, {
        envelope: card.cart?.envelope ?? card.drafts?.envelope!,
        cardphoto: card.cart?.cardphoto ?? card.drafts?.cardphoto,
        personalId: card.personalId,
      })
    }
  },

  deletePreset: async (source: PresetSource, id: number) => {
    switch (source) {
      case 'cart':
        return cartAdapter.deleteById(id)
      case 'drafts':
        return draftsAdapter.deleteById(id)
      case 'sender':
        return senderAddressAdapter.deleteById(id)
      case 'recipient':
        return recipientAddressAdapter.deleteById(id)
    }
  },
}
