import {
  cartTemplatesAdapter,
  draftsTemplatesAdapter,
  senderTemplatesAdapter,
  recipientTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type { PostcardHydrated } from '@entities/postcard'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { Template } from '@shared/config/constants'
import { sectionPresetRowId } from '../helpers/sectionPresetRow'

export const presetService = {
  saveBlank: async (row: PostcardHydrated | DraftsItem) => {
    if (!('card' in row)) return
    const id = sectionPresetRowId(row)
    const { card } = row
    const localId =
      'postcard' in row ? row.localId : (row as DraftsItem).localId
    await draftsTemplatesAdapter.addRecordWithId(id, {
      localId,
      card,
    })
  },

  deletePreset: async (template: Template, id: string | number) => {
    switch (template) {
      case 'cart':
        return cartTemplatesAdapter.deleteById(String(id))
      case 'drafts':
        return draftsTemplatesAdapter.deleteById(String(id))
      case 'sender':
        return senderTemplatesAdapter.deleteById(String(id))
      case 'recipient':
        return recipientTemplatesAdapter.deleteById(String(id))
    }
  },
}
