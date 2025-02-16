import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import './MiniPhoto.scss'

const MiniPhoto = ({ sizeCardMini }) => {
  const selectorCardphoto = useSelector((state) => state.cardEdit.cardphoto)

  const canvasRef = useRef(null)
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    if (selectorCardphoto.url) {
      setImgSrc(selectorCardphoto.url)
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
