import { senderAdapter, recipientAdapter } from '@db/adapters/storeAdapters'
import type { AddressFields } from '@shared/config/constants'

export const addressService = {
  saveRecipient: async (address: AddressFields, id: string) => {
    await recipientAdapter.addUniqueRecord({ address, id })
  },

  saveSender: async (address: AddressFields, id: string) => {
    await senderAdapter.addUniqueRecord({ address, id })
  },
}
