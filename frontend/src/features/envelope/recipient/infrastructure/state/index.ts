export * from './recipientSlice'
export { default as recipientReducer } from './recipientSlice'
// Реэкспорт экшенов envelope (envelopeSelection / envelopeRecipients) для фасада получателя.
export {
  closeAddressList,
  toggleRecipientSelection,
  removeRecipientAt,
  removeRecipientFromListByIndex,
  removeRecipientFromListById,
} from '@envelope/infrastructure/state'
