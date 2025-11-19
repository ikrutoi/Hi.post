import type { CardEditor } from '@entities/card/domain/types'
import type { CartItemMeta } from '@entities/cart/domain/types'
import type { DraftsItemMeta } from '@entities/drafts/domain/types'

export interface CardPanelDb {
  // getAllCardtext(): Promise<void>
  // deleteCardtextById(id: string): Promise<void>
  saveCardToCart(
    localId: string,
    price: string,
    card: CardEditor,
    meta?: CartItemMeta
  ): Promise<void>
  saveCardToDrafts(
    localId: string,
    card: CardEditor,
    meta?: DraftsItemMeta
  ): Promise<void>
  deleteMiniImage(): Promise<void>
}
