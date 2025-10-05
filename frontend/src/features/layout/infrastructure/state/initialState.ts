import type { LayoutState } from '../../domain/types/layout.types'

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
    sliderLetterPayload: null,
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

  editor: {
    activeSection: null,
    selectedSection: null,
    deleteSection: null,
    choiceSection: {
      source: null,
      nameSection: null,
    },
    btnToolbar: {
      firstBtn: '',
      secondBtn: '',
      section: '',
    },
    choiceSave: null,
    choiceClip: null,
  },

  ui: {
    isLoading: false,
    error: null,
    buttonsVisible: true,
    buttonsLocked: false,
    theme: 'light',
    layoutMode: 'default',
  },

  image: {
    indexDb: {
      stockImages: {},
      userImages: {},
    },
  },
}
