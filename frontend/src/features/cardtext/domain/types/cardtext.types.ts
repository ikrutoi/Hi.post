export interface CardtextBlock {
  type: string
  children: { text: string }[]
}

export interface MiniCardtextStyle {
  maxLines: number | null
  fontSize: number | null
  lineHeight: number | null
}

export interface CardtextState {
  text: CardtextBlock[]
  colorName: string
  colorType: string
  font: string
  fontSize: number
  fontStyle: string
  fontWeight: number
  textAlign: string
  lineHeight: number | null
  miniCardtextStyle: MiniCardtextStyle
}
