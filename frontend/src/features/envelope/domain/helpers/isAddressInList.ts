import { ADDRESS_FIELD_ORDER } from '@shared/config/constants'
import type { AddressField, AddressFields } from '@shared/config/constants'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'

/** Схлопывает пробелы и trim — как при сохранении шаблона. */
export function normalizeAddressFields(
  address: Record<string, string>,
): AddressFields {
  const cleanup = (text: string) => text.split(' ').filter(Boolean).join(' ')
  return {
    name: cleanup(address.name ?? ''),
    street: cleanup(address.street ?? ''),
    city: cleanup(address.city ?? ''),
    zip: cleanup(address.zip ?? ''),
    country: cleanup(address.country ?? ''),
  }
}

/** Нормализованное сравнение одного поля (trim). */
function normalizedEq(a: string, b: string): boolean {
  return a.trim() === b.trim()
}

/** Полное побайтовое совпадение адреса (все поля после trim). */
function addressEquals(a: AddressFields, b: AddressFields): boolean {
  for (const key of ADDRESS_FIELD_ORDER) {
    if (!normalizedEq(a[key] ?? '', b[key] ?? '')) return false
  }
  return true
}

/**
 * Проверяет, есть ли текущий адрес (форма) в списке сохранённых.
 * Сначала сравнивается одно поле (по умолчанию name): если по нему нет совпадений,
 * полное сравнение не выполняется. Иначе среди записей с тем же значением поля
 * выполняется полное сравнение всех полей.
 */
export function isAddressInList(
  current: AddressFields,
  list: Pick<AddressTemplateItem, 'address'>[],
  firstField: AddressField = 'name',
): boolean {
  const firstValue = (current[firstField] ?? '').trim()
  if (firstValue === '') {
    return list.some((item) => addressEquals(current, item.address))
  }
  const byFirstField = list.filter(
    (item) => (item.address[firstField] ?? '').trim() === firstValue,
  )
  if (byFirstField.length === 0) return false
  return byFirstField.some((item) => addressEquals(current, item.address))
}

/** Возвращает id записи из списка, совпадающей с текущим адресом, или null. */
export function getMatchingEntryId(
  current: AddressFields,
  list: Pick<AddressTemplateItem, 'id' | 'address'>[],
  firstField: AddressField = 'name',
): string | null {
  const firstValue = (current[firstField] ?? '').trim()
  const toCheck =
    firstValue === ''
      ? list
      : list.filter(
          (item) =>
            (item.address?.[firstField] ?? '').trim() === firstValue,
        )
  const match = toCheck.find(
    (item) => item.address && addressEquals(current, item.address),
  )
  return match ? String(match.id) : null
}
