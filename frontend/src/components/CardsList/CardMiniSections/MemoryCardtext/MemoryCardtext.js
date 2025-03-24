import { CgClose } from 'react-icons/cg'
import './MemoryCardtext.scss'

const MemoryCardtext = ({
  sizeMiniCard,
  text,
  setRef,
  handleClickMiniKebab,
  handleClickCardtext,
}) => {
  const fillText = () => {
    return Object.values(text.text).map((el, i, arr) => {
      if (i === 0) {
        const firstText = el.children[0].text.slice(0, 12)
        return firstText.length < 12 ? (
          <p key={`long-${firstText}-${i}`}>{firstText}...</p>
        ) : (
          <p key={`short-${firstText}-${i}`}>{firstText}</p>
        )
      }
      return i > 0 && i < arr.length - 1 ? (
        <p key={`short-text-${i}`}>{el.children[0].text}</p>
      ) : (
        <p key={`long-text-${i}`}>{el.children[0].text}...</p>
      )
    })
  }

  return (
    <div
      className="memory-card memory-cardtext-card"
      ref={setRef(`cardtext-${text.id}`)}
      style={{
        width: `${sizeMiniCard.width}px`,
        height: `${sizeMiniCard.height}px`,
      }}
      onClick={() => handleClickCardtext(text.id)}
    >
      {fillText()}
      <div
        className="card-mini-kebab card-mini-kebab-envelope"
        onClick={() => handleClickMiniKebab('cardtext', text.id)}
      >
        <CgClose className="icon-close" />
      </div>
    </div>
  )
}

export default MemoryCardtext
