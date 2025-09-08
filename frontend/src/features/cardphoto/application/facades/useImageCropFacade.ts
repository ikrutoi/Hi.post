import { useEffect, useRef, useState } from 'react'

import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'

import { updateCardphotoButtonsState } from '../store/cardphotoButtonsSlice'
import { setCardphotoButtonActive } from '../state/cardphotoActiveSlice'
import { addMemoryCrop } from '@features/layout/application/state/layout/layoutActions'

import { loadImageDimensions } from '@utils/images/loadImageDimensions'
import { centeringMaxCrop } from '@utils/images/centeringMaxCrop'
import { adjustImageSize } from '@utils/images/adjustImageSize'
import { updateClipPath } from '@utils/images/updateClipPath'
import { getCroppedImage } from '@utils/images/getCroppedImage'
import { base64ToBlob } from '../../domain/logic'
import {
  fetchIndexDbImages,
  saveImageToDb,
  deleteImageFromDb,
  fetchImageFromIndexedDb,
} from '../imageCropService'
import type { ImageCropState, CropArea, SizeCard } from '../../domain/image'

export const useImageCropFacade = (sizeCard: SizeCard) => {
  const dispatch = useAppDispatch()

  const cardphotoButtonActive = useAppSelector(
    (state) => state.cardphotoButtonActive.buttonActiveState
  )
  const layoutMemoryCrop = useAppSelector((state) => state.layout.memoryCrop)
  const layoutIndexDb = useAppSelector((state) => state.layout.indexDb)
  const layoutActiveSections = useAppSelector(
    (state) => state.layout.activeSections
  )
  const infoExpendStatusCard = useAppSelector(
    (state) => state.layout.expendMemoryCard
  )

  const [image, setImage] = useState<ImageCropState>({
    source: null,
    url: null,
    base: null,
  })

  const [scaleX, setScaleX] = useState<number>(1)
  const [scaleY, setScaleY] = useState<number>(1)
  const [crop, setCrop] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const [isCropVisibly, setIsCropVisibly] = useState<boolean>(false)
  const [lastMousePosition, setLastMousePosition] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isResizing, setIsResizing] = useState<boolean>(false)

  const aspectRatio = 142 / 100

  const imgRef = useRef<HTMLImageElement | null>(null)
  const cropAreaRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const fetchImageDimensions = async (src: string, modeCrop: string) => {
    try {
      const dimensions = await loadImageDimensions(src)
      const img = imgRef.current
      if (!img) return

      img.src = ''
      img.onload = () => {
        const { width, height } = adjustImageSize(
          img,
          sizeCard.width ?? 0,
          sizeCard.height ?? 0
        )
        img.style.width = `${width}px`
        img.style.height = `${height}px`

        const scaleX = dimensions.width / img.width
        const scaleY = dimensions.height / img.height
        setScaleX(scaleX)
        setScaleY(scaleY)

        if (layoutMemoryCrop) {
          setCrop(layoutMemoryCrop)
        } else {
          const valueCrop = centeringMaxCrop(dimensions, aspectRatio, modeCrop)
          setCrop(valueCrop)
        }
      }

      img.src = src
    } catch (err) {
      console.error('Error loading image:', err)
    }
  }

  const handleDownload = () => {
    if (inputRef.current) {
      if (isCropVisibly) {
        setIsCropVisibly(false)
        dispatch(updateCardphotoButtonsState({ crop: false }))
        fetchImageDimensions(image.url!, 'startCrop')
      }
      dispatch(addMemoryCrop(null))
      inputRef.current.click()
    }
  }

  const handleSave = async () => {
    if (!isCropVisibly || !image.url || !image.base) return

    const croppedImage = getCroppedImage(imgRef, crop, sizeCard, scaleX, scaleY)

    setImage({ source: 'workingImage', url: croppedImage, base: image.base })
    setCrop({
      x: 0,
      y: 0,
      width: sizeCard.width ?? 0,
      height: sizeCard.height ?? 0,
    })

    const blob = base64ToBlob(croppedImage, 'image/png')
    await saveImageToDb(image.base, 'workingImage', blob)
    await deleteImageFromDb(
      image.base === 'stockImages' ? 'userImages' : 'stockImages',
      'miniImage'
    )
    await saveImageToDb(image.base, 'miniImage', blob)
    await fetchIndexDbImages()

    fetchImageDimensions(croppedImage, 'startCrop')
    setIsCropVisibly(false)
    dispatch(updateCardphotoButtonsState({ crop: false }))
  }

  const handleDelete = async () => {
    if (isCropVisibly) {
      setIsCropVisibly(false)
      return
    }

    const { stockImages } = await fetchIndexDbImages()
    const isWorkingImage = stockImages.some((img) => img.id === 'workingImage')

    if (image.base === 'userImages') {
      if (image.source === 'workingImage') {
        await fetchImageFromIndexedDb('userImages', 'originalImage', setImage)
        await deleteImageFromDb('userImages', 'workingImage')
      } else {
        const fallback = isWorkingImage
          ? { base: 'stockImages', source: 'workingImage' }
          : { base: 'stockImages', source: 'originalImage' }
        await fetchImageFromIndexedDb(fallback.base, fallback.source, setImage)
        await deleteImageFromDb('userImages', 'originalImage')
      }
    }

    if (image.base === 'stockImages' && isWorkingImage) {
      await fetchImageFromIndexedDb('stockImages', 'originalImage', setImage)
      await deleteImageFromDb('stockImages', 'workingImage')
    }

    dispatch(updateCardphotoButtonsState({ crop: false }))
  }

  const handleCrop = () => {
    if (isCropVisibly) {
      dispatch(addMemoryCrop(crop))
      setIsCropVisibly(false)
      dispatch(updateCardphotoButtonsState({ crop: false }))
    } else {
      setIsCropVisibly(true)
      dispatch(updateCardphotoButtonsState({ crop: true }))
      fetchImageDimensions(image.url!, 'startCrop')
    }
  }

  const handleMaximaze = () => {
    if (isCropVisibly && image.url) {
      fetchImageDimensions(image.url, 'maxCrop')
    }
  }

  const handleFileChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (!file) return

    const blob = new Blob([file], { type: file.type })
    await saveImageToDb('userImages', 'originalImage', blob)
    await deleteImageFromDb('stockImages', 'workingImage')
    await fetchIndexDbImages()

    const blobUrl = URL.createObjectURL(blob)
    fetchImageDimensions(blobUrl, 'startCrop')
    setImage({
      source: 'originalImage',
      url: blobUrl,
      base: 'userImages',
    })
    evt.target.value = ''
  }

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
    const resetBtnToolbar = () => {
      dispatch(setCardphotoButtonActive(null))
    }

    switch (cardphotoButtonActive) {
      case 'download':
        handleDownload()
        resetBtnToolbar()
        break
      case 'save':
        handleSave()
        resetBtnToolbar()
        break
      case 'delete':
        handleDelete()
        resetBtnToolbar()
        break
      case 'crop':
        handleCrop()
        resetBtnToolbar()
        break
      case 'maximaze':
        handleMaximaze()
        resetBtnToolbar()
        break
    }
  }, [cardphotoButtonActive])

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
    setLastMousePosition,
    setIsDragging,
    setIsResizing,
    refs: {
      imgRef,
      cropAreaRef,
      inputRef,
      overlayRef,
    },
    handlers: {
      handleDownload,
      handleSave,
      handleDelete,
      handleCrop,
      handleMaximaze,
      handleFileChange,
    },
    fetchImageDimensions,
  }
}
