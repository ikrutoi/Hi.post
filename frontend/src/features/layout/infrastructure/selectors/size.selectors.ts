import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@app/state'
import type {
  LayoutOrientation,
  SizeBox,
  SizeCard,
  ViewportSizeState,
} from '../../domain/types'

const selectLayoutSize = (state: RootState) => state.layout.size

export const selectSizeToolbarContour = (state: RootState): SizeBox =>
  selectLayoutSize(state).sizeToolbarContour

export const selectSizeCard = (state: RootState): SizeCard =>
  selectLayoutSize(state).sizeCard

export const selectSizeMiniCard = (state: RootState): SizeCard =>
  selectLayoutSize(state).sizeMiniCard

export const selectRemSize = (state: RootState) =>
  selectLayoutSize(state).remSize

// export const selectSizeItemCalendar = (state: RootState): SizeBox =>
//   selectLayoutSize(state).sizeItemCalendar

export const selectSizeItemCalendar = createSelector(
  [selectSizeCard],
  (sizeCard): SizeBox => {
    const baseHeight = sizeCard.height
    const side = baseHeight / 10

    return {
      width: side,
      height: side,
    }
  },
)

export const selectSizeItemAroma = createSelector(
  [selectSizeCard, selectRemSize],
  (sizeCard, remSize): SizeBox => {
    const baseHeight = sizeCard.height
    const side = (baseHeight - 3 * remSize) / 4

    return {
      width: side,
      height: side,
    }
  },
)

// export const selectScale = (state: RootState) => selectLayoutSize(state).scale

export const selectSectionMenuHeight = (state: RootState) =>
  selectLayoutSize(state).sectionMenuHeight

export const selectViewportSize = (state: RootState): ViewportSizeState =>
  selectLayoutSize(state).viewportSize

export const selectCardOrientation = (state: RootState): LayoutOrientation =>
  selectLayoutSize(state).sizeCard.orientation ?? 'landscape'

export const selectIsPortrait = createSelector(
  [selectCardOrientation],
  (orientation) => orientation === 'portrait',
)

export const selectIsLandscape = createSelector(
  [selectCardOrientation],
  (orientation) => orientation === 'landscape',
)

export const selectCardDimensions = createSelector(
  [selectSizeCard],
  (sizeCard) => ({
    width: sizeCard?.width ?? 0,
    height: sizeCard?.height ?? 0,
    orientation: sizeCard?.orientation ?? 'landscape',
  }),
)

export const selectMiniCardDimensions = createSelector(
  [selectSizeMiniCard],
  (sizeMiniCard) => ({
    width: sizeMiniCard?.width ?? 0,
    height: sizeMiniCard?.height ?? 0,
    orientation: sizeMiniCard?.orientation ?? 'landscape',
  }),
)
