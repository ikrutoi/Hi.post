export interface PhotoMonetization {
  enabled: boolean
  pricePerUse?: number
  totalEarnings: number
  totalUses: number
}

export interface PhotoTemplateStats {
  views: number
  uses: number
  lastUsedAt?: number
}

export type TemplateVisibility = 'private' | 'public'

export interface PhotoUsageHistory {
  id: string
  photoId: string
  photoOwnerId: string
  cardId: string
  cardOwnerId: string
  tokensEarned: number
  usedAt: number
  paidAt?: number
}

export interface UserPhotoStats {
  userId: string
  totalPhotos: number
  publicPhotos: number
  totalEarnings: number
  totalUses: number
  photos: {
    photoId: string
    earnings: number
    uses: number
  }[]
}
