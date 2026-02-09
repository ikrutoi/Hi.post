import { useSwitcherFacade } from '../facades'
// import type { Switcher } from '@entities/date/domain/types'

export const useSwitcherLogic = () => {
  const { actions } = useSwitcherFacade()

  const handleSwitcherClick = (currentPosition: 'month' | 'year') => {
    const next = currentPosition === 'month' ? 'year' : 'month'
    actions.changePosition(next)
  }

  return { handleSwitcherClick }
}
