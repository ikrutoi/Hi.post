import {
  updateButtonsState,
  addMemoryCrop,
} from '@store/slices/infoButtonsSlice'
import {
  addUserImage,
  addHiPostImage,
  deleteHiPostImage,
  deleteUserImage,
} from '@utils/cardFormNav/indexDB/indexDb'
import { getCroppedImage } from '@utils/images/getCroppedImage'
import { loadImageDimensions } from '@utils/images/loadImageDimensions'
import { centeringMaxCrop } from '@utils/images/centeringMaxCrop'
import { base64ToBlob } from './base64ToBlob'
import type { Dispatch } from 'redux'
import type { ImageState, CropRect, SizeCard } from '../model/types'

interface CommonParams {
  dispatch: Dispatch
}

interface DownloadParams extends CommonParams {
  image: ImageState
  inputRef: React.RefObject<HTMLInputElement>
  isCropVisibly: boolean
  setIsCropVisibly: (v: boolean) => void
}

export const handleDownload = ({
  dispatch,
  image,
  inputRef,
  isCropVisibly,
  setIsCropVisibly,
}: DownloadParams): void => {
  if (inputRef.current) {
    if (isCropVisibly) {
      setIsCropVisibly(false)
      dispatch(updateButtonsState({ crop: false }))
      if (image.url) {
        fetchImageDimensions(image.url, 'startCrop')
      }
    }
    dispatch(addMemoryCrop(null))
    inputRef.current.click()
  }
}

interface SaveParams extends CommonParams {
  image: ImageState
  crop: CropRect
  sizeCard: SizeCard
  scaleX: number
  scaleY: number
  setImage: (img: ImageState) => void
  setCrop: (crop: CropRect) => void
  setIsCropVisibly: (v: boolean) => void
}

export const handleSave = async ({
  dispatch,
  image,
  crop,
  sizeCard,
  scaleX,
  scaleY,
  setImage,
  setCrop,
  setIsCropVisibly,
}: SaveParams): Promise<void> => {
  if (!image.base || !image.source) return

  const croppedImage = getCroppedImage(
    image.url,
    crop,
    sizeCard,
    scaleX,
    scaleY
  )
  const blob = base64ToBlob(croppedImage, 'image/png')

  const addImageFn =
    image.base === 'hiPostImages' ? addHiPostImage : addUserImage
  const deleteMiniFn =
    image.base === 'hiPostImages' ? deleteUserImage : deleteHiPostImage

  await addImageFn('workingImage', blob)
  await deleteMiniFn('miniImage')
  await addImageFn('miniImage', blob)

  setImage({ base: image.base, source: 'workingImage', url: croppedImage })
  setCrop({ x: 0, y: 0, width: sizeCard.width, height: sizeCard.height })
  setIsCropVisibly(false)
  dispatch(updateButtonsState({ crop: false }))
}

interface DeleteParams extends CommonParams {
  image: ImageState
  setImage: (img: ImageState) => void
  setIsCropVisibly: (v: boolean) => void
}

export const handleDelete = async ({
  dispatch,
  image,
  setImage,
  setIsCropVisibly,
}: DeleteParams): Promise<void> => {
  if (!image.base || !image.source) return

  setIsCropVisibly(false)

  const deleteFn =
    image.base === 'hiPostImages' ? deleteHiPostImage : deleteUserImage
  await deleteFn(image.source)

  setImage({ base: image.base, source: null, url: null })
  dispatch(updateButtonsState({ crop: false }))
}

interface CropParams extends CommonParams {
  crop: CropRect
  isCropVisibly: boolean
  setIsCropVisibly: (v: boolean) => void
}

export const handleCrop = ({
  dispatch,
  crop,
  isCropVisibly,
  setIsCropVisibly,
}: CropParams): void => {
  if (isCropVisibly) {
    dispatch(addMemoryCrop(crop))
    setIsCropVisibly(false)
    dispatch(updateButtonsState({ crop: false }))
  } else {
    setIsCropVisibly(true)
    dispatch(updateButtonsState({ crop: true }))
  }
}

interface MaximazeParams {
  image: ImageState
  isCropVisibly: boolean
}

export const handleMaximaze = ({
  image,
  isCropVisibly,
}: MaximazeParams): void => {
  if (isCropVisibly && image.url) {
    fetchImageDimensions(image.url, 'maxCrop')
  }
}

export const handleTurn = (): void => {
  // future implementation
}
