import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addAroma } from '../../../../redux/cardEdit/actionCreators'
import './Aroma.scss'
// import AromaElement from './AromaElement/AromaElement'
import aromaList from '../../../../data/aroma/aromaList.json'
import InfoMiniCardAroma from './InfoMiniCardAroma/InfoMiniCardAroma'

const Aroma = ({ setChoiceSection }) => {
  const selectors = useSelector((state) => state.cardEdit)
  const inputValueSelectedAroma = selectors.aroma ? selectors.aroma : null
  const [selectedAroma, setSelectedAroma] = useState(inputValueSelectedAroma)
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addAroma(selectedAroma))
  }

  return (
    <form className="aroma" onSubmit={handleSubmit}>
      {aromaList
        .sort((name1, name2) => (name1.make > name2.make ? 1 : -1))
        .map((el, i) => (
          <InfoMiniCardAroma
            key={`${el.name}-${i}`}
            selectedAroma={selectedAroma}
            elementAroma={el}
            setSelectedAroma={setSelectedAroma}
            setChoiceSection={setChoiceSection}
          />
        ))}
    </form>
  )
}

export default Aroma
