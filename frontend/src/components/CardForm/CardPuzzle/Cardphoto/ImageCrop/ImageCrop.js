import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './ImageCrop.scss'
import { addCardphoto } from '../../../../../redux/cardEdit/actionCreators'
import { addOriginalImage } from '../../../../../redux/layout/actionCreators'
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
import { handleFileChange } from '../../../../../utils/events/handleFileChange'

const ImageCrop = ({ sizeCard }) => {
  const layoutToolbar = useSelector((state) => state.layout.btnToolbar)
  const cardphoto = useSelector((state) => state.cardEdit.cardphoto)
  const [image, setImage] = useState(
    cardphoto.url
      ? cardphoto
      : {
          source: 'startImage',
          url: startImage,
        }
  )
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
  // const [isCropVisibly, setIsCropVisibly] = useState(false)
  const dispatch = useDispatch()
  const aspectRatio = 142 / 100

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
      setImage({ source: `${source}-save`, url: croppedImage })
      setCrop({
        x: 0,
        y: 0,
        width: sizeCard.width,
        height: sizeCard.height,
      })
      dispatch(addCardphoto({ source: `${source}-save`, url: croppedImage }))
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
      dispatch(addCardphoto({ url: null, source: null }))
    }
    if (sourceImage.length === 1) {
      if (image.source === 'userImage') {
        setImage({ source: 'startImage', url: startImage })
        setOriginalImage(null)
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

  useEffect(() => {
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

          if (isCropVisibly) {
            const valueCrop = centeringMaxCrop(
              dimensions,
              aspectRatio,
              modeCrop
            )

            setCrop({
              x: valueCrop.x,
              y: valueCrop.y,
              width: valueCrop.width,
              height: valueCrop.height,
            })
          }
        }
      } catch (err) {
        console.error('Error loading image:', err)
      }
    }

    if (image.url) {
      fetchImageDimensions(image.url)
    } else {
      fetchImageDimensions(startImage)
      setImage({ source: 'startImage', url: startImage })
    }
  }, [image, sizeCard, aspectRatio, modeCrop, isCropVisibly])

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
        onChange={(e) =>
          handleFileChange(
            e,
            setImage,
            setOriginalImage,
            dispatch,
            // addCardphoto,
            addOriginalImage,
            setModeCrop
          )
        }
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
