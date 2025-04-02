import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './MiniPhoto.scss'
import {
  getAllHiPostImages,
  getHiPostImage,
  getAllUserImages,
  getUserImage,
} from '../../../../utils/cardFormNav/indexDB/indexDb'

const MiniPhoto = ({ sizeCardMini }) => {
  const layoutIndexDb = useSelector((state) => state.layout.indexDb)
  const [miniCardUrl, setMiniCardUrl] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timerVisibly = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timerVisibly)
  }, [])

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
  }, [layoutIndexDb])

  // useEffect(() => {
  //   console.log('Url', miniCardUrl)
  // }, [miniCardUrl])
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
          className={`mini-photo ${isVisible ? 'visible' : ''}`}
          src={miniCardUrl}
          style={{
            width: `${sizeCardMini.width}px`,
            height: `${sizeCardMini.height}px`,
            position: 'absolute',
          }}
          alt="minicard-photo"
        ></img>
      )}
    </>
  )
}

export default MiniPhoto
