import type { ReactEditor } from 'slate-react'
import type { AppDispatch } from '@app/state'
import type {
  IconKey,
  IconState,
  IconStateGroup,
  // IconValue,
} from '@shared/config/constants'
import type {
  CardphotoKey,
  CardphotoToolbarState,
  CardtextKey,
  CardtextToolbarState,
  EnvelopeToolbarState,
  EditorPieKey,
  EditorPieToolbarState,
  CardPanelOverlayToolbarKey,
  CardPanelOverlayToolbarState,
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
  AddressListToolbarState,
  AddressListKey,
  AddressViewToolbarState,
  AddressViewKey,
  CardtextListToolbarState,
  CardtextListKey,
  CardphotoListToolbarState,
  CardphotoListKey,
  CartToolbarState,
  CartKey,
  PanelMiniSectionsToolbarState,
  PanelMiniSectionsKey,
  AromaToolbarState,
  AromaKey,
} from './index'
import type { RecipientsToolbarState, RecipientsKey } from './envelope.types'
import type { LayoutOrientation } from '@layout/domain/types'
import { DateKey, DateToolbarState } from './date.types'
import { DateListKey, DateListToolbarState } from './dateList.types'
import { CardPieListKey, CardPieListToolbarState } from './cardPieList.types'
import { RightSidebarKey, RightSidebarToolbarState } from './rightSidebar.types'
import { CartListKey, CartListToolbarState } from './cartList.types'
import { HistoryKey, HistoryToolbarState } from './history.types'
import { HistoryListKey, HistoryListToolbarState } from './historyList.types'
import {
  PostcardPieCartKey,
  PostcardPieCartToolbarState,
  PostcardPieHistoryKey,
  PostcardPieHistoryToolbarState,
} from './postcardPie.types'
import { UserPanelKey, UserPanelToolbarState } from './userPanel.types'

export type IconOptions = {
  badge?: number | string | null
  badgeDot?: boolean
  orientation?: LayoutOrientation
}
export interface ToolbarIcon {
  key: IconKey
  state: IconState
  options?: IconOptions
}

export interface ToolbarGroup {
  group: string
  icons: ToolbarIcon[]
  status: IconState
}

export type ToolbarConfig = ToolbarGroup[]

export const TOOLBAR_SECTIONS = [
  'cardphoto',
  'cardphotoCreate',
  'cardphotoProcessed',
  'cardphotoView',
  'cardphotoList',
  'cardtext',
  'history',
  'recipients',
  'editorPie',
  'cardPanelOverlay',
  'sectionEditorMenu',
  'addressListRecipient',
  'addressListRecipients',
  'recipientView',
  'recipientsView',
  'recipientCreate',
  'cardtextList',
  'cardtextCreate',
  'cardtextEditor',
  'cardtextView',
  'date',
  'dateList',
  'cardPieList',
  'historyList',
  'historyListIndicators',
  'cartList',
  'rightSidebar',
  'postcardPieCart',
  'postcardPieHistory',
  'cart',
  'panelMiniSections',
  'userPanel',
  'aroma',
] as const

export type ToolbarSection = (typeof TOOLBAR_SECTIONS)[number]

export type ToolbarState = {
  cardphoto: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardphotoCreate: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardphotoProcessed: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardphotoView: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardtext: CardtextToolbarState & { config: ToolbarGroup[] }
  cardphotoList: CardphotoListToolbarState & { config: ToolbarGroup[] }
  history: HistoryToolbarState & { config: ToolbarGroup[] }
  recipients: EnvelopeToolbarState & { config: ToolbarGroup[] }
  editorPie: EditorPieToolbarState & { config: ToolbarGroup[] }
  cardPanelOverlay: CardPanelOverlayToolbarState & { config: ToolbarGroup[] }
  sectionEditorMenu: SectionEditorMenuToolbarState & { config: ToolbarGroup[] }
  addressListRecipient: AddressListToolbarState & { config: ToolbarGroup[] }
  addressListRecipients: AddressListToolbarState & { config: ToolbarGroup[] }
  recipientView: AddressViewToolbarState & { config: ToolbarGroup[] }
  recipientsView: AddressViewToolbarState & { config: ToolbarGroup[] }
  recipientCreate: AddressViewToolbarState & { config: ToolbarGroup[] }
  cardtextList: CardtextListToolbarState & { config: ToolbarGroup[] }
  cardtextView: CardtextToolbarState & { config: ToolbarGroup[] }
  cardtextCreate: CardtextToolbarState & { config: ToolbarGroup[] }
  cardtextEditor: CardtextToolbarState & { config: ToolbarGroup[] }
  date: DateToolbarState & { config: ToolbarGroup[] }
  dateList: DateListToolbarState & { config: ToolbarGroup[] }
  cardPieList: CardPieListToolbarState & { config: ToolbarGroup[] }
  historyList: HistoryListToolbarState & { config: ToolbarGroup[] }
  historyListIndicators: HistoryListToolbarState & { config: ToolbarGroup[] }
  cartList: CartListToolbarState & { config: ToolbarGroup[] }
  rightSidebar: RightSidebarToolbarState & { config: ToolbarGroup[] }
  postcardPieCart: PostcardPieCartToolbarState & { config: ToolbarGroup[] }
  postcardPieHistory: PostcardPieHistoryToolbarState & {
    config: ToolbarGroup[]
  }
  cart: CartToolbarState & { config: ToolbarGroup[] }
  panelMiniSections: PanelMiniSectionsToolbarState & { config: ToolbarGroup[] }
  userPanel: UserPanelToolbarState & { config: ToolbarGroup[] }
  aroma: AromaToolbarState & { config: ToolbarGroup[] }
}

export type UpdateSectionPayload<K extends keyof ToolbarState> = {
  section: K
  value: Partial<ToolbarState[K]>
}

export interface BaseSectionConfig<
  TState,
  TKey,
  TSection extends ToolbarSection,
> {
  keys: ReadonlyArray<TKey>
  initialState: TState
  onAction: (
    key: TKey,
    section: TSection,
    editor: ReactEditor,
    dispatch: AppDispatch,
  ) => void
  group: string
  toolbar?: ToolbarConfig
  getBadges?: (state: TState) => Record<string, number | null>
}

export type ToolbarSectionConfigMap = {
  cardphoto: BaseSectionConfig<CardphotoToolbarState, CardphotoKey, 'cardphoto'>
  cardphotoCreate: BaseSectionConfig<
    CardphotoToolbarState,
    CardphotoKey,
    'cardphotoCreate'
  >
  cardphotoProcessed: BaseSectionConfig<
    CardphotoToolbarState,
    CardphotoKey,
    'cardphotoProcessed'
  >
  cardphotoView: BaseSectionConfig<
    CardphotoToolbarState,
    CardphotoKey,
    'cardphotoView'
  >
  cardphotoList: BaseSectionConfig<
    CardphotoListToolbarState,
    CardphotoListKey,
    'cardphotoList'
  >
  cardtext: BaseSectionConfig<CardtextToolbarState, CardtextKey, 'cardtext'>
  editorPie: BaseSectionConfig<EditorPieToolbarState, EditorPieKey, 'editorPie'>
  cardPanelOverlay: BaseSectionConfig<
    CardPanelOverlayToolbarState,
    CardPanelOverlayToolbarKey,
    'cardPanelOverlay'
  >
  sectionEditorMenu: BaseSectionConfig<
    SectionEditorMenuToolbarState,
    SectionEditorMenuKey,
    'sectionEditorMenu'
  >
  addressListRecipient: BaseSectionConfig<
    AddressListToolbarState,
    AddressListKey,
    'addressListRecipient'
  >
  addressListRecipients: BaseSectionConfig<
    AddressListToolbarState,
    AddressListKey,
    'addressListRecipients'
  >
  recipients: BaseSectionConfig<
    RecipientsToolbarState,
    RecipientsKey,
    'recipients'
  >
  recipientView: BaseSectionConfig<
    AddressViewToolbarState,
    AddressViewKey,
    'recipientView'
  >
  recipientsView: BaseSectionConfig<
    AddressViewToolbarState,
    AddressViewKey,
    'recipientsView'
  >
  recipientCreate: BaseSectionConfig<
    AddressViewToolbarState,
    AddressViewKey,
    'recipientCreate'
  >
  cardtextList: BaseSectionConfig<
    CardtextListToolbarState,
    CardtextListKey,
    'cardtextList'
  >
  cardtextCreate: BaseSectionConfig<
    CardtextToolbarState,
    CardtextKey,
    'cardtextCreate'
  >
  cardtextEditor: BaseSectionConfig<
    CardtextToolbarState,
    CardtextKey,
    'cardtextEditor'
  >
  cardtextView: BaseSectionConfig<
    CardtextToolbarState,
    CardtextKey,
    'cardtextView'
  >
  date: BaseSectionConfig<DateToolbarState, DateKey, 'date'>

  dateList: BaseSectionConfig<DateListToolbarState, DateListKey, 'dateList'>

  cardPieList: BaseSectionConfig<
    CardPieListToolbarState,
    CardPieListKey,
    'cardPieList'
  >

  historyList: BaseSectionConfig<
    HistoryListToolbarState,
    HistoryListKey,
    'historyList'
  >

  historyListIndicators: BaseSectionConfig<
    HistoryListToolbarState,
    HistoryListKey,
    'historyListIndicators'
  >

  cartList: BaseSectionConfig<CartListToolbarState, CartListKey, 'cartList'>

  rightSidebar: BaseSectionConfig<
    RightSidebarToolbarState,
    RightSidebarKey,
    'rightSidebar'
  >

  history: BaseSectionConfig<HistoryToolbarState, HistoryKey, 'history'>

  postcardPieCart: BaseSectionConfig<
    PostcardPieCartToolbarState,
    PostcardPieCartKey,
    'postcardPieCart'
  >

  postcardPieHistory: BaseSectionConfig<
    PostcardPieHistoryToolbarState,
    PostcardPieHistoryKey,
    'postcardPieHistory'
  >

  cart: BaseSectionConfig<CartToolbarState, CartKey, 'cart'>

  panelMiniSections: BaseSectionConfig<
    PanelMiniSectionsToolbarState,
    PanelMiniSectionsKey,
    'panelMiniSections'
  >

  // TODO: Implement userPanel toolbar
  userPanel: BaseSectionConfig<UserPanelToolbarState, UserPanelKey, 'userPanel'>
  aroma: BaseSectionConfig<AromaToolbarState, AromaKey, 'aroma'>
}

export type ToolbarKeyFor<S extends ToolbarSection> = S extends 'cardphoto'
  ? CardphotoKey
  : S extends 'cardphotoCreate'
    ? CardphotoKey
    : S extends 'cardphotoProcessed'
      ? CardphotoKey
      : S extends 'cardphotoView'
        ? CardphotoKey
        : S extends 'cardphotoList'
          ? CardphotoListKey
          : S extends 'cardtext'
            ? CardtextKey
                : S extends 'recipients'
                ? RecipientsKey
                : S extends 'editorPie'
                  ? EditorPieKey
                  : S extends 'cardPanelOverlay'
                    ? CardPanelOverlayToolbarKey
                    : S extends 'sectionEditorMenu'
                      ? SectionEditorMenuKey
                        : S extends 'addressListRecipient'
                          ? AddressListKey
                          : S extends 'addressListRecipients'
                            ? AddressListKey
                              : S extends 'recipientView'
                                ? AddressViewKey
                                : S extends 'recipientsView'
                                  ? AddressViewKey
                                    : S extends 'recipientCreate'
                                      ? AddressViewKey
                                      : S extends 'cardtextList'
                                        ? CardtextListKey
                                        : S extends 'cardtextCreate'
                                          ? CardtextKey
                                          : S extends 'cardtextEditor'
                                            ? CardtextKey
                                            : S extends 'cardtextView'
                                              ? CardtextKey
                                              : S extends 'date'
                                                ? DateKey
                                                : S extends 'dateList'
                                                  ? DateListKey
                                                  : S extends 'cardPieList'
                                                    ? CardPieListKey
                                                    : S extends 'historyList'
                                                      ? HistoryListKey
                                                      : S extends 'historyListIndicators'
                                                        ? HistoryListKey
                                                        : S extends 'cartList'
                                                          ? CartListKey
                                                          : S extends 'history'
                                                            ? HistoryKey
                                                            : S extends 'rightSidebar'
                                                              ? RightSidebarKey
                                                              : S extends 'postcardPieCart'
                                                                ? PostcardPieCartKey
                                                                : S extends 'postcardPieHistory'
                                                                  ? PostcardPieHistoryKey
                                                                  : S extends 'cart'
                                                                    ? CartKey
                                                                    : S extends 'panelMiniSections'
                                                                      ? PanelMiniSectionsKey
                                                                      : S extends 'userPanel'
                                                                        ? UserPanelKey
                                                                        : S extends 'aroma'
                                                                            ? AromaKey
                                                                            : never
