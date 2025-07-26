import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sizeCard: { height: null, width: null },
  sizeMiniCard: { height: null, width: null },
  remSize: null,
  choiceSection: { source: null, nameSection: null },
  indexDb: {
    hiPostImages: { originalImage: null, workingImage: null, miniImage: null },
    userImages: { originalImage: null, workingImage: null, miniImage: null },
  },
  choiceMemorySection: { section: null, id: null },
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
  expendMemoryCard: false,
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
    addSizeCard: (state, action) => {
      state.sizeCard = { ...state.sizeCard, ...action.payload }
    },
    addSizeMiniCard: (state, action) => {
      state.sizeMiniCard = { ...state.sizeMiniCard, ...action.payload }
    },
    addRemSize: (state, action) => {
      state.remSize = action.payload
    },
    addChoiceSection: (state, action) => {
      state.choiceSection = { ...state.choiceSection, ...action.payload }
    },
    addIndexDb: (state, action) => {
      state.indexDb.hiPostImages = {
        ...state.indexDb.hiPostImages,
        ...action.payload.hiPostImages,
      }
      state.indexDb.userImages = {
        ...state.indexDb.userImages,
        ...action.payload.userImages,
      }
    },
    addMemoryCrop: (state, action) => {
      state.memoryCrop = action.payload
    },
    setChoiceMemorySection: (state, action) => {
      state.choiceMemorySection = {
        ...state.choiceMemorySection,
        ...action.payload,
      }
    },
    setFullCardPersonalId: (state, action) => {
      state.fullCardPersonalId = {
        ...state.fullCardPersonalId,
        ...action.payload,
      }
    },
    setActiveSections: (state, action) => {
      state.activeSections = { ...state.activeSections, ...action.payload }
    },
    setDateShoppingCards: (state, action) => {
      state.dateShoppingCards = action.payload
    },
    setLockDateShoppingCards: (state, action) => {
      state.lockDateShoppingCards = action.payload
    },
    setShoppingCards: (state, action) => {
      state.shoppingCards = action.payload
    },
    setLockExpendMemoryCard: (state, action) => {
      state.lockExpendMemoryCard = action.payload
    },
    setChoiceSave: (state, action) => {
      state.choiceSave = action.payload
    },
    setChoiceClip: (state, action) => {
      state.choiceClip = action.payload
    },
    setSliderLetter: (state, action) => {
      state.sliderLetter = action.payload
    },
    setSliderLine: (state, action) => {
      state.sliderLine = action.payload
    },
    setDeltaEnd: (state, action) => {
      state.deltaEnd = action.payload
    },
    setSelectedSection: (state, action) => {
      state.selectedSection = action.payload
    },
    setDeleteSection: (state, action) => {
      state.deleteSection = action.payload
    },
    setPersonalId: (state, action) => {
      state.personalId = action.payload
    },
    setFullCard: (state, action) => {
      state.fullCard = action.payload
    },
    setAddFullCard: (state, action) => {
      state.addFullCard = action.payload
    },
    setExpendMemoryCard: (state, action) => {
      state.expendMemoryCard = action.payload
    },
    setMaxCardsList: (state, action) => {
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
