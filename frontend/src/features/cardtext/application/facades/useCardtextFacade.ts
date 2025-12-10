import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setValue, updateToolbar, reset } from '../../infrastructure/state'
import {
  selectCardtextValue,
  selectCardtextToolbar,
  selectToolbarIconState,
} from '../../infrastructure/selectors'
import { initialCardtextValue } from '../../domain/types'
import { initialCardtextToolbarState } from '@toolbar/domain/types'
import type { CardtextKey } from '@toolbar/domain/types'
import type { CardtextValue } from '../../domain/types'

export const useCardtextFacade = () => {
  const dispatch = useAppDispatch()

  const value = useAppSelector(selectCardtextValue)
  const toolbar = useAppSelector(selectCardtextToolbar)

  const state = {
    value,
    toolbar,
    initialValue: initialCardtextValue,
    initialToolbar: initialCardtextToolbarState,
  }

  const actions = {
    setValue: (newValue: CardtextValue) => dispatch(setValue(newValue)),
    updateToolbar: (partial: Partial<typeof toolbar>) =>
      dispatch(updateToolbar(partial)),
    reset: () => dispatch(reset()),
    getIconState: (key: CardtextKey) =>
      useAppSelector(selectToolbarIconState(key)),
  }

  return { state, actions }
}
