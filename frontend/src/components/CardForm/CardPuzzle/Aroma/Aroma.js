import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addAroma } from '../../../../redux/cardSections/actionCreators'
import './Aroma.scss'
import AromaElement from './AromaElement/AromaElement'
import aromaList from '../../../../data/aromaList.json'

const Aroma = () => {
  const [formAroma, setFormAroma] = useState({
    section: 'aroma',
    make: '',
    name: '',
  })
  const dispatch = useDispatch()
  const handleFormAroma = (newMake, newName) => {
    setFormAroma((state) => ({ ...state, make: newMake, name: newName }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addAroma(formAroma))
  }

  return (
    <form className="aroma" onSubmit={handleSubmit}>
      {aromaList
        .sort((name1, name2) => (name1.make > name2.make ? 1 : -1))
        .map((el, i) => (
          <AromaElement
            makeAroma={el.make}
            nameAroma={el.name}
            key={i}
            handleFormAroma={handleFormAroma}
          />
        ))}
    </form>
  )
}

export default Aroma
