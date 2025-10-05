import { useAppDispatch } from '@app/hooks'
import { searchParent } from '@utils/searchParent'
import { dispatchSectionReset } from '../services/sectionDispatcher'
import type { CardSectionName } from '@shared/types'

export const useMiniCardKebab = () => {
  const dispatch = useAppDispatch()

  const handleClick = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
    const parent = searchParent(evt.target, 'mini-card')
    const section = parent?.dataset.section as CardSectionName | undefined
    if (section) {
      await dispatchSectionReset(section, dispatch)
    }
  }

  return { handleClick }
}
