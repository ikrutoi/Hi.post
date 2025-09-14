import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './ImageCrop.scss'

import { useAppDispatch } from '@app/hooks/useAppDispatch'
import {
  getAllHiPostImages,
  getAllUserImages,
  getHiPostImage,
  getUserImage,
  addHiPostImage,
  deleteHiPostImage,
} from '@utils/cardFormNav/indexDB/indexDb'
import { checkIndexDb } from '@features/cardphotoLegacy/utils'
import {
  addIndexDb,
  setActiveSections,
  setExpendMemoryCard,
} from '@store/slices/layoutSlice'
import { updateButtonsState } from '@store/slices/infoButtonsSlice'
import coverImage from '@data/img/card-photo-bw.jpg'
import { updateClipPath } from '@utils/images/updateClipPath'
import { loadImageDimensions } from '@utils/images/loadImageDimensions'
import { adjustImageSize } from '@utils/images/adjustImageSize'
import {
  handleMouseMoveDrag,
  handleMouseUpDrag,
  handleMouseDownDrag,
  handleMouseDownResize,
} from '@utils/events'
import { fetchInitialImage } from './useCases/initImage'
import {
  handleDownload,
  handleSave,
  handleDelete,
  handleCrop,
  handleMaximaze,
  handleTurn,
} from './actions/imageCropActions'
import { centeringMaxCrop } from '@utils/images/centeringMaxCrop'
import type { RootState } from '@app/state/store'
import type {
  ImageBase,
  ImageSource,
  ImageState,
  CropRect,
  MousePosition,
  SizeCard,
} from './model/types'

interface ImageCropProps {
  sizeCard: SizeCard
}

const ImageCrop: React.FC<ImageCropProps> = ({ sizeCard }) => {
  const dispatch = useAppDispatch()

  const infoBtnsCardphotoClick = useSelector(
    (state: RootState) => state.infoButtons.cardphotoClick
  )
  const layoutMemoryCrop = useSelector(
    (state: RootState) => state.layout.memoryCrop
  )
  const layoutIndexDb = useSelector((state: RootState) => state.layout.indexDb)
  const layoutActiveSections = useSelector(
    (state: RootState) => state.layout.setActiveSections
  )
  const infoExpendStatusCard = useSelector(
    (state: RootState) => state.layout.setExpendMemoryCard
  )

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

  useEffect(() => {
    const hasMiniImage = Object.values(layoutIndexDb).some(
      (img) => !!img.miniImage
    )
    dispatch(
      setActiveSections({ ...layoutActiveSections, cardphoto: hasMiniImage })
    )
  }, [layoutIndexDb])

  useEffect(() => {
    if (infoExpendStatusCard) {
      fetchImages()
    } else {
      const timer = setTimeout(() => dispatch(setExpendMemoryCard(false)), 300)
      return () => clearTimeout(timer)
    }
  }, [infoExpendStatusCard])

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    fetchInitialImage(dispatch, setImage, fetchImageFromIndexedDb, coverImage)
  }, [])

  useEffect(() => {
    if (image.url) {
      updateClipPath(
        overlayRef.current,
        crop.x / scaleX,
        crop.y / scaleY,
        crop.width / scaleX,
        crop.height / scaleY
      )
    }
  }, [crop, image, scaleX, scaleY])

  useEffect(() => {
    const resetToolbar = () =>
      dispatch(updateButtonsState({ cardphotoClick: null }))

    switch (infoBtnsCardphotoClick) {
      case 'download':
        handleDownload({
          dispatch,
          image,
          inputRef,
          isCropVisibly,
          setIsCropVisibly,
        })
        resetToolbar()
        break
      case 'save':
        handleSave({
          dispatch,
          image,
          crop,
          sizeCard,
          scaleX,
          scaleY,
          setImage,
          setCrop,
          setIsCropVisibly,
        })
        resetToolbar()
        break
      case 'delete':
        handleDelete({ dispatch, image, setImage, setIsCropVisibly })
        resetToolbar()
        break
      case 'turn':
        handleTurn()
        resetToolbar()
        break
      case 'crop':
        handleCrop({ dispatch, crop, isCropVisibly, setIsCropVisibly })
        resetToolbar()
        break
      case 'maximaze':
        handleMaximaze({ image, isCropVisibly })
        resetToolbar()
        break
    }
  }, [infoBtnsCardphotoClick])

  const fetchImages = async () => {
    // логика загрузки изображений из IndexedDB
  }

  const handleFileChange = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = evt.target.files?.[0]
    if (!file) return
    const blob = new Blob([file], { type: file.type })
    await addUserImage('originalImage', blob)
    await deleteHiPostImage('workingImage')
    await checkIndexDb(dispatch)
    const blobUrl = URL.createObjectURL(blob)
    setImage({
      source: 'originalImage',
      url: blobUrl,
      base: 'userImages',
    })
    evt.target.value = ''
  }

  return (
    <div
      className="image-crop"
      onMouseMove={(evt) =>
        handleMouseMoveDrag(
          evt,
          isDragging,
          imgRef,
          scaleX,
          scaleY,
          lastMousePosition,
          crop,
          setCrop,
          setLastMousePosition
        )
      }
      onMouseUp={() => handleMouseUpDrag(setIsDragging)}
      style={{
        width: `${sizeCard.width}px`,
        height: `${sizeCard.height}px`,
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      {image.url && (
        <div className="crop-container">
          <img
            ref={imgRef}
            src={image.url}
            alt="Source"
            className="crop-image"
          />
          {isCropVisibly && <div className="overlay" ref={overlayRef} />}
          {isCropVisibly && (
            <div
              ref={cropAreaRef}
              className="crop-area"
              style={{
                top: `${crop.y / scaleX}px`,
                left: `${crop.x / scaleY}px`,
                width: `${crop.width / scaleX}px`,
                height: `${crop.height / scaleY}px`,
              }}
              onMouseDown={(e) =>
                handleMouseDownDrag(
                  e,
                  setIsDragging,
                  imgRef,
                  setLastMousePosition,
                  isResizing
                )
              }
            >
              <div
                className="crop-resize-handle"
                onMouseDown={(e) =>
                  handleMouseDownResize(
                    e,
                    setIsResizing,
                    crop,
                    scaleX,
                    scaleY,
                    aspectRatio,
                    imgRef,
                    setCrop
                  )
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageCrop
