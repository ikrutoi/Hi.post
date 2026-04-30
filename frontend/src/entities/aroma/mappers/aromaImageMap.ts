import type { AromaSlot } from '../domain/types/aroma.types'
import { AROMA_IMAGES } from '../domain/types/aroma.types'

export const aromaImageMap: Record<AromaSlot, string> = AROMA_IMAGES

export const getAromaImage = (slot: AromaSlot): string => AROMA_IMAGES[slot]
