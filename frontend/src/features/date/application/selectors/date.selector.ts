import type { RootState } from '@app/state'
import type { DispatchDate } from '@entities/date/domain/types'

export const selectDispatchDate = (state: RootState): DispatchDate => state.date
