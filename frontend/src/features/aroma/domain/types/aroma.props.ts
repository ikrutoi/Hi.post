import type { AromaItem } from '@entities/aroma/domain/types'

export interface AromaTileProps {
  selectedAroma: AromaItem | null
  elementAroma: AromaItem
  setSelectedAroma: (aroma: AromaItem) => void
  tileSize: { width: number; height: number } | null
}
