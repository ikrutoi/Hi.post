import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addAroma } from '../../../../redux/cardEdit/actionCreators'
import { activeSections } from '../../../../redux/layout/actionCreators'
import './Aroma.scss'
import aromaList from '../../../../data/aroma/aromaList.json'
import InfoMiniCardAroma from './InfoMiniCardAroma/InfoMiniCardAroma'

const Aroma = () => {
  const selectorCardEditAroma = useSelector((state) => state.cardEdit.aroma)
  const selectorActiveSections = useSelector(
    (state) => state.layout.activeSections
  )
  const [selectedAroma, setSelectedAroma] = useState(null)
  const dispatch = useDispatch()

  const handleSubmit = (evt) => {
    evt.preventDefault()
    dispatch(addAroma(selectedAroma))
  }

  useEffect(() => {
    if (selectedAroma) {
      dispatch(
        activeSections({
          ...selectorActiveSections,
          aroma: Boolean(selectedAroma),
        })
      )
    }
  }, [selectedAroma, dispatch])

  useEffect(() => {
    setSelectedAroma(selectorCardEditAroma)
  }, [selectorCardEditAroma])

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
            // setChoiceSection={setChoiceSection}
          />
        ))}
    </form>
  )
}

export default Aroma
