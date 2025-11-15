import { useSwitcherFacade } from '../facades'
import type { Switcher } from '@entities/date/domain/types'

export const useSwitcherLogic = () => {
  const { state, actions } = useSwitcherFacade()

  const handleSwitcherClick = (part: Switcher) => {
    if (part === null) {
      actions.resetActiveSwitcher()
    } else {
      actions.toggleActiveSwitcher(part)
    }
  }

  return {
    activePart: state.activeSwitcher,
    isMonthActive: state.isMonthActive,
    isYearActive: state.isYearActive,
    handleSwitcherClick,
  }
}
