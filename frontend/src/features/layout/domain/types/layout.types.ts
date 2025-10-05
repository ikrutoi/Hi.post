import type { WritableDraft } from 'immer'
import type { CardSectionName } from '@shared/types'
import type { DispatchDate } from '@entities/date/domain/types'

export type SizeCard = {
  width: number
  height: number
}

export interface SliderLetter {
  index: number
  value: string
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
  nameSection: string | null
}

export interface ChoiceMemorySection {
  section: CardSectionName | null
  id: string | null
}

export interface MemoryCardInfo {
  id: string
  section: string
  timestamp: number
}

export interface ImageSet {
  originalImage: boolean
  workingImage: boolean
  miniImage: boolean
}

export interface SizeState {
  sizeCard: SizeCard
  sizeMiniCard: SizeCard
  remSize: number | null
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
  maxCardsList: number | null
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
  activeSection: CardSectionName | null
  selectedSection: string | null
  deleteSection: string | null
  choiceSection: Partial<ChoiceSection>
  choiceMemorySection: Partial<ChoiceMemorySection>
  buttonToolbar: ButtonToolbar
  choiceSave: string | null
  // choiceClip: string | null
}

export interface UiState {
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
