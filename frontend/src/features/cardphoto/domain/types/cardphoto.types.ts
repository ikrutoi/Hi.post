export interface CardphotoToolbarState {
  download: boolean
  save: boolean
  delete: boolean
  turn: boolean
  maximize: boolean
  crop: boolean
}

export interface CardphotoActiveState {
  activeState: string | undefined | null
}

export interface CardphotoState {
  url: string | null
  source: string | null
}
