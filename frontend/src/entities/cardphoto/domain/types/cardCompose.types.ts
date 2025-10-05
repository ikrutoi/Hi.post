export type CardphotoState = {
  url: string | null
  source: string | null
  ui: {
    download: boolean
    save: boolean
    delete: boolean
    turn: boolean
    maximize: boolean
    crop: boolean
    click: boolean | null
  }
}
