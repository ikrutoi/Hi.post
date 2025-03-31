import { CgClose } from 'react-icons/cg'
import './MemoryEnvelope.scss'
import { addIconToolbar } from '../../../data/toolbar/addIconToolbar'

const MemoryEnvelope = ({
  sizeMiniCard,
  section,
  address,
  setRef,
  handleClickMiniKebab,
  handleClickAddress,
}) => {
  return (
    <div
      className={`memory-card memory-envelope-card memory-envelope-${section}`}
      ref={setRef(`${section}-${address.id}`)}
      style={{
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
      }}
      onClick={() => handleClickAddress(section, address.id)}
    >
      {section === 'toaddress' ? <p>{address.address.name}</p> : ''}
      <p>{address.address.street}</p>
      <p>{address.address.index}</p>
      <p>{address.address.city}</p>
      <p>{address.address.country}</p>
      {section === 'myaddress' ? <p>{address.address.name}</p> : ''}
      <div
        className="card-mini-kebab card-mini-kebab-envelope"
        onClick={(evt) => handleClickMiniKebab(evt, section, address.id)}
      >
        {/* <CgClose className="icon-close" /> */}
        {addIconToolbar('remove')}
      </div>
    </div>
  )
}

export default MemoryEnvelope
