import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import './MiniPhoto.scss'

const MiniPhoto = ({ sizeCardMini }) => {
  const selectors = useSelector((state) => state.cardEdit)
  const selectorCardphoto = selectors.cardphoto

  const canvasRef = useRef(null)
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    if (selectorCardphoto.url) {
      const img = new Image()
      img.src = selectorCardphoto.url
      img.onload = () => {
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          canvas.width = sizeCardMini.width
          canvas.height = sizeCardMini.height
          ctx.drawImage(img, 0, 0, sizeCardMini.width, sizeCardMini.height)
          setImgSrc(canvas.toDataURL('image/jpeg'))
        }
      }
    }
  }, [selectorCardphoto, sizeCardMini])

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {imgSrc && (
        <img
          className="mini-photo"
          src={imgSrc}
          style={{
            width: `${sizeCardMini.width}px`,
            height: `${sizeCardMini.height}px`,
          }}
          alt="minicard-photo"
        ></img>
      )}
    </>
  )
}

export default MiniPhoto
