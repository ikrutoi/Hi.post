import type { PostcardHydrated } from '@entities/postcard'
import type { SizeCard } from '@layout/domain/types'

export type UseCardphotoPreviewOptions = {
  items: PostcardHydrated[]
  size?: SizeCard
  onPreviewReady?: (updated: PostcardHydrated) => void
}
