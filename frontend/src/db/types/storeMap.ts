import type { CartPostcard } from '@features/cart/publicApi'
import type { DraftPostcard } from '@features/drafts/publicApi'
import type { SentPostcard } from '@features/sent/publicApi'
import type { IndexedImage } from '@features/cardphoto/domain/image.types'

export interface StoreMap {
  stockImages: IndexedImage
  userImages: IndexedImage
  cardtext: { id: number; text: Record<string, string> }
  senderAddress: {
    id: number
    address: Record<string, unknown>
    personalId: number
  }
  recipientAddress: {
    id: number
    address: Record<string, unknown>
    personalId: number
  }
  cart: CartPostcard
  drafts: DraftPostcard
  sent: SentPostcard
}
