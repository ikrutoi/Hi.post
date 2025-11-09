import type { CardItem } from '@entities/card/domain/types'
import type { CartItemMeta } from '@entities/cart/domain/types'
import type { DraftsItemMeta } from '@entities/drafts/domain/types'

export interface CardPanelDb {
  getAllCardtext(): Promise<void>
  deleteCardtextById(id: string): Promise<void>
  saveCardToCart(
    localId: string,
    price: string,
    card: CardItem,
    meta?: CartItemMeta
  ): Promise<void>
  saveCardToDrafts(
    localId: string,
    card: CardItem,
    meta?: DraftsItemMeta
  ): Promise<void>
  deleteMiniImage(): Promise<void>
}
