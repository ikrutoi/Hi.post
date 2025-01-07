import './AromaElement.scss'

const AromaElement = ({
  selectedAroma,
  makeAroma,
  nameAroma,
  setSelectedAroma,
}) => {
  return (
    <button
      className={`aroma-element ${
        !!selectedAroma &&
        selectedAroma.make === makeAroma &&
        selectedAroma.name === nameAroma
          ? 'selected'
          : ''
      }`}
      type="submit"
      onClick={() => setSelectedAroma({ make: makeAroma, name: nameAroma })}
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
