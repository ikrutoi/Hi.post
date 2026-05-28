import { createAction } from '@reduxjs/toolkit'
import type { CardPanelSection } from '../../domain/types'

/** Отменить копирование секции из правого CardPie и вернуть данные левого до apply. */
export const revertMirrorSectionCopyRequested = createAction<{
  section: CardPanelSection
}>('cardPanel/revertMirrorSectionCopyRequested')
