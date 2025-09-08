import type { RootState } from '@app/store'
import type { DispatchDate } from '../../domain'

export const selectDispatchDate = (state: RootState): DispatchDate => state.date
