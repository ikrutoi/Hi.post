import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './ImageCrop.scss'
import { addCardphoto } from '../../../../../redux/cardEdit/actionCreators'
import {
  addWorkingImg,
  addImages,
} from '../../../../../redux/layout/actionCreators'
import {
  addStartImage,
  getStartImage,
  deleteStartImage,
  getAllStartImages,
  addUserImage,
  getUserImage,
  deleteUserImage,
  getAllUserImages,
} from '../../../../../utils/cardFormNav/indexDB/indexDb'
import { addBtnToolbar } from '../../../../../redux/layout/actionCreators'
import { infoButtons } from '../../../../../redux/infoButtons/actionCreators'
import startImage from '../../../../../data/img/card-photo-bw.jpg'
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
  const layoutImages = useSelector((state) => state.layout.images)
  const cardphoto = useSelector((state) => state.cardEdit.cardphoto)
  const [workingImage, setWorkingImage] = useState(null)
  const [images, setImages] = useState(null)
  const [image, setImage] = useState({ source: null, url: null })
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const [originalImage, setOriginalImage] = useState(null)
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

  useEffect(() => {
    console.log('image', image)
  }, [image])

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const startImages = await getAllStartImages()
        const userImages = await getAllUserImages()

        console.log('startImages', startImages)
        console.log('userImages', userImages)

        // if (startImages.length > 0) {
        //   for (const image of startImages) {
        //     deleteStartImage(image.id)
        //   }
        // }
        // if (userImages.length > 0) {
        //   for (const image of userImages) {
        //     deleteUserImage(image.id)
        //   }
        // }

        const workingStartImage = startImages.find(
          (image) => image.id === 'workingImage'
        )
        const workingUserImage = userImages.find(
          (image) => image.id === 'workingImage'
        )

        let workingImage

        if (workingStartImage) {
          workingImage = 'startImages'
        }

        if (workingUserImage) {
          workingImage = 'userImages'
        }

        if (!workingStartImage && !workingUserImage) {
          workingImage = null
        }

        if (workingImage) {
          await fetchImageFromIndexedDb(workingImage)
        } else {
          if (
            startImages.length > 0 &&
            startImages.find((image) => image.id === 'startImage')
          ) {
            const startImageBlob = await getStartImage('startImage')
            setImage({
              source: 'startImage',
              url: URL.createObjectURL(startImageBlob),
            })
          } else {
            setImage({
              source: 'startImage',
              url: startImage,
            })
            try {
              const response = await fetch(startImage)
              const blobStartImage = await response.blob()

              await addStartImage('startImage', blobStartImage)
            } catch (error) {
              console.error('Error saving initial image to IndexedDb:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

    fetchImages()
  }, [])

  const fetchImageFromIndexedDb = async (id) => {
    try {
      const getWorkingImageFunctions = {
        startImages: getStartImage,
        userImages: getUserImage,
      }
      const getWorkingImageFunction = getWorkingImageFunctions[id]

      if (!getWorkingImageFunction) {
        throw new Error(`Unknown id: ${id}`)
      }

      const savedWorkingImage = await getWorkingImageFunction('workingImage')
      const url = URL.createObjectURL(savedWorkingImage)
      setImage({ source: id, url: url })
      fetchImageDimensions(url)
      return
    } catch (error) {
      console.error('Error fetching image from IndexedDb:', error)
    }
  }

  const deleteImagesInIndexedDb = async (id) => {
    const savedImage = await getStartImage(id)
    setImage(
      savedImage
        ? { source: id, url: savedImage.image }
        : { source: null, url: null }
    )
    if (layoutWorkingImage.originalImage) {
      const originalImage = await getStartImage('originalImage')
      setOriginalImage(originalImage.image)
    }
  }

  const handleDownload = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleSave = () => {
    if (isCropVisibly) {
      const croppedImage = getCroppedImage(
        imgRef,
        crop,
        sizeCard,
        scaleX,
        scaleY
      )
      const source = image.source
      console.log('source', source)
      setImage({ source: `${source}-save`, url: croppedImage })
      setCrop({
        x: 0,
        y: 0,
        width: sizeCard.width,
        height: sizeCard.height,
      })
      const blobCroppedImage = base64ToBlob(croppedImage, 'image/png')
      addUserImage(`${source}-save`, blobCroppedImage)
      addUserImage('miniImage', blobCroppedImage)
      fetchImageDimensions(croppedImage)
      dispatch(addCardphoto({ source: `${source}-save`, url: croppedImage }))
      dispatch(
        addWorkingImg({ source: `${source}-save`, miniImage: 'miniImage' })
      )
      if (isCropVisibly) {
        setIsCropVisibly(false)
      }
      dispatch(infoButtons({ crop: false }))
    }
  }

  const handleDelete = () => {
    const sourceImage = image.source.split('-')
    if (isCropVisibly) {
      setIsCropVisibly(false)
      return
    }
    if (sourceImage.length > 1) {
      setImage({
        source: `${sourceImage[0]}`,
        url: sourceImage[0] === 'userImage' ? originalImage : startImage,
      })
      if (sourceImage[0] === 'userImage') {
        addStartImage(`${sourceImage[0]}`, originalImage)
        deleteStartImage(image.source)
      } else {
        addStartImage(`${sourceImage[0]}`, originalImage)
        deleteStartImage()
      }
      dispatch(addWorkingImg({ source: `${sourceImage[0]}`, miniImage: null }))
      dispatch(addCardphoto({ url: null, source: null }))
    }
    if (sourceImage.length === 1) {
      if (image.source === 'userImage') {
        setImage({ source: 'startImage', url: startImage })
        dispatch(
          addWorkingImg({ source: `${sourceImage[0]}`, miniImage: null })
        )
        dispatch(addCardphoto({ url: null, source: null }))
      }
    }
    dispatch(infoButtons({ crop: false }))
  }

  const handleCrop = () => {
    if (isCropVisibly) {
      setIsCropVisibly(false)
      dispatch(infoButtons({ crop: false }))
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

  // useEffect(() => {
  const fetchImageDimensions = async (src) => {
    try {
      const dimensions = await loadImageDimensions(src)
      const img = imgRef.current
      if (img) {
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

        // if (isCropVisibly) {
        const valueCrop = centeringMaxCrop(dimensions, aspectRatio, modeCrop)

        setCrop({
          x: valueCrop.x,
          y: valueCrop.y,
          width: valueCrop.width,
          height: valueCrop.height,
        })
        // }
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
    // const response = await fetch(startImage)
    // const blobStartImage = await response.blob()

    if (file) {
      const blob = new Blob([file], { type: file.type })
      // await addImage('startImage', blobStartImage)
      await addStartImage('originalImage', blob)
      await addUserImage('userImage', blob)
      await addUserImage('workingImage', blob)

      const reader = new FileReader()
      reader.onload = () => {
        const imageDataUrl = reader.result
        fetchImageDimensions(imageDataUrl)
        setImage({ source: 'userImage', url: imageDataUrl })
        setModeCrop('startCrop')
        dispatch(
          addImages([
            { id: 'originalImage', image: true },
            { id: 'startImage', image: true },
            { id: 'userImage', image: true },
            { id: 'workingImage', image: true },
          ])
        )

        dispatch(
          addWorkingImg({
            originalImage: 'originalImage',
            source: 'userImage',
          })
        )
      }
      reader.readAsDataURL(file)
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
                top: crop.y / scaleX,
                left: crop.x / scaleY,
                width: crop.width / scaleX,
                height: crop.height / scaleY,
                // display: isCropVisibly ? 'block' : 'none',
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
