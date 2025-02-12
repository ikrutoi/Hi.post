import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import './Cardphoto.scss'
import ImgBkg from './ImgBkg/ImgBkg'
import ImgEditor from './ImgEditor/ImgEditor'
import imgStart from '../../../../data/cardphoto/photo-start-1206-862.jpg'

const Cardphoto = ({ sizeCard, setChoiceSection }) => {
  const selectorCardphoto = useSelector((state) => state.cardEdit.cardphoto)
  const [src, setSrc] = useState(null)

  useEffect(() => {
    if (selectorCardphoto.url) {
      setSrc(selectorCardphoto.url)
    } else {
      setSrc(imgStart)
    }
  }, [selectorCardphoto])

  return (
    <div className="cardphoto">
      <ImgEditor
        style={{ width: `${sizeCard.width}px`, height: `${sizeCard.height}px` }}
      />
      <ImgBkg src={src} />
    </div>
  )
}

export default Cardphoto
