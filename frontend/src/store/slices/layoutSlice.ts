import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Size = { width: number | null; height: number | null }
type ImageSet = {
  originalImage: string | null
  workingImage: string | null
  miniImage: string | null
}
type ActiveSections = {
  cardphoto: boolean
  cardtext: boolean
  envelope: boolean
  date: boolean
  aroma: boolean
}
type SectionChoice = { source: string | null; nameSection: string | null }
type MemorySection = { section: string | null; id: string | null }
type FullCardPersonalId = { shopping: string | null; blanks: string | null }
type BtnToolbar = {
  firstBtn: string | null
  secondBtn: string | null
  section: string | null
}
type MemoryCardInfo = {
  source: 'sender' | 'recipient'
  id: number | string
}

type LayoutState = {
  fullCardPersonalId: FullCardPersonalId
  sizeCard: Size
  sizeMiniCard: Size
  remSize: number | null
  choiceSection: SectionChoice
  indexDb: {
    hiPostImages: ImageSet
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
  shoppingCards: any
  dateShoppingCards: any
  lockDateShoppingCards: any
}

const initialState: LayoutState = {
  sizeCard: { height: null, width: null },
  sizeMiniCard: { height: null, width: null },
  remSize: null,
  choiceSection: { source: null, nameSection: null },
  indexDb: {
    hiPostImages: { originalImage: null, workingImage: null, miniImage: null },
    userImages: { originalImage: null, workingImage: null, miniImage: null },
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
  fullCardPersonalId: { shopping: null, blanks: null },
  addFullCard: false,
  selectedCard: false,
  maxCardsList: null,
  sliderLetter: null,
  sliderLine: null,
  deltaEnd: null,
  personalId: null,
  lockExpendMemoryCard: true,
  shoppingCards: null,
  dateShoppingCards: null,
  lockDateShoppingCards: null,
}

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    addSizeCard: (state, action: PayloadAction<Partial<Size>>) => {
      state.sizeCard = { ...state.sizeCard, ...action.payload }
    },
    addSizeMiniCard: (state, action: PayloadAction<Partial<Size>>) => {
      state.sizeMiniCard = { ...state.sizeMiniCard, ...action.payload }
    },
    addRemSize: (state, action: PayloadAction<number | null>) => {
      state.remSize = action.payload
    },
    addChoiceSection: (
      state,
      action: PayloadAction<Partial<SectionChoice>>
    ) => {
      state.choiceSection = { ...state.choiceSection, ...action.payload }
    },
    addIndexDb: (
      state,
      action: PayloadAction<{
        hiPostImages?: Partial<ImageSet>
        userImages?: Partial<ImageSet>
      }>
    ) => {
      state.indexDb.hiPostImages = {
        ...state.indexDb.hiPostImages,
        ...action.payload.hiPostImages,
      }
      state.indexDb.userImages = {
        ...state.indexDb.userImages,
        ...action.payload.userImages,
      }
    },
    addMemoryCrop: (state, action: PayloadAction<any>) => {
      state.memoryCrop = action.payload
    },
    setChoiceMemorySection: (
      state,
      action: PayloadAction<Partial<MemorySection>>
    ) => {
      state.choiceMemorySection = {
        ...state.choiceMemorySection,
        ...action.payload,
      }
    },
    setFullCardPersonalId: (
      state,
      action: PayloadAction<Partial<FullCardPersonalId>>
    ) => {
      state.fullCardPersonalId = {
        ...state.fullCardPersonalId,
        ...action.payload,
      }
    },
    setBtnToolbar: (state, action: PayloadAction<Partial<BtnToolbar>>) => {
      state.btnToolbar = {
        ...state.btnToolbar,
        ...action.payload,
      }
    },
    setActiveSections: (
      state,
      action: PayloadAction<Partial<ActiveSections>>
    ) => {
      state.activeSections = { ...state.activeSections, ...action.payload }
    },
    setDateShoppingCards: (state, action: PayloadAction<any>) => {
      state.dateShoppingCards = action.payload
    },
    setLockDateShoppingCards: (state, action: PayloadAction<any>) => {
      state.lockDateShoppingCards = action.payload
    },
    setShoppingCards: (state, action: PayloadAction<any>) => {
      state.shoppingCards = action.payload
    },
    setLockExpendMemoryCard: (state, action: PayloadAction<boolean>) => {
      state.lockExpendMemoryCard = action.payload
    },
    setChoiceSave: (state, action: PayloadAction<string | null>) => {
      state.choiceSave = action.payload
    },
    setChoiceClip: (state, action: PayloadAction<string | null>) => {
      state.choiceClip = action.payload
    },
    setSliderLetter: (state, action: PayloadAction<string | null>) => {
      state.sliderLetter = action.payload
    },
    setSliderLine: (state, action: PayloadAction<string | null>) => {
      state.sliderLine = action.payload
    },
    setDeltaEnd: (state, action: PayloadAction<number | null>) => {
      state.deltaEnd = action.payload
    },
    setSelectedSection: (state, action: PayloadAction<string | null>) => {
      state.selectedSection = action.payload
    },
    setDeleteSection: (state, action: PayloadAction<string | null>) => {
      state.deleteSection = action.payload
    },
    setPersonalId: (state, action: PayloadAction<string | null>) => {
      state.personalId = action.payload
    },
    setFullCard: (state, action: PayloadAction<boolean>) => {
      state.fullCard = action.payload
    },
    setAddFullCard: (state, action: PayloadAction<boolean>) => {
      state.addFullCard = action.payload
    },
    setExpendMemoryCard: (
      state,
      action: PayloadAction<MemoryCardInfo | null>
    ) => {
      state.expendMemoryCard = action.payload
    },
    setMaxCardsList: (state, action: PayloadAction<number | null>) => {
      state.maxCardsList = action.payload
    },
  },
})

export const {
  addSizeCard,
  addSizeMiniCard,
  addRemSize,
  addChoiceSection,
  addIndexDb,
  addMemoryCrop,
  setChoiceMemorySection,
  setFullCardPersonalId,
  setBtnToolbar,
  setActiveSections,
  setDateShoppingCards,
  setLockDateShoppingCards,
  setShoppingCards,
  setLockExpendMemoryCard,
  setChoiceSave,
  setChoiceClip,
  setSliderLetter,
  setSliderLine,
  setDeltaEnd,
  setSelectedSection,
  setDeleteSection,
  setPersonalId,
  setFullCard,
  setAddFullCard,
  setExpendMemoryCard,
  setMaxCardsList,
} = layoutSlice.actions

export default layoutSlice.reducer
