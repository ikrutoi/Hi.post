import { CardSizeState } from './slices/cardSizeSlice'
import { ImageDbState } from './slices/imageDbSlice'
import { SectionState } from './slices/sectionSlice'
import { BtnToolbar } from './slices/toolbarSlice'
import { ActiveSections } from './slices/activeSectionsSlice'
import { MemoryState } from './slices/memorySlice'
import { CardState } from './slices/cardStateSlice'
import { SliderState } from './slices/sliderSlice'
import { CartState } from './slices/cartSlice'
import { PersonalState } from './slices/personalSlice'

export interface LayoutState {
  cardSize: CardSizeState
  imageDb: ImageDbState
  section: SectionState
  toolbar: BtnToolbar
  activeSections: ActiveSections
  memory: MemoryState
  cardState: CardState
  slider: SliderState
  cart: CartState
  personal: PersonalState
}
