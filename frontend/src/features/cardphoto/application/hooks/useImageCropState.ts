import { useRef, useState } from 'react'
import { initialCrop } from '../../domain/constants'
import type { CropArea, Position, LoadedImage } from '../../domain/typesLayout'

export const useImageCropState = () => {
  const [image, setImage] = useState<LoadedImage | null>(null)
  const [crop, setCrop] = useState<CropArea>(initialCrop)
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const [isCropVisibly, setIsCropVisibly] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState<Position>({
    x: 0,
    y: 0,
  })

  const refs = {
    inputRef: useRef<HTMLInputElement>(null),
    imgRef: useRef<HTMLImageElement>(null),
    overlayRef: useRef<HTMLDivElement>(null),
    cropAreaRef: useRef<HTMLDivElement>(null),
  }

  const handlers = {
    handleFileChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
      const file = evt.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setImage({
        url,
        source: file,
        store: 'userImages',
        role: 'workingImage',
      })

      setIsCropVisibly(true)
    },
  }

  return {
    image,
    crop,
    scaleX,
    scaleY,
    isCropVisibly,
    isDragging,
    isResizing,
    lastMousePosition,
    setCrop,
    setScaleX,
    setScaleY,
    setIsCropVisibly,
    setIsDragging,
    setIsResizing,
    setLastMousePosition,
    refs,
    handlers,
  }
}
