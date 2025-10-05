export type AromaImageIndex =
  | '00'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'

export interface AromaItem {
  make: string
  name: string
  index: AromaImageIndex
}

export type AromaState = {
  make: string | null
  name: string | null
  index: AromaImageIndex | null
}
