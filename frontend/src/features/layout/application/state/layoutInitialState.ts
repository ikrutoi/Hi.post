import type { LayoutState } from '../../domain/layoutTypes'

export const layoutInitialState: LayoutState = {
  size: {
    sizeCard: { width: 0, height: 0 },
    sizeMiniCard: { width: 0, height: 0 },
    remSize: null,
  },

  memory: {
    memoryCrop: null,
    choiceMemorySection: {},
    expendMemoryCard: null,
    lockExpendMemoryCard: false,
  },

  meta: {
    fullCard: false,
    addFullCard: false,
    selectedCard: false,
    maxCardsList: null,
    sliderLetter: null,
    sliderLine: null,
    deltaEnd: null,
    personalId: null,
    fullCardPersonalId: {},
    currentDate: null,
    cartCards: null,
    dateCartCards: null,
    lockDateCartCards: null,
    choiceClip: null,
  },

  toolbar: {
    btnToolbar: {
      firstBtn: '',
      secondBtn: '',
      section: '',
    },
    choiceSave: null,
    choiceClip: null,
  },

  status: {
    isLoading: false,
    error: null,
  },

  ui: {
    theme: 'light',
    layoutMode: 'default',
  },

  buttons: {
    isVisible: true,
    isLocked: false,
  },

  section: {
    selectedSection: null,
    choiceSection: {},
    deleteSection: null,
    activeSections: {},
  },

  active: {
    sections: {},
  },

  image: {
    indexDb: {
      stockImages: {},
      userImages: {},
    },
  },
}
