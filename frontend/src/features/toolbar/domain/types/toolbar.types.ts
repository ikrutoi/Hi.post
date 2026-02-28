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
} from './index'
import type { RecipientsToolbarState, RecipientsKey } from './envelope.types'
import type { LayoutOrientation } from '@layout/domain/types'

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
  'cardtext',
  'sender',
  'recipient',
  'recipients',
  'editorPie',
  'cardPanelOverlay',
  'sectionEditorMenu',
  'addressList',
  'recipientFavorite',
  'senderFavorite',
  'savedRecipientAddress',
  'senderView',
  'recipientView',
  'recipientsView',
] as const

export type ToolbarSection = (typeof TOOLBAR_SECTIONS)[number]

export type ToolbarState = {
  cardphoto: CardphotoToolbarState & { config: ToolbarGroup[] }
  cardtext: CardtextToolbarState & { config: ToolbarGroup[] }
  sender: EnvelopeToolbarState & { config: ToolbarGroup[] }
  recipient: EnvelopeToolbarState & { config: ToolbarGroup[] }
  recipients: EnvelopeToolbarState & { config: ToolbarGroup[] }
  editorPie: EditorPieToolbarState & { config: ToolbarGroup[] }
  cardPanelOverlay: CardPanelOverlayToolbarState & { config: ToolbarGroup[] }
  sectionEditorMenu: SectionEditorMenuToolbarState & { config: ToolbarGroup[] }
  addressList: AddressListToolbarState & { config: ToolbarGroup[] }
  recipientFavorite: AddressFavoriteToolbarState & { config: ToolbarGroup[] }
  senderFavorite: AddressFavoriteToolbarState & { config: ToolbarGroup[] }
  senderView: AddressViewToolbarState & { config: ToolbarGroup[] }
  recipientView: AddressViewToolbarState & { config: ToolbarGroup[] }
  recipientsView: AddressViewToolbarState & { config: ToolbarGroup[] }
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
  addressList: BaseSectionConfig<
    AddressListToolbarState,
    AddressListKey,
    'addressList'
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
}

export type ToolbarKeyFor<S extends ToolbarSection> = S extends 'cardphoto'
  ? CardphotoKey
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
                : S extends 'addressList'
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
                            : never
