import type { RefObject } from 'react'
import type { CardLayer } from '@cardphoto/domain/types'
import type { CartListPanelItem } from '@cart/presentation/CartListPanel'
import type { HistoryListPanelItem } from '@date/presentation/HistoryListPanel'
import type { RightSidebarKey } from '@toolbar/domain/types/rightSidebar.types'
import type { CardSection, IconKey } from '@shared/config/constants'

export type MobileAppShellProps = {
  formRef: RefObject<HTMLDivElement | null>
  sizeCard: CardLayer
  onAppClick: (event: React.MouseEvent) => void
  pinActiveTab: Extract<RightSidebarKey, 'cart' | 'history'> | null
  activePieSide: 'left' | 'right'
  showTopCardStripFullSpan: boolean
  onBeforeLeftPieInteraction: () => void
  onLeftPieCenterClick: () => void
  /**
   * Mobile envelope: fullscreen address create — hide chrome header, pin form,
   * and paint the surface with the role form color only.
   */
  envelopeAddressCreateRole?: 'sender' | 'recipient' | null
  cardPieListPanelOpen: boolean
  onEditorPieToolbarAction?: (key: IconKey) => void | false
  onPostcardPieCartToolbarAction?: (key: IconKey) => void | false
  postcardPieCartToolbarStateOverride?: Record<string, string>
  onCartListSelectEntry: (item: CartListPanelItem) => void
  onCartListDateEditEntry: (item: CartListPanelItem) => void
  onHistoryListSelectEntry: (item: HistoryListPanelItem) => void
  onRightListPieSectorClick: (section: CardSection) => void
  onArchivePieCenterClick?: () => void
}
