import type { CartPostcard } from '@features/cart/publicApi'
import type { DraftPostcard } from '@features/drafts/publicApi'
import type { SentPostcard } from '@features/sent/publicApi'

export interface StoreMap {
  stockImages: { id: number; image: Blob }
  userImages: { id: number; image: Blob }
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
