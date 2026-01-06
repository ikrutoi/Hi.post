import { useRef } from 'react'
import type { CropLayer } from '../../domain/types'

export const useInteractionState = (initial: CropLayer) => {
  const interactingRef = useRef(false)
  const lastCropRef = useRef<CropLayer>(initial)

  const begin = () => {
    interactingRef.current = true
  }
  const end = () => {
    interactingRef.current = false
  }
  const setLast = (crop: CropLayer) => {
    lastCropRef.current = crop
  }

  return {
    interactingRef,
    lastCropRef,
    begin,
    end,
    setLast,
  }
}
