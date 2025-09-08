import { Cart } from '../../domain/toolbarModel'

export interface ToolbarComponentProps {
  day: number
  cartDay: Cart
  handleImgCartClick: (
    evt: React.MouseEvent<HTMLImageElement>,
    day: number
  ) => void
  handleCellCartClick: () => void
  countCart: number | false | null
}
