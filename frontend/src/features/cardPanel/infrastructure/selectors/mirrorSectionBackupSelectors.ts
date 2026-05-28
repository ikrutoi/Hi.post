import type { RootState } from '@app/state'
import type { CardPanelSection } from '../../domain/types'
import type { MirrorSectionBackup } from '../../domain/types/mirrorSectionBackup.types'

export const selectMirrorSectionBackup = (
  state: RootState,
  section: CardPanelSection,
): MirrorSectionBackup | undefined =>
  state.mirrorSectionBackup.bySection[section]
