import type { WritableDraft } from 'immer'

export type SizeCard = { width: number | null; height: number | null }

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
  size: {
    sizeCard: SizeCard
    sizeMiniCard: SizeCard
    remSize: number | null
  }

  memory: {
    memoryCrop: any
    choiceMemorySection: Partial<MemorySection>
    expendMemoryCard: MemoryCardInfo | null
    lockExpendMemoryCard: boolean
  }

  meta: {
    fullCard: boolean
    addFullCard: boolean
    selectedCard: boolean
    maxCardsList: number | null
    sliderLetter: string | null
    sliderLine: string | null
    deltaEnd: number | null
    personalId: string | null
    fullCardPersonalId: Partial<FullCardPersonalId>
    currentDate: string | null
    cartCards: any
    dateCartCards: any
    lockDateCartCards: any
    choiceClip: string | null
  }

  toolbar: {
    btnToolbar: BtnToolbar
    choiceSave: string | null
    choiceClip: string | null
  }

  status: {
    isLoading: boolean
    error: string | null
  }

  ui: {
    theme: 'light' | 'dark'
    layoutMode: 'default' | 'compact' | string
  }

  buttons: {
    isVisible: boolean
    isLocked: boolean
  }

  section: {
    selectedSection: string | null
    choiceSection: Partial<SectionChoice>
    deleteSection: string | null
    activeSections: Record<string, boolean>
  }

  activeSection: {
    sections: Record<string, boolean>
  }

  image: {
    indexDb: {
      stockImages: Partial<ImageSet>
      userImages: Partial<ImageSet>
    }
  }
}

export type DraftLayoutState = WritableDraft<LayoutState>
