import type { SizeCard } from '@layout/domain/types'
import type { CardSection } from '@entities/card/domain/types'

export interface SectionInfo {
  i: number
  section: {
    section: string
    index: number
  }
}

// export interface MiniCardRenderProps {
//   section: string
//   valueSection: any
//   sizeMiniCard: { width: number; height: number }
//   ref: HTMLDivElement | null
// }
