import { useAppDispatch } from '@app/hooks'
// import { resetCardSection } from '../services/resetCardSection'
import type { CardSectionName } from '@shared/types'

export const useMiniCardKebab = (section: CardSectionName) => {
  const dispatch = useAppDispatch()

  const handleClick = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
    // await resetCardSection(section, dispatch)
  }

  return { handleClick }
}
