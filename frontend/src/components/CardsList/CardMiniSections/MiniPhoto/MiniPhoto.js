import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import './MiniPhoto.scss'

const MiniPhoto = ({ sizeCardMini }) => {
  const selectorCardphoto = useSelector((state) => state.cardEdit.cardphoto)

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
          canvas.width = sizeCardMini.width * 2
          canvas.height = sizeCardMini.height * 2
          ctx.drawImage(
            img,
            0,
            0,
            sizeCardMini.width * 2,
            sizeCardMini.height * 2
          )
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
