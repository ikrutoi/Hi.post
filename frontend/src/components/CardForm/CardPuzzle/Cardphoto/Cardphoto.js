import './Cardphoto.scss'
// import ImgBkg from './ImgBkg/ImgBkg'
// import ImgEditor from './ImgEditor/ImgEditor'
// import imgStart from '../../../../data/img/card-photo-bw.jpg'
import ImageCrop from './ImageCrop/ImageCrop'
import ToolbarCardphoto from './ToolbarCardphoto/ToolbarCardphoto'

const Cardphoto = ({ sizeCard, choiceSection }) => {
  return (
    <div className="cardphoto">
      {choiceSection.source !== 'shopping' &&
        choiceSection.source !== 'minimize' &&
        choiceSection.source !== 'blanks' && (
          <div className="nav-container nav-container-cardphoto">
            <ToolbarCardphoto />
          </div>
        )}
      <ImageCrop sizeCard={sizeCard} />
      {/* <ImgEditor
        style={{ width: `${sizeCard.width}px`, height: `${sizeCard.height}px` }}
      /> */}

      {/* <ImgBkg src={src} /> */}
    </div>
  )
}

export default Cardphoto
