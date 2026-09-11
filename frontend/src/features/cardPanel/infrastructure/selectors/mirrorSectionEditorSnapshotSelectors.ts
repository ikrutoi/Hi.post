import type { RootState } from '@app/state'
import { selectSelectedAroma } from '@aroma/infrastructure/selectors'
import { selectCardphotoAppliedData } from '@cardphoto/infrastructure/selectors'
import { selectCardtextState } from '@cardtext/infrastructure/selectors'
import { selectAppliedDates } from '@date/infrastructure/selectors'
import { selectAppliedRecipientDisplayAddress } from '@envelope/recipient/infrastructure/selectors'
import { selectAppliedSenderDisplayAddress } from '@envelope/sender/infrastructure/selectors'
import type { MirrorSectionEditorSnapshot } from '../../application/helpers/mirrorSectionEditorSync'

export const selectMirrorSectionEditorSnapshot = (
  state: RootState,
): MirrorSectionEditorSnapshot => ({
  cardphotoAppliedData: selectCardphotoAppliedData(state),
  cardtextApplied: selectCardtextState(state)?.appliedData ?? null,
  appliedRecipientAddress: selectAppliedRecipientDisplayAddress(state),
  appliedSenderAddress: selectAppliedSenderDisplayAddress(state),
  selectedAroma: selectSelectedAroma(state),
  selectedDates: selectAppliedDates(state),
})
