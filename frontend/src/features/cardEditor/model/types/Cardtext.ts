export type Cardtext = {
  text: {
    type: string
    children: { text: string }[]
  }[]
  colorName: string
  colorType: string
  font: string
  fontSize: number
  fontStyle: string
  fontWeight: number
  textAlign: string
  lineHeight: number | null
  miniCardtextStyle: {
    maxLines: number | null
    fontSize: number | null
    lineHeight: number | null
  }
}
