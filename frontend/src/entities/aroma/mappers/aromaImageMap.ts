import type { AromaImageIndex } from '../domain/types/aroma.types'
import { AROMA_IMAGES } from '../domain/types/aroma.types'

export const aromaImageMap: Partial<Record<AromaImageIndex, string>> =
  AROMA_IMAGES as Partial<Record<AromaImageIndex, string>>

export const getAromaImage = (index: string): string | undefined =>
  AROMA_IMAGES[index]
