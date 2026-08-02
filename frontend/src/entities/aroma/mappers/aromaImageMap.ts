import type { AromaSlot } from '../domain/types/aroma.types'
import { AROMA_IMAGES, AROMA_IMAGES_THUMB } from '../domain/types/aroma.types'

export const aromaImageMap: Record<AromaSlot, string> = AROMA_IMAGES

/** Full — сетка / section peek. */
export const getAromaImage = (slot: AromaSlot): string => AROMA_IMAGES[slot]

/** Thumb — CardPie / mini-сектор. */
export const getAromaImageThumb = (slot: AromaSlot): string =>
  AROMA_IMAGES_THUMB[slot]
