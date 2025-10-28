import { Element } from 'slate'
import type { Node as SlateNode } from 'slate'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { cardtextActions } from '../../infrastructure/state'
import { selectCardtext } from '../../infrastructure/selectors'
import type { CardtextState, CardtextBlock } from '../../domain/types'

export const useCardtextController = () => {
  const dispatch = useAppDispatch()
  const cardtextState = useAppSelector(selectCardtext)

  const update = (payload: Partial<CardtextState>) => {
    dispatch(cardtextActions.updateCardtext(payload))
  }

  const clearContent = () => {
    dispatch(cardtextActions.clearCardtextContent())
  }

  const setText = (text: SlateNode[]) => {
    const blocks = text.filter((node): node is CardtextBlock => {
      if (!Element.isElement(node)) return false

      const element = node as CardtextBlock
      return element.type === 'paragraph' && Array.isArray(element.children)
    })

    dispatch(cardtextActions.addCardtext({ text: blocks }))
  }

  const reset = () => {
    dispatch(cardtextActions.resetCardtext())
  }

  return {
    state: {
      cardtextState,
    },
    actions: {
      update,
      clearContent,
      setText,
      reset,
    },
  }
}
