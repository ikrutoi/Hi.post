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
  EnvelopeKey,
  EditorPieKey,
  EditorPieToolbarState,
  CardPanelOverlayToolbarKey,
  CardPanelOverlayToolbarState,
  SectionEditorMenuToolbarState,
  SectionEditorMenuKey,
  AddressListToolbarState,
  AddressListKey,
  AddressFavoriteToolbarState,
  AddressFavoriteKey,
  AddressViewToolbarState,
  AddressViewKey,
  CardtextListToolbarState,
  CardtextListKey,
  CardphotoListToolbarState,
  CardphotoListKey,
} from './index'
import type { RecipientsToolbarState, RecipientsKey } from './envelope.types'
import type { LayoutOrientation } from '@layout/domain/types'
import { DateKey, DateToolbarState } from './date'
import { DateListKey, DateListToolbarState } from './dateList.types'
import { RightSidebarKey, RightSidebarToolbarState } from './rightSidebar.types'
import { CartListKey, CartListToolbarState } from './cartList.types'

export type IconOptions = {
  badge?: number | null
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
  'sender',
  'recipient',
  'recipients',
  'editorPie',
  'cardPanelOverlay',
  'sectionEditorMenu',
  'addressListSender',
  'addressListRecipient',
  'addressListRecipients',
  'recipientFavorite',
  'senderFavorite',
  'savedRecipientAddress',
  'senderView',
  'recipientView',
  'recipientsView',
  'addressFormSenderView',
  'addressFormRecipientView',
  'cardtextList',
  'cardtextCreate',
  'cardtextEditor',
  'cardtextView',
  'cardtextProcessed',
  'date',
  'dateList',
  'dateListIndicators',
  'cartList',
  'rightSidebar',
] as const

export type ToolbarSection = (typeof TOOLBAR_SECTIONS)[number]

export type ToolbarState = {
  cardphoto: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardphotoCreate: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardphotoProcessed: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardphotoView: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardtext: CardtextToolbarState & { config: ToolbarGroup[] }
  cardphotoList: CardphotoListToolbarState & { config: ToolbarGroup[] }
  sender: EnvelopeToolbarState & { config: ToolbarGroup[] }
  recipient: EnvelopeToolbarState & { config: ToolbarGroup[] }
  recipients: EnvelopeToolbarState & { config: ToolbarGroup[] }
  editorPie: EditorPieToolbarState & { config: ToolbarGroup[] }
  cardPanelOverlay: CardPanelOverlayToolbarState & { config: ToolbarGroup[] }
  sectionEditorMenu: SectionEditorMenuToolbarState & { config: ToolbarGroup[] }
  addressListSender: AddressListToolbarState & { config: ToolbarGroup[] }
  addressListRecipient: AddressListToolbarState & { config: ToolbarGroup[] }
  addressListRecipients: AddressListToolbarState & { config: ToolbarGroup[] }
  recipientFavorite: AddressFavoriteToolbarState & { config: ToolbarGroup[] }
  senderFavorite: AddressFavoriteToolbarState & { config: ToolbarGroup[] }
  senderView: AddressViewToolbarState & { config: ToolbarGroup[] }
  recipientView: AddressViewToolbarState & { config: ToolbarGroup[] }
  recipientsView: AddressViewToolbarState & { config: ToolbarGroup[] }
  addressFormSenderView: AddressViewToolbarState & { config: ToolbarGroup[] }
  addressFormRecipientView: AddressViewToolbarState & { config: ToolbarGroup[] }
  cardtextList: CardtextListToolbarState & { config: ToolbarGroup[] }
  cardtextView: CardtextToolbarState & { config: ToolbarGroup[] }
  cardtextCreate: CardtextToolbarState & { config: ToolbarGroup[] }
  cardtextEditor: CardtextToolbarState & { config: ToolbarGroup[] }
  cardtextProcessed: CardtextToolbarState & { config: ToolbarGroup[] }
  date: DateToolbarState & { config: ToolbarGroup[] }
  dateList: DateListToolbarState & { config: ToolbarGroup[] }
  dateListIndicators: DateListToolbarState & { config: ToolbarGroup[] }
  cartList: CartListToolbarState & { config: ToolbarGroup[] }
  rightSidebar: RightSidebarToolbarState & { config: ToolbarGroup[] }
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
  sender: BaseSectionConfig<EnvelopeToolbarState, EnvelopeKey, 'sender'>
  recipient: BaseSectionConfig<EnvelopeToolbarState, EnvelopeKey, 'recipient'>
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
  addressListSender: BaseSectionConfig<
    AddressListToolbarState,
    AddressListKey,
    'addressListSender'
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
  recipientFavorite: BaseSectionConfig<
    AddressFavoriteToolbarState,
    AddressFavoriteKey,
    'recipientFavorite'
  >
  recipients: BaseSectionConfig<
    RecipientsToolbarState,
    RecipientsKey,
    'recipients'
  >
  senderFavorite: BaseSectionConfig<
    AddressFavoriteToolbarState,
    AddressFavoriteKey,
    'senderFavorite'
  >
  senderView: BaseSectionConfig<
    AddressViewToolbarState,
    AddressViewKey,
    'senderView'
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
  addressFormSenderView: BaseSectionConfig<
    AddressViewToolbarState,
    AddressViewKey,
    'addressFormSenderView'
  >
  addressFormRecipientView: BaseSectionConfig<
    AddressViewToolbarState,
    AddressViewKey,
    'addressFormRecipientView'
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
  cardtextProcessed: BaseSectionConfig<
    CardtextToolbarState,
    CardtextKey,
    'cardtextProcessed'
  >
  date: BaseSectionConfig<DateToolbarState, DateKey, 'date'>

  dateList: BaseSectionConfig<DateListToolbarState, DateListKey, 'dateList'>

  dateListIndicators: BaseSectionConfig<
    DateListToolbarState,
    DateListKey,
    'dateListIndicators'
  >

  cartList: BaseSectionConfig<CartListToolbarState, CartListKey, 'cartList'>

  rightSidebar: BaseSectionConfig<
    RightSidebarToolbarState,
    RightSidebarKey,
    'rightSidebar'
  >
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
            : S extends 'sender'
              ? EnvelopeKey
              : S extends 'recipient'
                ? EnvelopeKey
                : S extends 'recipients'
                  ? RecipientsKey
                  : S extends 'editorPie'
                    ? EditorPieKey
                    : S extends 'cardPanelOverlay'
                      ? CardPanelOverlayToolbarKey
                      : S extends 'sectionEditorMenu'
                        ? SectionEditorMenuKey
                        : S extends 'addressListSender'
                          ? AddressListKey
                          : S extends 'addressListRecipient'
                            ? AddressListKey
                            : S extends 'addressListRecipients'
                              ? AddressListKey
                              : S extends 'recipientFavorite'
                                ? AddressFavoriteKey
                                : S extends 'senderFavorite'
                                  ? AddressFavoriteKey
                                  : S extends 'senderView'
                                    ? AddressViewKey
                                    : S extends 'recipientView'
                                      ? AddressViewKey
                                      : S extends 'recipientsView'
                                        ? AddressViewKey
                                        : S extends 'addressFormSenderView'
                                          ? AddressViewKey
                                          : S extends 'addressFormRecipientView'
                                            ? AddressViewKey
                                            : S extends 'cardtextList'
                                              ? CardtextListKey
                                              : S extends 'cardtextCreate'
                                                ? CardtextKey
                                                : S extends 'cardtextEditor'
                                                  ? CardtextKey
                                                  : S extends 'cardtextView'
                                                    ? CardtextKey
                                                    : S extends 'cardtextProcessed'
                                                      ? CardtextKey
                                                      : S extends 'date'
                                                        ? DateKey
                                                        : S extends 'dateList'
                                                          ? DateListKey
                                                          : S extends 'dateListIndicators'
                                                            ? DateListKey
                                                            : S extends 'cartList'
                                                              ? CartListKey
                                                              : S extends 'rightSidebar'
                                                                ? RightSidebarKey
                                                                : never
