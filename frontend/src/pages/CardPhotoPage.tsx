// CardPhotoPage.tsx
import { useSelector } from 'react-redux'
import Cardphoto from '../components/CardPuzzle/Cardphoto/Cardphoto'
import { ChoiceSection, ChoiceClip, SizeCard } from '../types/layout'
import { RootState } from '../store'

const CardPhotoPage = () => {
  const choiceSection = useSelector<RootState, ChoiceSection>(
    (state) => state.layout.choiceSection
  )
  const choiceClip = useSelector<RootState, ChoiceClip>(
    (state) => state.layout.choiceClip
  )
  const sizeCard = useSelector<RootState, SizeCard>(
    (state) => state.layout.sizeCard
  )

  if (!sizeCard?.width || !sizeCard?.height) return null

  return (
    <div
      className="page card-photo"
      style={{
        width: `${sizeCard.width}px`,
        height: `${sizeCard.height}px`,
      }}
    >
      <Cardphoto
        sizeCard={sizeCard}
        choiceSection={choiceSection}
        choiceClip={choiceClip}
      />
    </div>
  )
}

export default CardPhotoPage
