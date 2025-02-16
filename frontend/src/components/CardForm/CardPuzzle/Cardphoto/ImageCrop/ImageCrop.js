import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './ImageCrop.scss'
import { updateClipPath } from './utils/utils'
import { addCardphoto } from '../../../../../redux/cardEdit/actionCreators'
import startImage from '../../../../../data/cardphoto/photo-start-1206-862.jpg'

const ImageCrop = ({ sizeCard }) => {
  const [image, setImage] = useState({
    source: 'startHiImage',
    url: startImage,
  })
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const [originalImage, setOriginalImage] = useState(null)
  const [crop, setCrop] = useState({
    x: sizeCard.width / 4,
    y: sizeCard.height / 4,
    width: sizeCard.width / 2,
    height: sizeCard.height / 2,
  })
  const layoutToolbar = useSelector((state) => state.layout.btnToolbar)
  const imgRef = useRef(null)
  const inputRef = useRef(null)
  const overlayRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })
  const dispatch = useDispatch()

  const aspectRatio = 142 / 100

  useEffect(() => {
    if (layoutToolbar.firstBtn === 'download' && inputRef.current) {
      inputRef.current.click()
    }
    if (layoutToolbar.firstBtn === 'save') {
      const croppedImage = getCroppedImage()
      const source = image.source
      setImage({ source: `${source}-save`, url: croppedImage })
      setCrop({
        x: 0,
        y: 0,
        width: sizeCard.width,
        height: sizeCard.height,
      })
      dispatch(addCardphoto({ source: 'cardPuzzle', url: croppedImage }))
    }
    if (layoutToolbar.firstBtn === 'delete') {
      const sourceImage = image.source.split('-')
      if (sourceImage.length > 1) {
        setImage({
          source: `${sourceImage[0]}`,
          url: sourceImage[0] === 'startUserImage' ? originalImage : startImage,
        })
      }
      if (sourceImage.length === 1) {
        if (image.source === 'startUserImage') {
          setImage({ source: 'startHiImage', url: startImage })
        }
      }
      setCrop({
        x: sizeCard.width / 4,
        y: sizeCard.height / 4,
        width: sizeCard.width / 2,
        height: sizeCard.height / 2,
      })
    }
  }, [layoutToolbar, inputRef])

  const loadImageDimensions = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.onerror = (err) => reject(err)
    })
  }

  useEffect(() => {
    const fetchImageDimensions = async (src) => {
      try {
        const dimensions = await loadImageDimensions(src)
        setImageDimensions(dimensions)
        const img = imgRef.current
        if (img) {
          setScaleX(dimensions.width / img.width)
          setScaleY(dimensions.height / img.height)
        }
        console.log(`Width: ${dimensions.width}, Height: ${dimensions.height}`)
      } catch (err) {
        console.error('Error loading image:', err)
      }
    }

    if (image.url) {
      fetchImageDimensions(image.url)
    } else {
      fetchImageDimensions(startImage)
      setImage({ source: 'startHiImage', url: startImage })
    }
  }, [image])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const imageDataUrl = reader.result
        setImage({ source: 'startUserImage', url: imageDataUrl })
        setOriginalImage(imageDataUrl)
      }
      reader.readAsDataURL(file)
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

  const handleMouseDownResize = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    const startX = e.clientX
    const startWidth = crop.width

    const onMouseMove = (e) => {
      const deltaX = e.clientX - startX
      let newWidth = startWidth + deltaX
      let newHeight = newWidth / aspectRatio

      const img = imgRef.current
      if (crop.x + newWidth / scaleX > img.width) {
        newWidth = (img.width - crop.x) * scaleX
        newHeight = newWidth / aspectRatio
      }
      if (crop.y + newHeight / scaleY > img.height) {
        newHeight = (img.height - crop.y) * scaleY
        newWidth = newHeight * aspectRatio
      }

      setCrop((prevCrop) => ({
        ...prevCrop,
        width: newWidth,
        height: newHeight,
      }))
    }

    const onMouseUp = () => {
      setIsResizing(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleMouseDownDrag = (e) => {
    if (isResizing) return
    setIsDragging(true)
    setLastMousePosition({ x: e.clientX, y: e.clientY })

    window.addEventListener('mousemove', handleMouseMoveDrag)
    window.addEventListener('mouseup', handleMouseUpDrag)
    window.addEventListener('mouseleave', handleMouseUpDrag)
  }

  const handleMouseMoveDrag = (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - lastMousePosition.x
    const deltaY = e.clientY - lastMousePosition.y

    let newX = crop.x + deltaX / scaleX
    let newY = crop.y + deltaY / scaleY
    const img = imgRef.current

    if (newX < 0) newX = 0
    if (newY < 0) newY = 0
    if (newX + crop.width / scaleX > img.width)
      newX = img.width - crop.width / scaleX
    if (newY + crop.height / scaleY > img.height)
      newY = img.height - crop.height / scaleY

    setCrop((prevCrop) => ({
      ...prevCrop,
      x: newX,
      y: newY,
    }))

    setLastMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUpDrag = () => {
    setIsDragging(false)

    window.removeEventListener('mousemove', handleMouseMoveDrag)
    window.removeEventListener('mouseup', handleMouseUpDrag)
    window.removeEventListener('mouseleave', handleMouseUpDrag)
  }

  const getCroppedImage = () => {
    const canvas = document.createElement('canvas')
    const img = imgRef.current

    canvas.width = sizeCard.width
    canvas.height = sizeCard.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      img,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
    )

    return canvas.toDataURL('image/png')
  }

  return (
    <div onMouseMove={handleMouseMoveDrag} onMouseUp={handleMouseUpDrag}>
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
          <div className="overlay" ref={overlayRef}></div>
          <div
            className="crop-area"
            style={{
              top: crop.y / scaleX,
              left: crop.x / scaleY,
              width: crop.width / scaleX,
              height: crop.height / scaleY,
            }}
            onMouseDown={handleMouseDownDrag}
          >
            <div
              className="crop-resize-handle"
              onMouseDown={handleMouseDownResize}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageCrop
