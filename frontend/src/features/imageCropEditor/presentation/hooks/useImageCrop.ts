// presentation/hooks/useImageCrop.ts
import { useState, useRef } from 'react'

import type {
  ImageState,
  CropRect,
  MousePosition,
  SizeCard,
} from '../../domain/model/types'
import { fetchImageDimensions } from '../../infrastructure/images/fetchImageDimensions'

export const useImageCrop = () => {
  const [image, setImage] = useState<ImageState>({
    source: null,
    url: null,
    base: null,
  })

  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)

  const [crop, setCrop] = useState<CropRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const [lastMousePosition, setLastMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isCropVisibly, setIsCropVisibly] = useState(false)

  const imgRef = useRef<HTMLImageElement | null>(null)
  const cropAreaRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const aspectRatio = 142 / 100

  const fetchDimensions = (
    src: string,
    modeCrop: 'startCrop' | 'maxCrop',
    memoryCrop?: CropRect | null
  ) => {
    if (!imgRef.current) return

    fetchImageDimensions({
      src,
      imgElement: imgRef.current,
      containerWidth: sizeCard.width,
      containerHeight: sizeCard.height,
      aspectRatio,
      memoryCrop,
      modeCrop,
      setScaleX,
      setScaleY,
      setCrop,
    })
  }

  return {
    image,
    setImage,
    scaleX,
    setScaleX,
    scaleY,
    setScaleY,
    crop,
    setCrop,
    lastMousePosition,
    setLastMousePosition,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    isCropVisibly,
    setIsCropVisibly,
    imgRef,
    cropAreaRef,
    inputRef,
    overlayRef,
    fetchDimensions,
  }
}
