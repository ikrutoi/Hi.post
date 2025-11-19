import { useSwitcherFacade } from '../facades'
import type { Switcher } from '@entities/date/domain/types'

export const useSwitcherLogic = () => {
  const { actions: actionsSwitcher } = useSwitcherFacade()
  const { setActiveSwitcher, toggleActiveSwitcher, resetActiveSwitcher } =
    actionsSwitcher

  const handleSwitcherClick = (part: Switcher) => {
    if (part === null) {
      resetActiveSwitcher()
    } else {
      toggleActiveSwitcher(part)
    }
  }

  return {
    handleSwitcherClick,
  }
}
