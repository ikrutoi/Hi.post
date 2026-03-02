export * from './recipientSlice'
export { default as recipientReducer } from './recipientSlice'
// Реэкспорт экшенов envelope (envelopeSelection / envelopeRecipients) для фасада получателя. setRecipientMode теперь в recipientSlice
export {
  closeRecipientListPanel,
  toggleRecipientSelection,
  removeRecipientAt,
} from '@envelope/infrastructure/state'
