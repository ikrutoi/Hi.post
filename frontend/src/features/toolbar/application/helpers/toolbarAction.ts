import { createAction } from '@reduxjs/toolkit'
import type { CardtextInteractionMode } from '@cardtext/domain/cardtextInteractionMode'
import type { ToolbarSection } from '../../domain/types'
import type { IconKey } from '@shared/config/constants'

export const toolbarAction = createAction<{
  section: ToolbarSection
  key: IconKey
  payload?: any
  /**
   * Зафиксированный режим cardtext на момент клика (тесты / явная шина).
   * Если не передан — сага берёт `selectCardtextInteractionMode` из стора.
   */
  cardtextInteractionMode?: CardtextInteractionMode
}>('toolbar/action')
