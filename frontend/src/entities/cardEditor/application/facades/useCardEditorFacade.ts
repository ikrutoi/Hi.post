import { useAppDispatch, useAppSelector } from '@app/hooks'
import { resetEditor, setHoveredSection } from '../../infrastructure/state'
import {
  selectCardEditorState,
  selectCardEditorId,
  selectIsCardEditorCompleted,
  selectHoveredSection,
} from '../../infrastructure/selectors'
import { CARD_SECTIONS } from '@shared/config/constants'
import type { CardSection } from '@shared/config/constants'
import { clearDate } from '@date/infrastructure/state'
import { clear as clearAroma } from '@aroma/infrastructure/state'
import { setSenderApplied } from '@envelope/sender/infrastructure/state'
import { setRecipientApplied } from '@envelope/recipient/infrastructure/state'
import { setComplete } from '@cardtext/infrastructure/state'
import { clearApply } from '@cardphoto/infrastructure/state'

export const useCardEditorFacade = () => {
  const dispatch = useAppDispatch()

  const editorState = useAppSelector(selectCardEditorState)
  const editorId = useAppSelector(selectCardEditorId)
  const isCompleted = useAppSelector(selectIsCardEditorCompleted)
  const hoveredSection = useAppSelector(selectHoveredSection)

  /** Закрытие мини-секции: фото/текст/конверт — снять Apply; аромат/дата — сбросить выбор */
  const removeSection = (section: CardSection) => {
    switch (section) {
      case 'date':
        dispatch(clearDate())
        break
      case 'aroma':
        dispatch(clearAroma())
        break
      case 'envelope':
        dispatch(setSenderApplied(false))
        dispatch(setRecipientApplied(false))
        break
      case 'cardtext':
        dispatch(setComplete(false))
        break
      case 'cardphoto':
        dispatch(clearApply())
        break
    }
  }
  const reset = () => dispatch(resetEditor())
  const setHovered = (section: CardSection | null) =>
    dispatch(setHoveredSection(section))

  const isSectionHovered = (section: CardSection) => hoveredSection === section

  return {
    editorState,
    editorId,
    isCompleted,
    hoveredSection,
    sections: CARD_SECTIONS,
    removeSection,
    reset,
    setHovered,
    isSectionHovered,
  }
}
