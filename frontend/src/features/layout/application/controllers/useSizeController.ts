import React from 'react'
import { useAppDispatch } from '@app/hooks'
import {
  setSizeToolbarContour,
  setSizeCard,
  setSizeMiniCard,
  setRemSize,
  // setScale,
  setSectionMenuHeight,
  setViewportSize,
  setCardOrientation,
} from '../../infrastructure/state'
import type {
  SizeCard,
  ViewportSizeState,
  LayoutOrientation,
  SizeBox,
} from '../../domain/types'

export const useSizeController = () => {
  const dispatch = useAppDispatch()

  const handleSetSizeToolbarContour = React.useCallback(
    (payload: Partial<SizeBox>) => dispatch(setSizeToolbarContour(payload)),
    [dispatch],
  )

  const handleSetSizeCard = React.useCallback(
    (payload: Partial<SizeCard>) => dispatch(setSizeCard(payload)),
    [dispatch],
  )

  const handleSetSizeMiniCard = React.useCallback(
    (payload: Partial<SizeCard>) => dispatch(setSizeMiniCard(payload)),
    [dispatch],
  )

  const handleSetRemSize = React.useCallback(
    (value: number | null) => dispatch(setRemSize(value)),
    [dispatch],
  )

  // const handleSetScale = React.useCallback(
  //   (value: number | null) => dispatch(setScale(value)),
  //   [dispatch],
  // )

  const handleSetSectionMenuHeight = React.useCallback(
    (value: number | null) => dispatch(setSectionMenuHeight(value)),
    [dispatch],
  )

  const handleSetViewportSize = React.useCallback(
    (payload: Partial<ViewportSizeState>) => dispatch(setViewportSize(payload)),
    [dispatch],
  )

  const handleSetCardOrientation = React.useCallback(
    (orientation: LayoutOrientation, viewportHeight: number) =>
      dispatch(setCardOrientation({ orientation, viewportHeight })),
    [dispatch],
  )

  return {
    setSizeToolbarContour: handleSetSizeToolbarContour,
    setSizeCard: handleSetSizeCard,
    setSizeMiniCard: handleSetSizeMiniCard,
    setRemSize: handleSetRemSize,
    // setScale: handleSetScale,
    setCardOrientation: handleSetCardOrientation,
    setViewportSize: handleSetViewportSize,
    setSectionMenuHeight: handleSetSectionMenuHeight,
  }
}
