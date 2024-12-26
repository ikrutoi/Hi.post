import './Envelope.scss'
import FormMyAddress from './FormMyAddress/FormMyAddress'
import FormToAddress from './FormToAddress/FormToAddress'
import Mark from './Mark/Mark'

const Envelope = () => {
  return (
    <div className="envelope">
      <div className="envelope-my-address">
        <div className="envelope-logo">Hidragonfly.com</div>
        <FormMyAddress />
      </div>
      <Mark />
      <div className="envelope-to-address">
        <FormToAddress />
      </div>
    </div>
  )
}

export default Envelope
