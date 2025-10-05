import { CardData } from './cardPanel.types'

export interface CardPanelDb {
  getAllCardtext(): Promise<void>
  deleteCardtextById(id: string): Promise<void>
  saveCardToCart(cardData: CardData, personalId: string): Promise<void>
  saveCardToDrafts(cardData: any, personalId: string): Promise<void>
  deleteMiniImage(): Promise<void>
}
