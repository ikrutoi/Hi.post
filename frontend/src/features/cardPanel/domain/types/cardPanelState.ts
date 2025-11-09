import type { RefObject } from 'react'

export interface CardPanelState {
  activeSection: string | null
  expendMemoryCard: any
  lockExpendMemoryCard: boolean
  choiceSave: any
  selectedTemplate: any
  maxCardsList: any
  sizeMiniCard: any
  choiceSection: any
  buttonsFullCard: {
    fullCard: {
      addCart: boolean
      addDrafts: boolean
      remove: boolean
    }
  }
  setButtonsFullCard: React.Dispatch<any>
  memoryCardtext: { cardtext: any }
  setMemoryCardtext: React.Dispatch<any>
  minimize: boolean
  setMinimize: React.Dispatch<React.SetStateAction<boolean>>
  showIconsMinimize: boolean
  setShowIconsMinimize: React.Dispatch<React.SetStateAction<boolean>>
  fullCard: boolean
  setFullCardState: React.Dispatch<React.SetStateAction<boolean>>
  listActiveSections: { section: string; position: number; index: number }[]
  setListActiveSections: React.Dispatch<any>
  buttonIconRefs: RefObject<Record<string, HTMLButtonElement | null>>
  buttonArrowsRef: RefObject<HTMLButtonElement | null>
  miniPolyCardsRef: RefObject<HTMLDivElement | null>
}
