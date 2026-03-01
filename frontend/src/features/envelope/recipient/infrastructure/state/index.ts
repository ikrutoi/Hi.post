export * from './recipientSlice'
export { default as recipientReducer } from './recipientSlice'
// Реэкспорт экшенов envelope (envelopeSelection / envelopeRecipients) для фасада получателя. setRecipientMode теперь в recipientSlice
export {
  setRecipientDraft,
  closeRecipientListPanel,
  toggleRecipientSelection,
  removeRecipientAt,
} from '@envelope/infrastructure/state'
