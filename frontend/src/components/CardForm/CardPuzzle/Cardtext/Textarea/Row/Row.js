import './Row.scss'

const Row = ({ setRef, cardtext, handleInput }) => {
  return (
    <div
      className={`textarea-row textarea-row-`}
      ref={setRef(`row-${cardtext.rows}`)}
      contentEditable="true"
      onInput={handleInput}
      data-row={cardtext.rows}
    >
      {/* {cardtext.text} */}
    </div>
  )
}

export default Row
