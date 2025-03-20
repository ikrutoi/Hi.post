import { CgClose } from 'react-icons/cg'
import './MemoryCardtext.scss'

const MemoryCardtext = ({
  sizeMiniCard,
  section,
  text,
  setRef,
  handleClickAddressMiniKebab,
  handleClickAddress,
}) => {
  return (
    <div
      className="memory-card memory-cardtext-card"
      ref={setRef(`${section}-${text.id}`)}
      style={{
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
      }}
      onClick={() => handleClickAddress(section, text.id)}
    >
      <p>{text.text[0].children[0].text}</p>
      <div
        className="card-mini-kebab card-mini-kebab-envelope"
        onClick={() => handleClickAddressMiniKebab(section, text.id)}
      >
        <CgClose className="icon-close" />
      </div>
    </div>
  )
}

export default MemoryCardtext
