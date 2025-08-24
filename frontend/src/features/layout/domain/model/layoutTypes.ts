import type { WritableDraft } from 'immer'

export type Size = { width: number | null; height: number | null }

export type SectionChoice = {
  source: string | null
  nameSection: string | null
}

export interface ImageSet {
  originalImage: boolean
  workingImage: boolean
  miniImage: boolean
}

export interface FullCardPersonalId {
  cart: string | null
  drafts: string | null
}

export interface BtnToolbar {
  firstBtn: string | null
  secondBtn: string | null
  section: string | null
}

export interface MemorySection {
  section: string | null
  id: string | null
}

export interface ActiveSections {
  cardphoto: boolean
  cardtext: boolean
  envelope: boolean
  date: boolean
  aroma: boolean
}

export interface MemoryCardInfo {
  id: string
  section: string
  timestamp: number
}

export interface LayoutState {
  sizeCard: Size
  sizeMiniCard: Size
  remSize: number | null
  choiceSection: SectionChoice
  indexDb: {
    stockImages: ImageSet
    userImages: ImageSet
  }
  btnToolbar: BtnToolbar
  choiceMemorySection: MemorySection
  choiceSave: string | null
  choiceClip: string | null
  deleteSection: string | null
  selectedSection: string | null
  activeSections: ActiveSections
  memoryCrop: any
  currentDate: string | null
  fullCard: boolean
  addFullCard: boolean
  selectedCard: boolean
  expendMemoryCard: MemoryCardInfo | null
  maxCardsList: number | null
  sliderLetter: string | null
  sliderLine: string | null
  deltaEnd: number | null
  personalId: string | null
  lockExpendMemoryCard: boolean
  cartCards: any
  dateCartCards: any
  lockDateCartCards: any
  fullCardPersonalId: FullCardPersonalId
}

export type DraftLayoutState = WritableDraft<LayoutState>
