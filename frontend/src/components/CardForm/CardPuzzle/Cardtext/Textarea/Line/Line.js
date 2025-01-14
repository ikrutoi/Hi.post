import './Line.scss'

const Line = ({ setRef, cardtext, handleInputLine, handleKeyDown }) => {
  return (
    <div
      className={`textarea-line textarea-line-${cardtext.lines}`}
      // key={cardtext.lines}
      ref={setRef(`line-${cardtext.lines}`)}
      contentEditable="true"
      onInput={handleInputLine}
      // onKeyDown={handleKeyDown}
      data-line={cardtext.lines}
    >
      {/* {`${}`} */}
    </div>
  )
}

export default Line
