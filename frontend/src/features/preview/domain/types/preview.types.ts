import type { CartItem } from '@entities/cart/domain/types'
import type { SizeCard } from '@layout/domain/types'

export type UseCardphotoPreviewOptions = {
  items: CartItem[]
  size?: SizeCard
  onPreviewReady?: (updated: CartItem) => void
}
