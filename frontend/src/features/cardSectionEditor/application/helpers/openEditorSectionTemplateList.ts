import { setCardphotoListPanelOpen } from '@cardphoto/infrastructure/state'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import { setActiveAddressList } from '@envelope/infrastructure/state'
import type { CardSection } from '@shared/config/constants'
import type { AppDispatch } from '@app/state'

/**
 * Desktop right column: open the section template list when entering edit
 * for photo / text / envelope. Mobile factory chrome stays closed.
 */
export function openEditorSectionTemplateList(
  dispatch: AppDispatch,
  section: CardSection | null | undefined,
  isMobileLayout: boolean,
): void {
  if (isMobileLayout) return
  if (section === 'cardphoto') {
    dispatch(setCardphotoListPanelOpen(true))
    return
  }
  if (section === 'cardtext') {
    dispatch(setCardtextListPanelOpen(true))
    return
  }
  if (section === 'envelope') {
    dispatch(setActiveAddressList('recipients'))
  }
}
