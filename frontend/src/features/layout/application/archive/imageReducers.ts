import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  DraftLayoutState,
  ImageSet,
} from '../../domain/types/layout.types'

export const addIndexDb = (
  state: DraftLayoutState,
  action: PayloadAction<{
    stockImages?: Partial<ImageSet>
    userImages?: Partial<ImageSet>
  }>
) => {
  state.indexDb.stockImages = {
    ...state.indexDb.stockImages,
    ...action.payload.stockImages,
  }
  state.indexDb.userImages = {
    ...state.indexDb.userImages,
    ...action.payload.userImages,
  }
}
