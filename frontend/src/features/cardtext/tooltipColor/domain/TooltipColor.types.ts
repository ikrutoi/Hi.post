export interface TooltipColorProps {
  remSize: number
  styleLeft: number
  setBtnColor: (value: boolean) => void
  infoButtonsCardtext: Record<string, any>
  onSelectColor: (colorName: string, colorType: string) => void
}
