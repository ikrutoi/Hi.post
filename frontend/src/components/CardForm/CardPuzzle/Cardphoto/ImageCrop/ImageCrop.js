import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './ImageCrop.scss'
import { addCardphoto } from '../../../../../redux/cardEdit/actionCreators'
import {
  addWorkingImage,
  addImages,
} from '../../../../../redux/layout/actionCreators'
import {
  addImage,
  getImage,
  deleteImage,
  getAllImages,
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
  const handleDownload = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const savedImages = await getAllImages()
        const workingImage = savedImages.find(
          (image) => image.id === 'workingImage'
        )
        if (workingImage) {
          await fetchImageFromIndexedDb('workingImage')
        } else {
          setImage({
            source: 'startImage',
            url: startImage,
          })

          try {
            const response = await fetch(startImage)
            const blobStartImage = await response.blob()

            await addImage('startImage', blobStartImage)
            await addImage('workingImage', blobStartImage)
          } catch (error) {
            console.error('Error saving initial image to IndexedDb:', error)
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
      const savedImage = await getImage(id)
      if (
        savedImage.image instanceof Blob ||
        savedImage.image instanceof File
      ) {
        setImage({ source: id, url: URL.createObjectURL(savedImage.image) })
        fetchImageDimensions(URL.createObjectURL(savedImage.image))
        return
      } else if (
        typeof savedImage.image === 'string' &&
        savedImage.image.startsWith('data:image/')
      ) {
        setImage({
          source: id,
          url: savedImage.image,
        })
        return
      }
    } catch (error) {
      console.error('Error fetching image from IndexedDb:', error)
    }
  }

  const deleteImagesInIndexedDb = async (id) => {
    const savedImage = await getImage(id)
    setImage(
      savedImage
        ? { source: id, url: savedImage.image }
        : { source: null, url: null }
    )
    if (layoutWorkingImage.originalImage) {
      const originalImage = await getImage('originalImage')
      setOriginalImage(originalImage.image)
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
      setImage({ source: `${source}-save`, url: croppedImage })
      setCrop({
        x: 0,
        y: 0,
        width: sizeCard.width,
        height: sizeCard.height,
      })
      addImage(`${source}-save`, croppedImage)
      addImage('miniImage', croppedImage)
      fetchImageDimensions(croppedImage)
      dispatch(addCardphoto({ source: `${source}-save`, url: croppedImage }))
      dispatch(
        addWorkingImage({ source: `${source}-save`, miniImage: 'miniImage' })
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
        addImage(`${sourceImage[0]}`, originalImage)
        deleteImage(image.source)
      } else {
        addImage(`${sourceImage[0]}`, originalImage)
        deleteImage()
      }
      dispatch(
        addWorkingImage({ source: `${sourceImage[0]}`, miniImage: null })
      )
      dispatch(addCardphoto({ url: null, source: null }))
    }
    if (sourceImage.length === 1) {
      if (image.source === 'userImage') {
        setImage({ source: 'startImage', url: startImage })
        dispatch(
          addWorkingImage({ source: `${sourceImage[0]}`, miniImage: null })
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

        // console.log('isCropVisibly', isCropVisibly)

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
      // await addImage('startImage', blobStartImage)
      await addImage('originalImage', file)
      await addImage('userImage', file)
      await addImage('workingImage', file)

      const reader = new FileReader()
      reader.onload = () => {
        const imageDataUrl = reader.result
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
          addWorkingImage({
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
