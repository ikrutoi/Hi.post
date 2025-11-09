import type { RootState } from '@app/state'
import type { SelectedDispatchDate } from '@entities/date/domain/types'

export const selectDispatchDate = (state: RootState): SelectedDispatchDate =>
  state.date
