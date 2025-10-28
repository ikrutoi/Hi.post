import { RootState } from '@app/state'
import type { CardMenuSection } from '@shared/config/constants'

export const getSelectedCardMenuSection = (
  state: RootState
): CardMenuSection | null => state.cardMenuNav.selectedCardMenuSection
