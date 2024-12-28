import './AromaElement.scss'

const AromaElement = ({ makeAroma, nameAroma, handleFormAroma }) => {
  return (
    <button
      className="aroma-element"
      type="submit"
      onClick={() => handleFormAroma(makeAroma, nameAroma)}
    >
      {makeAroma ? (
        <>
          <span>{makeAroma}</span>
          <span>&bull;</span>
          <span>{nameAroma}</span>
        </>
      ) : (
        <span>{nameAroma}</span>
      )}
    </button>
  )
}

export default AromaElement
