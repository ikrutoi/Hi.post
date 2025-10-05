import { cartAdapter } from '@db/adapters/cart'
import { draftsAdapter } from '@db/adapters/drafts'
import {
  stockImagesAdapter,
  userImagesAdapter,
  cardtextAdapter,
} from '@db/adapters/card'
import type { CardPanelDb, CardData } from '@cardPanel/domain/types'

export const useCardPanelDb = ({
  setMemoryCardtext,
}: {
  setMemoryCardtext: React.Dispatch<React.SetStateAction<{ cardtext: any }>>
}): CardPanelDb => {
  const getAllCardtext = async () => {
    const listCardtexts = await cardtextAdapter.getAll()
    setMemoryCardtext((state) => ({
      ...state,
      cardtext: listCardtexts,
    }))
  }

  const deleteCardtextById = async (id: string) => {
    await cardtextAdapter.deleteById(id)
    await getAllCardtext()
  }

  const saveCardToCart = async (cardData: CardData, personalId: string) => {
    await cartAdapter.addRecordWithId(personalId, cardData)
  }

  const saveCardToDrafts = async (cardData: any, personalId: string) => {
    await draftsAdapter.addRecordWithId(personalId, cardData)
  }

  const deleteMiniImage = async () => {
    await stockImagesAdapter.deleteById('miniImage')
    await userImagesAdapter.deleteById('miniImage')
  }

  return {
    getAllCardtext,
    deleteCardtextById,
    saveCardToCart,
    saveCardToDrafts,
    deleteMiniImage,
  }
}
