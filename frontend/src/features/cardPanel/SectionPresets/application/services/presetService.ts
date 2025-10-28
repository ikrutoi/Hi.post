import {
  cartTemplatesAdapter,
  draftsTemplatesAdapter,
  senderTemplatesAdapter,
  recipientTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type { CardItem } from '@entities/card/domain/types'
import type { CardMenuSection, Template } from '@shared/config/constants'

export const presetService = {
  saveBlank: async (card: CardItem) => {
    if (card.id) {
      await draftsTemplatesAdapter.addRecordWithId(card.id, {
        envelope: card.cart?.envelope ?? card.drafts?.envelope!,
        cardphoto: card.cart?.cardphoto ?? card.drafts?.cardphoto,
        id: card.id,
      })
    }
  },

  deletePreset: async (template: Template, id: number) => {
    switch (template) {
      case 'cart':
        return cartTemplatesAdapter.deleteById(id)
      case 'drafts':
        return draftsTemplatesAdapter.deleteById(id)
      case 'sender':
        return senderTemplatesAdapter.deleteById(id)
      case 'recipient':
        return recipientTemplatesAdapter.deleteById(id)
    }
  },
}
