import type { CartListStatusSegment } from '@cart/domain/types'
import { CART_LIST_TOOLBAR } from '@toolbar/domain/types/cartList.types'
import { withDisabledToolbarGroups } from '@toolbar/domain/helpers'
import type { ToolbarConfig } from '@toolbar/domain/types/toolbar.types'

/** Группы нижнего тулбара списка корзины. listDelete жив только при отмеченных строках. */
export function cartListToolbarGroups(options: {
  listSegment: CartListStatusSegment
  checkedCount: number
  /** Все строки текущего сегмента отмечены — галочка на checkBox. */
  allChecked: boolean
  hasRows: boolean
}): ToolbarConfig {
  const canDelete = options.checkedCount > 0
  const groups: ToolbarConfig = CART_LIST_TOOLBAR.map((group) => ({
    ...group,
    icons: group.icons.map((icon) => {
      if (icon.key === 'listDelete') {
        return { ...icon, state: canDelete ? 'enabled' : 'disabled' }
      }
      if (icon.key === 'checkBox') {
        return { ...icon, state: options.allChecked ? 'active' : 'enabled' }
      }
      return icon
    }),
  }))
  return options.hasRows ? groups : withDisabledToolbarGroups(groups)
}
