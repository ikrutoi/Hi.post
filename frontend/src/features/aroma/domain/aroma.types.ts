export interface AromaItem {
  id: string
  name: string
  description?: string
  intensity?: number
  imageUrl?: string
}

export interface AromaState {
  selected: AromaItem | null
}
