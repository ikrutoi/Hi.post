import { useEffect, useRef, useState } from 'react'
import './ImageCrop.scss'

const ImageCrop = ({ sizeCard }) => {
  const [image, setImage] = useState(null)
  const [crop, setCrop] = useState({
    x: sizeCard.width / 4,
    y: sizeCard.height / 4,
    width: sizeCard.width / 2,
    height: sizeCard.height / 2,
  })
  const imgRef = useRef(null)
  const overlayRef = useRef(null)
  // const cropAreaRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })

  const aspectRatio = 142 / 100

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateClipPath = (x, y, width, height) => {
    if (overlayRef.current) {
      // const { x, y, width, height } = crop
      overlayRef.current.style.clipPath = `polygon(
        0 0,
        100% 0,
        100% 100%,
        0 100%,
        0 ${y}px,
        ${x}px ${y}px,
        ${x}px ${y + height}px,
        ${x + width}px ${y + height}px,
        ${x + width}px ${y}px,
        0 ${y}px
      )`
    }
  }

  useEffect(() => {
    if (image) {
      updateClipPath(crop.x, crop.y, crop.width, crop.height)
    }
  }, [crop, image])

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
      if (crop.x + newWidth > img.width) {
        newWidth = img.width - crop.x
        newHeight = newWidth / aspectRatio
      }
      if (crop.y + newHeight > img.height) {
        newHeight = img.height - crop.y
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
    setStartPosition({ x: e.clientX - crop.x, y: e.clientY - crop.y })
    setLastMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMoveDrag = (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - lastMousePosition.x
    const deltaY = e.clientY - lastMousePosition.y

    let newX = crop.x + deltaX
    let newY = crop.y + deltaY
    const img = imgRef.current

    if (newX < 0) newX = 0
    if (newY < 0) newY = 0
    if (newX + crop.width > img.width) newX = img.width - crop.width
    if (newY + crop.height > img.height) newY = img.height - crop.height

    setCrop((prevCrop) => ({
      ...prevCrop,
      x: newX,
      y: newY,
    }))

    setLastMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUpDrag = () => {
    setIsDragging(false)
  }

  return (
    <div onMouseMove={handleMouseMoveDrag} onMouseUp={handleMouseUpDrag}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && (
        <div className="crop-container">
          <img ref={imgRef} src={image} alt="Source" className="crop-image" />
          <div className="overlay" ref={overlayRef}></div>
          <div
            className="crop-area"
            style={{
              top: crop.y,
              left: crop.x,
              width: crop.width,
              height: crop.height,
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
