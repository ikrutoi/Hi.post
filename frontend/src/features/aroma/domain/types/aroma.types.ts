import type { AromaState, AromaItem } from '@entities/aroma/domain/types'

export interface AromaTileProps {
  selectedAroma: AromaItem | null
  aromaItem: AromaItem
  onSelectAroma: (selectedAroma: AromaItem) => void
}
