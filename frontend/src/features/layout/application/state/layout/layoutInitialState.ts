import {
  Size,
  SectionChoice,
  ImageSet,
  FullCardPersonalId,
  BtnToolbar,
  MemorySection,
  ActiveSections,
  MemoryCardInfo,
} from '../../../domain/model/layoutTypes'

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

const createEmptyImageSet = (): ImageSet => ({
  originalImage: false,
  workingImage: false,
  miniImage: false,
})

export const initialState: LayoutState = {
  sizeCard: { height: null, width: null },
  sizeMiniCard: { height: null, width: null },
  remSize: null,
  choiceSection: { source: null, nameSection: null },
  indexDb: {
    stockImages: createEmptyImageSet(),
    userImages: createEmptyImageSet(),
  },
  btnToolbar: { firstBtn: null, secondBtn: null, section: null },
  choiceMemorySection: { section: null, id: null },
  expendMemoryCard: null,
  choiceSave: null,
  choiceClip: null,
  deleteSection: null,
  selectedSection: null,
  activeSections: {
    cardphoto: false,
    cardtext: false,
    envelope: false,
    date: false,
    aroma: false,
  },
  memoryCrop: null,
  currentDate: null,
  fullCard: false,
  fullCardPersonalId: { cart: null, drafts: null },
  addFullCard: false,
  selectedCard: false,
  maxCardsList: null,
  sliderLetter: null,
  sliderLine: null,
  deltaEnd: null,
  personalId: null,
  lockExpendMemoryCard: true,
  cartCards: null,
  dateCartCards: null,
  lockDateCartCards: null,
}
