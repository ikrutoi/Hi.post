import type { RefObject } from 'react'

export interface CardPanelState {
  selectorCardEdit: any
  selectorLayoutActiveSections: Record<string, boolean>
  selectorLayoutExpendMemoryCard: any
  selectorLayoutLockExpendMemoryCard: boolean
  selectorLayoutChoiceSave: any
  selectorLayoutChoiceClip: any
  selectorLayoutMaxCardsList: any
  selectorLayoutSizeMiniCard: any
  selectorLayoutChoiceSection: any
  selectorInfoEnvelopeSave: any

  btnsFullCard: {
    fullCard: {
      addCart: boolean
      save: boolean
      remove: boolean
    }
  }
  setBtnsFullCard: React.Dispatch<any>

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

  btnIconRefs: RefObject<Record<string, HTMLButtonElement | null>>
  btnArrowsRef: RefObject<HTMLButtonElement | null>
  miniPolyCardsRef: RefObject<HTMLDivElement | null>
}
