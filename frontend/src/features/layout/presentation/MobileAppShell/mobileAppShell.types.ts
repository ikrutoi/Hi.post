import type { RefObject } from 'react'
import type { RightListArchiveMiniContextValue } from '@cardPanel/presentation/RightListArchiveMiniContext'
import type { CartListPanelItem } from '@cart/presentation/CartListPanel'
import type { HistoryListPanelItem } from '@date/presentation/HistoryListPanel'
import type { CardLayer } from '@cardphoto/domain/types'
import type { CardSection } from '@shared/config/constants'
import type { RightSidebarKey } from '@toolbar/domain/types/rightSidebar.types'

export type MobileAppShellProps = {
  formRef: RefObject<HTMLDivElement | null>
  cardPanelRef: RefObject<HTMLDivElement | null>
  sizeCard: CardLayer
  onAppClick: (event: React.MouseEvent) => void
  onSectionEditorMenuAction: () => void
  suppressSectionMenuActiveHighlight: boolean
  pinActiveTab: Extract<RightSidebarKey, 'cart' | 'history'> | null
  activePieSide: 'left' | 'right'
  showTopCardStripFullSpan: boolean
  onBeforeLeftPieInteraction: () => void
  onLeftPieCenterClick: () => void
  centerStripMirrorValue: RightListArchiveMiniContextValue
  onPanelMiniSectionsToolbarAction: (key: string) => void
  onBeforeOpenMiniSection: () => void
  onActivateSectionPeekNoToolbar: (section: CardSection) => void
  hideSectionToolbar: boolean
  listPanelOpen: boolean
  onCartListSelectEntry: (item: CartListPanelItem) => void
  onCartListDateEditEntry: (item: CartListPanelItem) => void
  onHistoryListSelectEntry: (item: HistoryListPanelItem) => void
}
