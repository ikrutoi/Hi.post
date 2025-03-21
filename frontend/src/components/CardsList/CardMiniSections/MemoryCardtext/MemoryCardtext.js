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
  // const firstText = text.text[0].children[0].text.slice(0, 12)
  const fillText = () => {
    return Object.values(text.text).map((el, i, arr) => {
      if (i === 0) {
        const firstText = el.children[0].text.slice(0, 12)
        return firstText.length < 12 ? (
          <p>{firstText}...</p>
        ) : (
          <p>{firstText}</p>
        )
      }
      return i > 0 && i < arr.length - 1 ? (
        <p>{el.children[0].text}</p>
      ) : (
        <p>{el.children[0].text}...</p>
      )
    })
  }

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
      {fillText()}
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
