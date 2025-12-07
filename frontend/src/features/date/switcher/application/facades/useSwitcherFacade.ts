import { useSwitcherController } from '../controllers'
import {
  selectSwitcher,
  selectSwitcherPosition,
} from '../../infrastructure/selectors'
import { togglePosition, setPosition } from '../../infrastructure/state'

export const useSwitcherFacade = () => {
  const controller = useSwitcherController()

  return {
    state: {
      position: controller.position,
    },

    actions: {
      toggle: controller.toggle,
      changePosition: controller.changePosition,

      togglePosition,
      setPosition,
    },

    selectors: {
      selectSwitcher,
      selectSwitcherPosition,
    },
  }
}
