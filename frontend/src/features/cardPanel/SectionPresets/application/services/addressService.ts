import {
  senderAddressAdapter,
  recipientAddressAdapter,
} from '@db/adapters/card'

import type { Address } from '@envelope/domain/types'

export const addressService = {
  saveRecipient: async (address: Address, personalId: string) => {
    await recipientAddressAdapter.addUniqueRecord({ address, personalId })
  },

  saveSender: async (address: Address, personalId: string) => {
    await senderAddressAdapter.addUniqueRecord({ address, personalId })
  },
}
