import './Cardphoto.scss'
import ImgBkg from './ImgBkg/ImgBkg'
import ImgEditor from './ImgEditor/ImgEditor'
import Toolbar from './Toolbar/Toolbar'

const Cardphoto = ({ dimensionHeight }) => {
  return (
    <div className="cardphoto">
      <ImgEditor dimensionHeight={dimensionHeight} />
      <ImgBkg />
      <Toolbar />
    </div>
  )
}

export default Cardphoto
