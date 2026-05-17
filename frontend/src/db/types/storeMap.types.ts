import type { CardtextContent } from '@cardtext/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { ImageMeta, ImageRecord } from '@cardphoto/domain/types'
import type { SessionData } from '@entities/db/domain/types'
import type { CardphotoListTemplateGridCols } from '@cardphoto/infrastructure/state/cardphotoUiSlice'
import type { CardPieFavoriteTemplate } from '@features/cardPie/domain/types'

export type HistoryListPanelDensityPersisted = 1 | 2 | 3
export type AddressListPanelDensityPersisted = 1 | 2

/** Настройки UI в IndexedDB: по одной записи на `id`. */
export type UiPreferencesRecord =
  | {
      id: 'cardphotoList'
      cardphotoListTemplateGridCols: CardphotoListTemplateGridCols
    }
  | {
      id: 'historyList'
      historyListPanelDensity: HistoryListPanelDensityPersisted
    }
  | {
      id: 'addressList'
      addressListPanelDensity: AddressListPanelDensityPersisted
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

