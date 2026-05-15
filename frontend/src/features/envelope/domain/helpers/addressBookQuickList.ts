import type { ListStatus } from '@entities/envelope/domain/types'

/**
 * Запись участвует в «быстром» списке адресной книги (панели отправитель/получатели).
 * Совпадает с фильтром в addressBookSyncSaga: inList и legacy без listStatus.
 * outList — только в БД; addList/removeFromList в тулбаре переключают этот статус.
 */
export function listStatusIsInQuickAddressBook(
  listStatus: ListStatus | undefined,
): boolean {
  return listStatus === undefined || listStatus === 'inList'
}
