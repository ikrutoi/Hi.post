import type { CardtextContent } from '@cardtext/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { ImageMeta, ImageRecord } from '@cardphoto/domain/types'
import type { SessionData } from '@entities/db/domain/types'
import type { CardphotoListTemplateGridCols } from '@cardphoto/infrastructure/state/cardphotoUiSlice'
import type { PanelDensity2Size } from '@shared/ui/icons'
import type { CardPieFavoriteTemplate } from '@features/cardPie/domain/types'

export type HistoryListPanelDensityPersisted = 1 | 2
export type AddressListPanelDensityPersisted = 1 | 2

/** Настройки UI в IndexedDB: по одной записи на `id`. */
export type UiPreferencesRecord =
  | {
      id: 'cardphotoList'
      cardphotoListPanelDensity: PanelDensity2Size
      /** @deprecated Migrated to `cardphotoListPanelDensity` on read. */
      cardphotoListTemplateGridCols?: CardphotoListTemplateGridCols
    }
  | {
      id: 'historyList'
      historyListPanelDensity: HistoryListPanelDensityPersisted
    }
  | {
      id: 'addressList'
      senderAddressListPanelDensity: AddressListPanelDensityPersisted
      recipientAddressListPanelDensity: AddressListPanelDensityPersisted
      /** @deprecated Одно значение на оба списка; при чтении — fallback. */
      addressListPanelDensity?: AddressListPanelDensityPersisted
    }

export interface StoreMap {
  stockImages: ImageRecord
  userImages: ImageRecord
  cardphotoImages: ImageMeta & { id: string }
  applyImage: ImageRecord
  cardtext: CardtextContent
  sender: AddressTemplateItem
  recipient: AddressTemplateItem
  postcards: PostcardHydrated
  cardPieFavorites: CardPieFavoriteTemplate
  session: SessionData
  uiPreferences: UiPreferencesRecord
}

