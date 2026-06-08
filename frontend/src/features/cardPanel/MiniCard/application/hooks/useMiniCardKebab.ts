import { useAppDispatch } from '@app/hooks'
import type { CardSectionName } from '@shared/types'

export const useMiniCardKebab = (section: CardSectionName) => {
  const dispatch = useAppDispatch()

  const handleClick = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
  }

  return { handleClick }
}
