import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectToolbarSection } from '../../infrastructure/selectors'
import type { ToolbarSection } from '../../domain/types'

import { cardtextController } from './cardtextController'
import { cardphotoController } from './cardphotoController'
import { senderController } from './senderController'
import { recipientController } from './recipientController'
import { cardPanelController } from './cardPanelController'
import { cardPanelOverlayController } from './cardPanelOverlayController'

export const useToolbarController = (section: ToolbarSection, editor?: any) => {
  const dispatch = useAppDispatch()
  const state = useAppSelector((s) => selectToolbarSection(s, section))

  const controllers = {
    cardtext: cardtextController,
    cardphoto: cardphotoController,
    sender: senderController,
    recipient: recipientController,
    cardPanel: cardPanelController,
    cardPanelOverlay: cardPanelOverlayController,
  } as const

  const controller = controllers[section]

  return {
    state, // текущее состояние секции тулбара
    actions: {
      // методы секции
      ...controller,
    },
    dispatch, // доступ к redux dispatch
    editor, // редактор, если нужен для вызова методов
  }
}
