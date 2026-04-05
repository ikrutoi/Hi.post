import type { Postcard } from '@entities/cart/domain/types'
import type { SizeCard } from '@layout/domain/types'

export type UseCardphotoPreviewOptions = {
  items: Postcard[]
  size?: SizeCard
  onPreviewReady?: (updated: Postcard) => void
}
