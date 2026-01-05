import type { WritableDraft } from 'immer'
import type {
  Template,
  CardMenuSection,
  IconState,
} from '@shared/config/constants'
import type { ToolbarSection } from '@toolbar/domain/types'
import type { DispatchDate } from '@entities/date/domain/types'
import type { ViewportSize } from '@shared/config/constants'
import type { CardLayer } from '@cardphoto/domain/types'
// import type { LayoutOrientation } from '@cardphoto/domain/types'

export interface SliderLetter {
  letter: string
  id: string
  index: string
  // value: string
}

export interface SliderLetterPayload {
  index: number
  value: string
  id?: string
}

export interface CartCardsPayload {
  id: string
  date: string
  photo?: Blob
}

export interface FullCardPersonalId {
  cart: string | null
  drafts: string | null
}

export interface ButtonToolbar {
  firstBtn: string | null
  secondBtn: string | null
  section: string | null
}

export interface ChoiceSection {
  source: string | null
  section: CardMenuSection | null
}

export interface ChoiceMemorySection {
  section: CardMenuSection | null
  id: string | null
}

export interface MemoryCardInfo {
  id: string
  source: string
  timestamp: number
}

export interface ImageSet {
  originalImage: boolean
  workingImage: boolean
  miniImage: boolean
}

export type LayoutOrientation = 'portrait' | 'landscape'

// export type SizeCard = {
//   width: number
//   height: number
//   orientation: LayoutOrientation
// }

export type SizeCard = {
  width: number
  height: number
  aspectRatio: number
  orientation: LayoutOrientation
}

export type ViewportSizeState = {
  width: number
  height: number
  viewportSize: ViewportSize | null
}

export interface SizeState {
  sizeCard: CardLayer
  sizeMiniCard: SizeCard
  remSize: number | null
  viewportSize: ViewportSizeState
  scale: number | null
}

export interface MemoryState {
  memoryCrop: Blob | null
  // choiceMemorySection: Partial<ChoiceMemorySection>
  expendMemoryCard: MemoryCardInfo | null
  lockExpendMemoryCard: boolean
}

export interface MetaState {
  fullCard: boolean
  addFullCard: boolean
  selectedCard: boolean
  maxMiniCardsCount: number | null
  sliderLetter: SliderLetter | null
  sliderLetterPayload: SliderLetterPayload | null
  sliderLine: number | null
  deltaEnd: number | null
  personalId: string | null
  fullCardPersonalId: Partial<FullCardPersonalId>
  currentDate: string | null
  cartCards: CartCardsPayload | null
  dateCartCards: DispatchDate | null
  lockDateCartCards: boolean | null
  choiceClip: boolean
}

export interface SectionState {
  activeSection: ToolbarSection | null
  selectedSection: CardMenuSection | null
  deleteSection: string | null
  choiceSection: Partial<ChoiceSection>
  choiceMemorySection: ChoiceMemorySection
  buttonToolbar: ButtonToolbar
  choiceSave: string | null
  // choiceClip: string | null
}

export type TemplateState = Record<Template, IconState>

export interface UiState {
  selectedTemplate: Template | null
  selectedSection: CardMenuSection | null
  templateState: TemplateState

  isLoading: boolean
  error: string | null
  buttonsVisible: boolean
  buttonsLocked: boolean
  theme: 'light' | 'dark'
  layoutMode: 'default' | 'compact' | string
}

export interface ImageState {
  indexDb: {
    stockImages: Partial<ImageSet>
    userImages: Partial<ImageSet>
  }
}

export interface LayoutState {
  size: SizeState
  memory: MemoryState
  meta: MetaState
  section: SectionState
  ui: UiState
  image: ImageState
}

export type DraftLayoutState = WritableDraft<LayoutState>
