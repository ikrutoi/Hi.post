import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './ImageCrop.scss'

import { ImageMeta, CropRect, MousePosition } from '@features/cardphotoLegacy/types'
import { RootState } from '@app/store/store'
import { CARDPHOTO_ASPECT_RATIO } from '@features/cardphotoLegacy/config'
import { applyClipMask } from '@features/cardphotoLegacy/utils'
import {
  performDragInteraction,
  endDragInteraction,
  startDragInteraction,
  startResizeInteraction,
} from '@features/cardphotoLegacy/utils'
import {
  handleDownload,
  handleSave,
  handleDelete,
  handleCrop,
  handleMaximaze,
  handleFileChange,
} from '@features/cardphotoLegacy/utils'
// import { fetchImageDimensions } from '@cardphoto/utils/imageUtils'

import { ImageCropProps } from '@features/cardphotoLegacy/types'

const ImageCrop: React.FC<ImageCropProps> = ({ sizeCard }) => {
  const dispatch = useDispatch()

  const infoBtnsCardphotoClick = useSelector(
    (state: RootState) => state.infoButtons.cardphotoClick
  )
  const layoutMemoryCrop = useSelector(
    (state: RootState) => state.layout.memoryCrop
  )
  const layoutIndexDb = useSelector((state: RootState) => state.layout.indexDb)
  const infoExpendStatusCard = useSelector(
    (state: RootState) => state.layout.setExpendMemoryCard
  )

  const [image, setImage] = useState<ImageMeta>({
    source: null,
    url: null,
    base: null,
  })

  const [scaleX, setScaleX] = useState<number>(1)
  const [scaleY, setScaleY] = useState<number>(1)
  const [crop, setCrop] = useState<CropRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isCropVisibly, setIsCropVisibly] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })

  const imgRef = useRef<HTMLImageElement>(null)
  const cropAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (layoutIndexDb) {
      dispatch({
        type: 'layout/setActiveSections',
        payload: {
          ...layoutIndexDb,
          cardphoto: Object.values(layoutIndexDb).some(
            (img) => !!img.miniImage
          ),
        },
      })
    }
  }, [layoutIndexDb])

  useEffect(() => {
    if (infoExpendStatusCard) {
      // fetchImages() — уже вынесено
    } else {
      const timer = setTimeout(() => {
        dispatch({ type: 'layout/setExpendMemoryCard', payload: false })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [infoExpendStatusCard])

  useEffect(() => {
    if (image.url) {
      applyClipMask(
        overlayRef.current,
        crop.x / scaleX,
        crop.y / scaleY,
        crop.width / scaleX,
        crop.height / scaleY
      )
    }
  }, [crop, image, scaleX, scaleY])

  useEffect(() => {
    const resetToolbar = () => {
      dispatch({
        type: 'infoButtons/updateButtonsState',
        payload: { cardphotoClick: null },
      })
    }

    switch (infoBtnsCardphotoClick) {
      case 'download':
        handleDownload(
          inputRef,
          image,
          isCropVisibly,
          setIsCropVisibly,
          dispatch
        )
        resetToolbar()
        break
      case 'save':
        handleSave(
          image,
          crop,
          sizeCard,
          scaleX,
          scaleY,
          setImage,
          setCrop,
          setIsCropVisibly,
          dispatch
        )
        resetToolbar()
        break
      case 'delete':
        handleDelete(image, isCropVisibly, setIsCropVisibly, dispatch)
        resetToolbar()
        break
      case 'crop':
        handleCrop(image, crop, isCropVisibly, setIsCropVisibly, dispatch)
        resetToolbar()
        break
      case 'maximaze':
        handleMaximaze(image, isCropVisibly)
        resetToolbar()
        break
      default:
        break
    }
  }, [infoBtnsCardphotoClick])

  return (
    <div
      className="image-crop"
      onMouseMove={(evt) =>
        performDragInteraction(
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
      onMouseUp={() => endDragInteraction(setIsDragging)}
      style={{
        width: `${sizeCard.width}px`,
        height: `${sizeCard.height}px`,
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(evt) =>
          handleFileChange(
            evt,
            sizeCard,
            CARDPHOTO_ASPECT_RATIO,
            layoutMemoryCrop,
            imgRef,
            setImage,
            setCrop,
            setScaleX,
            setScaleY,
            dispatch
          )
        }
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
                startDragInteraction(
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
                  startResizeInter@features/cardphoto/utils            setIsResizing,
                    crop,
                    scaleX,
                    scaleY,
                    CARDPHOTO_ASPECT_RATIO,
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
