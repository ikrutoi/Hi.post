// import { useSelector } from 'react-redux'
import CardMiniPuzzle from './CardMiniPuzzle/CardMiniPuzzle'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import './CardsList.scss'

const CardsList = ({ name, hover, dimensionHeight, dimensionWidth }) => {
  // const nameToLowerCase = name.toLowerCase()
  // console.log('/', nameToLowerCase)
  // const sector = useSelector((state) => state[{ nameToLowerCase }])
  // console.log('*', sector)
  return (
    <div className="cards-list">
      <CardMiniPuzzle
        hover={hover}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
      />
      <CardMiniSection
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
      />
    </div>
  )
}

export default CardsList
