import { CgClose } from 'react-icons/cg'
import './EnvelopeMemory.scss'

const EnvelopeMemory = ({
  sizeMiniCard,
  section,
  address,
  setRef,
  handleClickAddressMiniKebab,
}) => {
  return (
    <div
      className="envelope-memory-card"
      ref={setRef(`${section}-${address.id}`)}
      style={{
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
      }}
    >
      <p>{address.name}</p>
      <p>{address.street}</p>
      <p>{address.index}</p>
      <p>{address.city}</p>
      <p>{address.country}</p>
      <div
        className="card-mini-kebab card-mini-kebab-envelope"
        onClick={() => handleClickAddressMiniKebab(section, address.id)}
      >
        <CgClose className="icon-close" />
      </div>
    </div>
  )
}

export default EnvelopeMemory
