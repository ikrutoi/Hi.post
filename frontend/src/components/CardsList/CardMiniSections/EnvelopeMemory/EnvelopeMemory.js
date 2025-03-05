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
      <p>{address.address.name}</p>
      <p>{address.address.street}</p>
      <p>{address.address.index}</p>
      <p>{address.address.city}</p>
      <p>{address.address.country}</p>
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
