import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setValue, updateToolbar, reset } from '../../infrastructure/state'
import {
  selectCardtextValue,
  selectCardtextToolbar,
  selectToolbarIconState,
} from '../../infrastructure/selectors'
import type { CardtextKey } from '@toolbar/domain/types'
import type { CardtextValue } from '../../domain/types'

export const useCardtextController = () => {
  const dispatch = useAppDispatch()

  const value = useAppSelector(selectCardtextValue)
  const toolbar = useAppSelector(selectCardtextToolbar)

  const getIconState = (key: CardtextKey) =>
    useAppSelector(selectToolbarIconState(key))

  const setCardtextValue = (newValue: CardtextValue) =>
    dispatch(setValue(newValue))

  const updateCardtextToolbar = (partial: Partial<typeof toolbar>) =>
    dispatch(updateToolbar(partial))

  const resetCardtext = () => dispatch(reset())

  return {
    value,
    toolbar,
    getIconState,
    setCardtextValue,
    updateCardtextToolbar,
    resetCardtext,
  }
}
