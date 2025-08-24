import { Cart } from '@features/cart/publicApi'

export interface ToolbarProps {
  day: number
  cartDay: Cart
  handleImgCartClick: (
    evt: React.MouseEvent<HTMLImageElement>,
    day: number
  ) => void
  handleCellCartClick: () => void
  countCart: number | false | null
}
