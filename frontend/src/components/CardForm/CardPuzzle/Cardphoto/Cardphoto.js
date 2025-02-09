import { useDispatch, useSelector } from 'react-redux'
import './Cardphoto.scss'
import ImgBkg from './ImgBkg/ImgBkg'
import ImgEditor from './ImgEditor/ImgEditor'
import { useEffect, useState } from 'react'
import imgStart from '../../../../data/cardphoto/photo-start-1206-862.jpg'

const Cardphoto = ({ heightCard, widthCard }) => {
  const selectors = useSelector((state) => state.cardEdit)
  const selectorCardphoto = selectors.cardphoto
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
        style={{ width: `${widthCard}px`, height: `${heightCard}px` }}
      />
      <ImgBkg src={src} />
    </div>
  )
}

export default Cardphoto
