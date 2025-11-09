import { cartAdapter, draftsAdapter } from '@db/adapters/storeAdapters'
import {
  cardtextTemplatesAdapter,
  stockImagesTemplatesAdapter,
  userImagesTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type { CardItem } from '@entities/card/domain/types'
import type { CartItem, CartItemMeta } from '@entities/cart/domain/types'
import type { DraftsItem, DraftsItemMeta } from '@entities/drafts/domain/types'
import type { CardPanelDb } from '@cardPanel/domain/types'

export const useCardPanelDb = ({
  setMemoryCardtext,
}: {
  setMemoryCardtext: React.Dispatch<React.SetStateAction<{ cardtext: any }>>
}): CardPanelDb => {
  const getAllCardtext = async () => {
    const listCardtexts = await cardtextTemplatesAdapter.getAll()
    setMemoryCardtext((state) => ({
      ...state,
      cardtext: listCardtexts,
    }))
  }

  const deleteCardtextById = async (localId: string) => {
    await cardtextTemplatesAdapter.deleteByLocalId(localId)
    await getAllCardtext()
  }

  const saveCardToCart = async (
    localId: string,
    price: string,
    card: CardItem,
    meta?: CartItemMeta
  ) => {
    const cartItem: CartItem = {
      LocalId: Number(localId),
      price,
      card,
      meta,
    }
    await cartAdapter.addRecordWithLocalId(localId, cartItem)
  }

  const saveCardToDrafts = async (
    localId: string,
    card: CardItem,
    meta?: DraftsItemMeta
  ) => {
    const draftsItem: DraftsItem = {
      LocalId: Number(localId),
      card,
      meta,
    }
    await draftsAdapter.addRecordWithLocalId(localId, draftsItem)
  }

  const deleteMiniImage = async () => {
    await stockImagesTemplatesAdapter.deleteByLocalId('miniImage')
    await userImagesTemplatesAdapter.deleteByLocalId('miniImage')
  }

  return {
    getAllCardtext,
    deleteCardtextById,
    saveCardToCart,
    saveCardToDrafts,
    deleteMiniImage,
  }
}
