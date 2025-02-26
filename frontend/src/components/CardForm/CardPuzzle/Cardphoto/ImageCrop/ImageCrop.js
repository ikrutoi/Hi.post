import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './ImageCrop.scss'
// import { addCardphoto } from '../../../../../redux/cardEdit/actionCreators'
import { addIndexDb } from '../../../../../redux/layout/actionCreators'
import {
  addHiPostImage,
  getHiPostImage,
  deleteHiPostImage,
  getAllHiPostImages,
  addUserImage,
  getUserImage,
  deleteUserImage,
  getAllUserImages,
} from '../../../../../utils/cardFormNav/indexDB/indexDb'
import { addBtnToolbar } from '../../../../../redux/layout/actionCreators'
import { infoButtons } from '../../../../../redux/infoButtons/actionCreators'
import coverImage from '../../../../../data/img/card-photo-bw.jpg'
import { updateClipPath } from '../../../../../utils/images/updateClipPath'
import { loadImageDimensions } from '../../../../../utils/images/loadImageDimensions'
import { getCroppedImage } from '../../../../../utils/images/getCroppedImage'
import { handleMouseMoveDrag } from '../../../../../utils/events/handleMouseMoveDrag'
import { handleMouseUpDrag } from '../../../../../utils/events/handleMouseUpDrag'
import { handleMouseDownDrag } from '../../../../../utils/events/handleMouseDownDrag'
import { handleMouseDownResize } from '../../../../../utils/events/handleMouseDownResize'
import { centeringMaxCrop } from '../../../../../utils/images/centeringMaxCrop'
import { adjustImageSize } from '../../../../../utils/images/adjustImageSize'

const ImageCrop = ({ sizeCard }) => {
  const layoutToolbar = useSelector((state) => state.layout.btnToolbar)
  const layoutWorkingImage = useSelector((state) => state.layout.workingImage)
  const [image, setImage] = useState({ source: null, url: null, base: null })
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const imgRef = useRef(null)
  const cropAreaRef = useRef(null)
  const inputRef = useRef(null)
  const overlayRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [modeCrop, setModeCrop] = useState('startCrop')
  const [isCropVisibly, setIsCropVisibly] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })
  const dispatch = useDispatch()
  const aspectRatio = 142 / 100

  // useEffect(() => {
  //   console.log('image', image)
  // }, [image])

  const checkIndexDb = async () => {
    try {
      const hiPostImages = await getAllHiPostImages()
      const userImages = await getAllUserImages()

      const checkImages = (base) => {
        const miniImage = base.some((image) => image.id === 'miniImage')
        const workingImage = base.some((image) => image.id === 'workingImage')
        const originalImage = base.some((image) => image.id === 'originalImage')

        return { originalImage, workingImage, miniImage }
      }

      const listHiPostImages = checkImages(hiPostImages)
      const listUserImages = checkImages(userImages)

      if (listUserImages.originalImage) {
        if (listHiPostImages.workingImage) {
          await deleteHiPostImage('workingImage')
          listHiPostImages.workingImage = false
        }
      }
      if (listUserImages.miniImage) {
        if (listHiPostImages.miniImage) {
          await deleteHiPostImage('miniImage')
          listHiPostImages.miniImage = false
        }
      }

      dispatch(
        addIndexDb({
          hiPostImages: listHiPostImages,
          userImages: listUserImages,
        })
      )
    } catch (error) {
      console.error('Error fetching images from checkIndexDb:', error)
    }
  }

  const fetchImages = async () => {
    try {
      const hiPostImages = await getAllHiPostImages()
      const userImages = await getAllUserImages()

      // console.log('hiPostImages', hiPostImages)
      // console.log('userImages', userImages)

      // if (hiPostImages.length > 0) {
      //   for (const image of hiPostImages) {
      //     deleteHiPostImage(image.id)
      //   }
      // }
      // if (userImages.length > 0) {
      //   for (const image of userImages) {
      //     deleteUserImage(image.id)
      //   }
      // }

      const checkStartImage = (base, baseName) => {
        const workingImage = base.find((image) => image.id === 'workingImage')
        const originalImage = base.find((image) => image.id === 'originalImage')
        if (workingImage) {
          return { base: baseName, source: 'workingImage' }
        }
        if (originalImage) {
          return { base: baseName, source: 'originalImage' }
        }
        return null
      }

      const startHiPostImage = checkStartImage(hiPostImages, 'hiPostImages')
      const startUserImage = checkStartImage(userImages, 'userImages')
      const startImage = startUserImage
        ? startUserImage
        : startHiPostImage
        ? startHiPostImage
        : null

      if (startImage) {
        await fetchImageFromIndexedDb(startImage)
        // dispatch(
        //   addIndexDb({
        //     hiPostImages: {
        //       originalImage: true,
        //       workingImage: false,
        //       miniImage: false,
        //     },
        //     userImages: {
        //       originalImage: false,
        //       workingImage: false,
        //       miniImage: false,
        //     },
        //   })
        // )
      } else {
        try {
          setImage({
            base: 'hiPostImages',
            url: coverImage,
            source: 'originalImage',
          })
          // dispatch(
          //   addIndexDb({
          //     hiPostImages: {
          //       originalImage: true,
          //       workingImage: false,
          //       miniImage: false,
          //     },
          //     userImages: {
          //       originalImage: false,
          //       workingImage: false,
          //       miniImage: false,
          //     },
          //   })
          // )
          const response = await fetch(coverImage)
          const blobStartImage = await response.blob()

          await addHiPostImage('originalImage', blobStartImage)
          await checkIndexDb()
        } catch (error) {
          console.error('Error saving initial image to IndexedDb:', error)
        }
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImageFromIndexedDb = async (startImage) => {
    // const hiPostImages = await getAllHiPostImages()
    // const userImages = await getAllUserImages()

    // console.log('hiPostImages iDB', hiPostImages)
    // console.log('userImages iDB', userImages)

    try {
      const getStartImageFunctions = {
        hiPostImages: getHiPostImage,
        userImages: getUserImage,
      }
      const getStartImageFunction = getStartImageFunctions[startImage.base]

      if (!getStartImageFunction) {
        throw new Error(`Unknown id: ${startImage.base}`)
      }

      const savedStartImage = await getStartImageFunction(startImage.source)

      if (!savedStartImage) {
        throw new Error(`Image not found for id: ${startImage.source}`)
      }

      const url = URL.createObjectURL(savedStartImage)
      setImage({
        base: startImage.base,
        source: startImage.source,
        url: url,
      })
      await checkIndexDb()
      fetchImageDimensions(url)
      // dispatch(addIndexDb({ [startImage.base]: { [startImage.source]: true } }))
      return
    } catch (error) {
      console.error('Error fetching image from IndexedDb:', error)
    }
  }

  // const deleteImagesInIndexedDb = async (id) => {
  //   const savedImage = await getHiPostImage(id)
  //   setImage(
  //     savedImage
  //       ? { source: id, url: savedImage.image }
  //       : { source: null, url: null }
  //   )
  //   if (layoutWorkingImage.originalImage) {
  //     const originalImage = await getHiPostImage('originalImage')
  //     setOriginalImage(originalImage.image)
  //   }
  // }

  const handleDownload = () => {
    if (inputRef.current) {
      if (isCropVisibly) {
        setIsCropVisibly(false)
        dispatch(infoButtons({ crop: false }))
        fetchImageDimensions(image.url)
      }
      inputRef.current.click()
    }
  }

  const handleSave = async () => {
    if (isCropVisibly) {
      const croppedImage = getCroppedImage(
        imgRef,
        crop,
        sizeCard,
        scaleX,
        scaleY
      )
      const base = image.base
      const source = image.source

      const addWorkingImageFunctions = {
        hiPostImages: addHiPostImage,
        userImages: addUserImage,
      }
      const addWorkingImageFunction = addWorkingImageFunctions[base]

      if (!addWorkingImageFunction) {
        throw new Error(`Unknown id: ${base}`)
      }

      setImage({ source: 'workingImage', url: croppedImage, base: base })
      setCrop({
        x: 0,
        y: 0,
        width: sizeCard.width,
        height: sizeCard.height,
      })
      const blobCroppedImage = base64ToBlob(croppedImage, 'image/png')

      await addWorkingImageFunction('workingImage', blobCroppedImage)
      if (base === 'hiPostImages') {
        await deleteUserImage('miniImage')
      }
      if (base === 'userImages') {
        await deleteHiPostImage('miniImage')
      }
      await addWorkingImageFunction('miniImage', blobCroppedImage)
      await checkIndexDb()

      fetchImageDimensions(croppedImage)
      // dispatch(addCardphoto({ source: `${source}-save`, url: croppedImage }))
      // dispatch(
      //   addIndexDb({
      //     [base]: { workingImage: true, miniImage: true },
      //   })
      // )
      // dispatch(
      //   addWorkingImg({ source: `${source}-save`, miniImage: 'miniImage' })
      // )
      if (isCropVisibly) {
        setIsCropVisibly(false)
      }
      dispatch(infoButtons({ crop: false }))
    }
  }

  const handleDelete = async () => {
    if (isCropVisibly) {
      setIsCropVisibly(false)
      return
    }

    let isWorkingImage

    try {
      const hiPostImages = await getAllHiPostImages()
      isWorkingImage = hiPostImages.find((image) => image.id === 'workingImage')
    } catch (error) {
      console.error('Error fetching hiPostImages:', error)
    }

    const base = image.base
    const source = image.source

    if (base === 'userImages') {
      if (source === 'workingImage') {
        fetchImageFromIndexedDb({ base: 'userImages', source: 'originalImage' })
        await deleteUserImage('workingImage')
        await checkIndexDb()
        // dispatch(
        //   addIndexDb({
        //     userImages: { workingImage: false },
        //   })
        // )
      }
      if (source === 'originalImage') {
        if (isWorkingImage) {
          fetchImageFromIndexedDb({
            base: 'hiPostImages',
            source: 'workingImage',
          })
        } else {
          fetchImageFromIndexedDb({
            base: 'hiPostImages',
            source: 'originalImage',
          })
        }
        await deleteUserImage('originalImage')
        await checkIndexDb()
        // dispatch(
        //   addIndexDb({
        //     userImages: { originalImage: false },
        //   })
        // )
      }
    }
    if (base === 'hiPostImages') {
      if (isWorkingImage) {
        fetchImageFromIndexedDb({
          base: 'hiPostImages',
          source: 'originalImage',
        })
        await deleteHiPostImage('workingImage')
        await checkIndexDb()
        // dispatch(
        //   addIndexDb({
        //     hiPostImages: { workingImage: false },
        //   })
        // )
      } else {
        return
      }
    }
    dispatch(infoButtons({ crop: false }))
  }

  const handleCrop = () => {
    if (isCropVisibly) {
      setIsCropVisibly(false)
      dispatch(infoButtons({ crop: false }))
      fetchImageDimensions(image.url)
    } else {
      setIsCropVisibly(true)
      dispatch(infoButtons({ crop: true }))
      fetchImageDimensions(image.url)
    }
  }

  const handleMaximaze = () => {
    if (isCropVisibly) {
      setModeCrop('maxCrop')
    }
  }

  useEffect(() => {
    const resetBtnToolbar = () => {
      dispatch(
        addBtnToolbar({
          firstBtn: null,
          section: null,
          secondBtn: null,
        })
      )
    }
    switch (layoutToolbar.firstBtn) {
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

      default:
        break
    }
  }, [layoutToolbar])

  const base64ToBlob = (base64, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(base64.split(',')[1])
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, { type: contentType })
  }

  const fetchImageDimensions = async (src) => {
    try {
      const dimensions = await loadImageDimensions(src)
      const img = imgRef.current
      if (img) {
        img.src = ''
        img.onload = () => {
          const { width, height } = adjustImageSize(
            img,
            sizeCard.width,
            sizeCard.height
          )
          img.style.width = `${width}px`
          img.style.height = `${height}px`

          const scaleX = dimensions.width / img.width
          const scaleY = dimensions.height / img.height
          setScaleX(scaleX)
          setScaleY(scaleY)

          const valueCrop = centeringMaxCrop(dimensions, aspectRatio, modeCrop)

          setCrop({
            x: valueCrop.x,
            y: valueCrop.y,
            width: valueCrop.width,
            height: valueCrop.height,
          })
        }

        img.src = src
      }
    } catch (err) {
      console.error('Error loading image:', err)
    }
  }

  useEffect(() => {
    if (image) {
      updateClipPath(
        overlayRef.current,
        crop.x / scaleX,
        crop.y / scaleY,
        crop.width / scaleX,
        crop.height / scaleY
      )
    }
  }, [crop, image, scaleX, scaleY])

  const handleFileChange = async (evt) => {
    const file = evt.target.files[0]

    if (file) {
      const blob = new Blob([file], { type: file.type })

      await addUserImage('originalImage', blob)
      await deleteHiPostImage('workingImage')
      await checkIndexDb()

      const blobUrl = URL.createObjectURL(blob)
      fetchImageDimensions(blobUrl)
      setImage({
        source: 'originalImage',
        url: blobUrl,
        base: 'userImages',
      })
      setModeCrop('startCrop')
      evt.target.value = ''
    }
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
        onChange={(evt) => handleFileChange(evt)}
        ref={inputRef}
        style={{ display: 'none' }}
      />
      {image.url && (
        <div
          className="crop-container"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
        >
          <img
            ref={imgRef}
            src={image.url}
            alt="Source"
            className="crop-image"
          />
          {isCropVisibly && (
            <div
              className="overlay"
              ref={overlayRef}
              // style={{ display: isCropVisibly ? 'block' : 'none' }}
            ></div>
          )}

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
