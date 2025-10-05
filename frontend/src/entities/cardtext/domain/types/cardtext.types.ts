export type CardtextBlock = {
  type: string
  children: { text: string }[]
}

export type MiniCardtextStyle = {
  maxLines: number | null
  fontSize: number | null
  lineHeight: number | null
}

export type CardtextState = {
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
