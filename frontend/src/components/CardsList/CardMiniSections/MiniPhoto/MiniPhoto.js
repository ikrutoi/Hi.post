import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import './MiniPhoto.scss'
import {
  getAllHiPostImages,
  getHiPostImage,
  getAllUserImages,
  getUserImage,
} from '../../../../utils/cardFormNav/indexDB/indexDb'

const MiniPhoto = ({ sizeCardMini }) => {
  const selectorCardphoto = useSelector((state) => state.cardEdit.cardphoto)
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
  // const canvasRef = useRef(null)
  // const [imgSrc, setImgSrc] = useState('')
  const [miniCardUrl, setMiniCardUrl] = useState(null)

  useEffect(() => {
    const getMiniImage = async () => {
      const hiPostImages = await getAllHiPostImages()
      const userImages = await getAllUserImages()

      const miniImageHiPostImages = hiPostImages.some(
        (image) => image.id === 'miniImage'
      )
      const miniImageUserImages = userImages.some(
        (image) => image.id === 'miniImage'
      )

      if (miniImageUserImages) {
        const miniImage = await getUserImage('miniImage')
        setMiniCardUrl(URL.createObjectURL(miniImage))
      }
      if (miniImageHiPostImages) {
        const miniImage = await getHiPostImage('miniImage')
        setMiniCardUrl(URL.createObjectURL(miniImage))
      }
    }

    getMiniImage()
    // console.log('layoutIndexDb', layoutIndexDb)
  }, [layoutIndexDb])

  // useEffect(() => {
  //   if (selectorCardphoto.url) {
  //     setImgSrc(selectorCardphoto.url)
  //   }
  // }, [selectorCardphoto, sizeCardMini])

  return (
    <>
      {/* <canvas ref={canvasRef} style={{ display: 'none' }} /> */}
      {miniCardUrl && (
        <img
          className="mini-photo"
          // src={imgSrc}
          src={miniCardUrl}
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
