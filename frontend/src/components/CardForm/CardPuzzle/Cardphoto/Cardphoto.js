import './Cardphoto.scss'
import ImgBkg from './ImgBkg/ImgBkg'
import ImgEditor from './ImgEditor/ImgEditor'

const Cardphoto = ({ heightCard, widthCard }) => {
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
