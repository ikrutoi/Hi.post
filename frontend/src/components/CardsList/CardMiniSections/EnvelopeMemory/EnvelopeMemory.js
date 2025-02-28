import { useSelector } from 'react-redux'
import './EnvelopeMemory.scss'
import {
  getMyAddress,
  deleteMyAddress,
  getToAddress,
  deleteToAddress,
} from '../../../../utils/cardFormNav/indexDB/indexDb'

const EnvelopeMemory = ({ sizeMiniCard }) => {
  const cardEditEnvelope = useSelector((state) => state.cardEdit.envelope)
  const infoSaveEnvelopeClip = useSelector(
    (state) => state.infoButtons.envelopeClip
  )
  if (infoSaveEnvelopeClip) {
    console.log('cardEdit', cardEditEnvelope)
  }
  const changeAddress = async () => {
    if (infoSaveEnvelopeClip) {
      console.log('address', getMyAddress('myAddress'))
    }
  }

  return (
    <div className="envelope-history">
      <div
        className="envelope-history-card"
        style={{
          // padding: sectionInfo.section === 'cardphoto' ? '0' : '0.5rem',
          width: `${sizeMiniCard.width}px`,
          height: `${sizeMiniCard.height}px`,
        }}
      ></div>
    </div>
  )
}

export default EnvelopeMemory
