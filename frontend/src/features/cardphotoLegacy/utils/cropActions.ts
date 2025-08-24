import { Dispatch } from 'redux'
import { SizeCard } from '@shared/layout/model'
import { ImageMeta, CropRect } from '@cardphoto/types'
import { updateButtonsState } from '@store/slices/infoButtonsSlice'
import {
  addMemoryCrop,
  setExpendMemoryCard,
  setActiveSections,
} from '@store/slices/layoutSlice'
import {
  addHiPostImage,
  getHiPostImage,
  deleteHiPostImage,
  getAllHiPostImages,
  addUserImage,
  getUserImage,
  deleteUserImage,
  getAllUserImages,
} from '@shared/indexDb'
import { base64ToBlob } from '@shared/utils'
import { getCroppedImage } from '@shared/images'
import { fetchImageDimensions } from '@shared/images/loadImageDimensions'
import { checkIndexDb } from './checkIndexDb'
import { fetchImageFromIndexedDb } from './fetchImage'

export const handleDownload = (
  inputRef: React.RefObject<HTMLInputElement>,
  image: ImageMeta,
  isCropVisibly: boolean,
  setIsCropVisibly: (v: boolean) => void,
  dispatch: Dispatch
) => {
  if (!inputRef.current) return

  if (isCropVisibly) {
    setIsCropVisibly(false)
    dispatch(updateButtonsState({ crop: false }))
    fetchImageDimensions(image.url, 'startCrop')
  }

  dispatch(addMemoryCrop(null))
  inputRef.current.click()
}

export const handleSave = async (
  image: ImageMeta,
  crop: CropRect,
  sizeCard: SizeCard,
  scaleX: number,
  scaleY: number,
  setImage: (img: ImageMeta) => void,
  setCrop: (crop: CropRect) => void,
  setIsCropVisibly: (v: boolean) => void,
  dispatch: Dispatch
) => {
  const croppedImage = getCroppedImage(
    document.querySelector('img'),
    crop,
    sizeCard,
    scaleX,
    scaleY
  )

  const blob = base64ToBlob(croppedImage, 'image/png')
  const base = image.base
  const source = image.source

  const addFn = {
    hiPostImages: addHiPostImage,
    userImages: addUserImage,
  }[base]

  if (!addFn) return

  setImage({ source: 'workingImage', url: croppedImage, base })
  setCrop({
    x: 0,
    y: 0,
    width: sizeCard.width,
    height: sizeCard.height,
  })

  await addFn('workingImage', blob)

  if (base === 'hiPostImages') await deleteUserImage('miniImage')
  if (base === 'userImages') await deleteHiPostImage('miniImage')

  await addFn('miniImage', blob)
  await checkIndexDb(dispatch)

  fetchImageDimensions(croppedImage, 'startCrop')
  setIsCropVisibly(false)
  dispatch(updateButtonsState({ crop: false }))
}

export const handleDelete = async (
  image: ImageMeta,
  isCropVisibly: boolean,
  setIsCropVisibly: (v: boolean) => void,
  dispatch: Dispatch
) => {
  if (isCropVisibly) {
    setIsCropVisibly(false)
    return
  }

  let isWorkingImage
  try {
    const hiPostImages = await getAllHiPostImages()
    isWorkingImage = hiPostImages.find((img) => img.id === 'workingImage')
  } catch (error) {
    console.error('Error fetching hiPostImages:', error)
  }

  const base = image.base
  const source = image.source

  if (base === 'userImages') {
    if (source === 'workingImage') {
      await fetchImageFromIndexedDb(
        { base: 'userImages', source: 'originalImage' },
        dispatch
      )
      await deleteUserImage('workingImage')
      await checkIndexDb(dispatch)
    }
    if (source === 'originalImage') {
      if (isWorkingImage) {
        await fetchImageFromIndexedDb(
          { base: 'hiPostImages', source: 'workingImage' },
          dispatch
        )
      } else {
        dispatch(addMemoryCrop(null))
        await fetchImageFromIndexedDb(
          { base: 'hiPostImages', source: 'originalImage' },
          dispatch
        )
      }
      await deleteUserImage('originalImage')
      await checkIndexDb(dispatch)
    }
  }

  if (base === 'hiPostImages') {
    if (isWorkingImage) {
      await fetchImageFromIndexedDb(
        { base: 'hiPostImages', source: 'originalImage' },
        dispatch
      )
      await deleteHiPostImage('workingImage')
      await checkIndexDb(dispatch)
    }
  }

  dispatch(updateButtonsState({ crop: false }))
}

export const handleCrop = (
  image: ImageMeta,
  crop: CropRect,
  isCropVisibly: boolean,
  setIsCropVisibly: (v: boolean) => void,
  dispatch: Dispatch
) => {
  if (isCropVisibly) {
    dispatch(addMemoryCrop(crop))
    setIsCropVisibly(false)
    dispatch(updateButtonsState({ crop: false }))
  } else {
    setIsCropVisibly(true)
    dispatch(updateButtonsState({ crop: true }))
    fetchImageDimensions(image.url, 'startCrop')
  }
}

export const handleMaximaze = (image: ImageMeta, isCropVisibly: boolean) => {
  if (isCropVisibly) {
    fetchImageDimensions(image.url, 'maxCrop')
  }
}

export const handleFileChange = async (
  evt: React.ChangeEvent<HTMLInputElement>,
  sizeCard: SizeCard,
  aspectRatio: number,
  layoutMemoryCrop: CropRect | null,
  imgRef: React.RefObject<HTMLImageElement>,
  setImage: (img: ImageMeta) => void,
  setCrop: (crop: CropRect) => void,
  setScaleX: (x: number) => void,
  setScaleY: (y: number) => void,
  dispatch: Dispatch
) => {
  const file = evt.target.files?.[0]
  if (!file) return

  const blob = new Blob([file], { type: file.type })

  await addUserImage('originalImage', blob)
  await deleteHiPostImage('workingImage')
  await checkIndexDb(dispatch)

  const blobUrl = URL.createObjectURL(blob)
  await fetchImageDimensions(
    blobUrl,
    'startCrop',
    imgRef,
    sizeCard,
    layoutMemoryCrop,
    aspectRatio,
    setCrop,
    setScaleX,
    setScaleY
  )

  setImage({
    source: 'originalImage',
    url: blobUrl,
    base: 'userImages',
  })

  evt.target.value = ''
}
