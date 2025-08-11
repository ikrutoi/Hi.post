export interface StoreMap {
  assetStockImages: { id: number; image: Blob }
  assetUserImages: { id: number; image: Blob }
  assetCardtext: { id: number; text: Record<string, string> }
  assetSenderAddress: {
    id: number
    address: Record<string, unknown>
    personalId: number
  }
  assetRecipientAddress: {
    id: number
    address: Record<string, unknown>
    personalId: number
  }
  postcardDrafts: {
    id: number
    blanks: Record<string, unknown>
    personalId: number
  }
  postcardCart: {
    id: number
    shopping: Record<string, unknown>
    personalId: number
  }
}
