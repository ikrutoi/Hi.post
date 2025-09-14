import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setCardphotoActive, selectCardphotoActive } from '../state'

export const useCardphotoActiveController = () => {
  const dispatch = useAppDispatch()
  const active = useAppSelector(selectCardphotoActive)

  const setActive = (value: string | null | undefined) =>
    dispatch(setCardphotoActive(value))

  return { active, setActive }
}
