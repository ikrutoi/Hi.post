import { TbGenderFemale, TbGenderMale } from 'react-icons/tb'
import './AromaElement.scss'

const AromaElement = ({ selectedAroma, setSelectedAroma, elementAroma }) => {
  return (
    <button
      className={`aroma-element ${
        !!selectedAroma &&
        selectedAroma.make === elementAroma.make &&
        selectedAroma.name === elementAroma.name
          ? 'selected'
          : ''
      } ${elementAroma.make === '0' ? 'aroma-element-none' : ''}`}
      type="submit"
      onClick={() =>
        setSelectedAroma({
          make: elementAroma.make,
          name: elementAroma.name,
          index: elementAroma.index,
          gender: elementAroma.gender,
        })
      }
    >
      {elementAroma.make !== '0' ? (
        <>
          <span>{elementAroma.make}</span>
          <span>&bull;</span>
          <span>{elementAroma.name}</span>
        </>
      ) : (
        <span>{elementAroma.name}</span>
      )}
      <span className="icon-gender">
        {elementAroma.gender === 'male' ? (
          <TbGenderMale style={{ backgroundColor: 'rgb(211,211,211)' }} />
        ) : (
          <TbGenderFemale style={{ backgroundColor: 'rgb(211,211,211)' }} />
        )}
      </span>
    </button>
  )
}

export default AromaElement
