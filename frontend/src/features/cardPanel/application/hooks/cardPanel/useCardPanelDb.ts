import { cartAdapter, draftsAdapter } from '@db/adapters/storeAdapters'
import {
  cardtextTemplatesAdapter,
  stockImagesTemplatesAdapter,
  userImagesTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import type { CartItem } from '@entities/cart/domain/types'
import type { DraftsItem } from '@entities/drafts/domain/types'
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

  const deleteCardtextById = async (id: string) => {
    await cardtextTemplatesAdapter.deleteByLocalId(id)
    await getAllCardtext()
  }

  const saveCardToCart = async (cardData: CartItem, id: string) => {
    await cartAdapter.addRecordWithLocalId(id, cardData)
  }

  const saveCardToDrafts = async (cardData: DraftsItem, id: string) => {
    await draftsAdapter.addRecordWithLocalId(id, cardData)
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
