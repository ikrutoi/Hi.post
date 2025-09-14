import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@app/state'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
