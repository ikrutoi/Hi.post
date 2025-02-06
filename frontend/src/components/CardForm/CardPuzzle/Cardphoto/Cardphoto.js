import './Cardphoto.scss'
import ImgBkg from './ImgBkg/ImgBkg'
import ImgEditor from './ImgEditor/ImgEditor'
import Toolbar from './Toolbar/Toolbar'

const Cardphoto = ({ heightCardForm }) => {
  const width = heightCardForm * 1.42
  return (
    <div className="cardphoto">
      <ImgEditor />
      <ImgBkg />
      {/* <Toolbar /> */}
    </div>
  )
}

export default Cardphoto
