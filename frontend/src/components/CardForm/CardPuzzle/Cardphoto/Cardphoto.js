import { useDispatch, useSelector } from 'react-redux'
import './Cardphoto.scss'
import ImgBkg from './ImgBkg/ImgBkg'
import ImgEditor from './ImgEditor/ImgEditor'
import { useEffect } from 'react'

const Cardphoto = ({ heightCard, widthCard }) => {
  const selectors = useSelector((state) => state.cardEdit)
  const selectorCardphoto = selectors.cardphoto

  useEffect(() => {
    if (selectorCardphoto) {
      console.log('*', selectorCardphoto.icon)
    }
  }, [selectorCardphoto])
  // const inputValueSelectedAroma = selectors.aroma ? selectors.aroma : null
  // const [selectedAroma, setSelectedAroma] = useState(inputValueSelectedAroma)
  // const dispatch = useDispatch()

  return (
    <div className="cardphoto">
      <ImgEditor
        style={{ width: `${widthCard}px`, height: `${heightCard}px` }}
      />
      <ImgBkg />
    </div>
  )
}

export default Cardphoto
