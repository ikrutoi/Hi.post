import type { Address } from '@envelope/domain/types'

import type { CartPostcard } from '@features/cart/publicApi'
import type { DraftPostcard } from '@features/drafts/publicApi'
import type { SentPostcard } from '@features/sent/publicApi'
import type { IndexedImage } from '@features/cardphoto/domain/image.types'

export interface StoreMap {
  stockImages: IndexedImage
  userImages: IndexedImage
  cardtext: { id: number; text: Node[] }
  senderAddress: {
    id: number
    address: Address
    personalId: string
  }
  recipientAddress: {
    id: number
    address: Address
    personalId: string
  }
  cart: CartPostcard
  drafts: DraftPostcard
  sent: SentPostcard
}
