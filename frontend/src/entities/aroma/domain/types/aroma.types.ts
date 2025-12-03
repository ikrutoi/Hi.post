export const aromaIndexes = [
  '00',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
] as const

export type AromaImageIndex = (typeof aromaIndexes)[number]

export interface AromaItem {
  make: string
  name: string
  index: AromaImageIndex
  category?: 'male' | 'female' | 'unisex'
}

export interface AromaState {
  selectedAroma: AromaItem | null
  isComplete: boolean
}
