import type { AromaState, AromaItem } from '@entities/aroma/domain/types'

export interface AromaTileProps {
  selectedAroma: AromaItem | null
  aromaItem: AromaItem
  selectAroma: (selectedAroma: AromaItem) => void
  // tileSize: { width: number; height: number } | null
}
