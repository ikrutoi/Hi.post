import React from 'react'
import { useEffect } from 'react'

import type { SizeCard } from '../../domain/model/types'
import { useImageCrop } from '../hooks/useImageCrop'

import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useCropInteraction } from '../hooks/useCropInteraction'
import { fetchInitialImage } from '../../application/useCases/fetchInitialImage'
import coverImage from '@data/img/card-photo-bw.jpg'

import { saveImage } from '../../application/useCases/saveImage'
import { deleteImage } from '../../application/useCases/deleteImage'
import { downloadImage } from '../../application/useCases/downloadImage'

interface ImageCropProps {
  sizeCard: SizeCard
}

export const ImageCrop: React.FC<ImageCropProps> = ({ sizeCard }) => {
  const dispatch = useAppDispatch()

  const {
    handleMouseDownDrag,
    handleMouseMoveDrag,
    handleMouseUpDrag,
    handleMouseDownResize,
    handleMouseMoveResize,
    handleMouseUpResize,
  } = useCropInteraction({
    imgRef,
    scaleX,
    scaleY,
    crop,
    setCrop,
    setIsDragging,
    setLastMousePosition,
    isResizing,
    setIsResizing,
  })

  const {
    image,
    setImage,
    fetchDimensions,
    crop,
    setCrop,
    scaleX,
    scaleY,
    imgRef,
    cropAreaRef,
    inputRef,
    overlayRef,
    isCropVisibly,
    setIsCropVisibly,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    lastMousePosition,
    setLastMousePosition,
  } = useImageCrop()

  useEffect(() => {
    if (image.url) {
      fetchDimensions(image.url, 'startCrop')
    }
  }, [image.url])

  useEffect(() => {
    fetchInitialImage(dispatch, setImage, fetchDimensions, coverImage)
  }, [])

  useEffect(() => {
    if (image.url && overlayRef.current) {
      const clipX = crop.x / scaleX
      const clipY = crop.y / scaleY
      const clipWidth = crop.width / scaleX
      const clipHeight = crop.height / scaleY

      overlayRef.current.style.clipPath = `polygon(
      ${clipX}px ${clipY}px,
      ${clipX + clipWidth}px ${clipY}px,
      ${clipX + clipWidth}px ${clipY + clipHeight}px,
      ${clipX}px ${clipY + clipHeight}px
    )`
    }
  }, [crop, scaleX, scaleY, image.url])

  // await saveImage({ image, crop, sizeCard, scaleX, scaleY, setImage, setCrop })
  // await deleteImage({ image, setImage })
  // downloadImage(image)

  const handleFileChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = evt.target.files?.[0]
    if (!file) return

    const blob = new Blob([file], { type: file.type })
    const blobUrl = URL.createObjectURL(blob)

    const adapter = createStoreAdapter('userImages')
    await adapter.add('originalImage', blob)

    setImage({
      base: 'userImages',
      source: 'originalImage',
      url: blobUrl,
    })

    fetchDimensions(blobUrl, 'startCrop')
    evt.target.value = ''
  }

  return (
    <div
      className="image-crop"
      style={{
        width: `${sizeCard.width}px`,
        height: `${sizeCard.height}px`,
      }}
      onMouseMove={(e) => {
        handleMouseMoveDrag(e, isDragging, lastMousePosition)
        handleMouseMoveResize(e, lastMousePosition)
      }}
      onMouseUp={() => {
        handleMouseUpDrag()
        handleMouseUpResize()
      }}
    >
      {isCropVisibly && <div className="overlay" ref={overlayRef} />}
      <div
        className="crop-area"
        style={{
          top: `${crop.y / scaleY}px`,
          left: `${crop.x / scaleX}px`,
          width: `${crop.width / scaleX}px`,
          height: `${crop.height / scaleY}px`,
        }}
        onMouseDown={handleMouseDownDrag}
      />
      <div className="crop-resize-handle" onMouseDown={handleMouseDownResize} />
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <button
        onClick={() => inputRef.current?.click()}
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
      >
        Upload image
      </button>
    </div>
  )
}
