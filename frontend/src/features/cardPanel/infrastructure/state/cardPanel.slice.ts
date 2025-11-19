import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CardPanelState,
  CardPanelSource,
  CardPanelSection,
  CardPanelTemplate,
  CardPanelTemplateItem,
} from '../../domain/types'

const initialState: CardPanelState = {
  source: 'sections',
  isPacked: false,
  activeSection: null,
  activeTemplate: null,
  templateList: [],
  scrollIndex: 0,
  valueScroll: 0,
}

export const cardPanelSlice = createSlice({
  name: 'cardPanel',
  initialState,
  reducers: {
    setSource(state, action: PayloadAction<CardPanelSource>) {
      state.source = action.payload
    },
    setPacked(state, action: PayloadAction<boolean>) {
      state.isPacked = action.payload
    },
    setActiveSection(state, action: PayloadAction<CardPanelSection | null>) {
      state.activeSection = action.payload
    },
    setActiveTemplate(state, action: PayloadAction<CardPanelTemplate | null>) {
      state.activeTemplate = action.payload
    },
    setTemplateList(state, action: PayloadAction<CardPanelTemplateItem[]>) {
      state.templateList = action.payload
    },
    setScrollIndex(state, action: PayloadAction<number>) {
      state.scrollIndex = action.payload
    },
    setValueScroll(state, action: PayloadAction<number>) {
      state.valueScroll = action.payload
    },
    resetToSections(state) {
      state.source = 'sections'
      state.activeTemplate = null
      state.templateList = []
      state.scrollIndex = 0
      state.valueScroll = 0
    },
  },
})

export const {
  setSource,
  setPacked,
  setActiveSection,
  setActiveTemplate,
  setTemplateList,
  setScrollIndex,
  setValueScroll,
  resetToSections,
} = cardPanelSlice.actions

export default cardPanelSlice.reducer
