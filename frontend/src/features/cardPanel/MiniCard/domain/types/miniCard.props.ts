import type { SizeCard } from '@layout/domain/types'
import type { CardSection } from '@entities/card/domain/types'

export interface SectionInfo {
  i: number
  section: {
    section: string
    index: number
  }
}

export interface MiniCardProps {
  section: CardSection
  // valueSection: unknown
  // sizeMiniCard: SizeCard
  // infoSection: SectionInfo
  // minimize: boolean
  // infoMinimize: boolean
  // showIconMinimize: boolean
  // onClickSection?: (section: string, area: string) => void
}

export interface MiniCardRenderProps {
  section: string
  valueSection: any
  sizeMiniCard: { width: number; height: number }
  ref: HTMLDivElement | null
}
