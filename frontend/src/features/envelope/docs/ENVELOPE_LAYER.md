# Разграничение: envelope vs sender vs recipient

Цель — опираться на фичи **sender** и **recipient**, слой **envelope** оставить минимальным (только общее).

## Текущее состояние

### Слой envelope (инфраструктура)

| Источник | Что хранит | Кто использует |
|----------|------------|----------------|
| **envelopeSelectionSlice** | `recipientsPendingIds`, `recipientListPanelOpen`, `recipientDraft`, `recipientViewEditMode`, `senderListPanelOpen`, `senderViewEditMode`, `senderDraft`, `showAddressFormView`, `addressFormViewRole` | recipientSelector, envelope selectors, envelopeToolbarSaga, envelopeProcessSaga, sessionSaga, AddressView, useEnvelopeFacade |
| **envelopeRecipientsSlice** | Список `RecipientState[]` (режим «несколько получателей») | recipientSelector, envelope selectors, sessionSaga, envelopeProcessSaga |

### Уже в фичах sender / recipient

- **sender:** `senderSlice` — данные отправителя, viewId, applied, enabled.
- **recipient:** `recipientSlice` — данные получателя, recipientViewId, recipientsViewIds, **enabled** (= режим один/несколько).

`recipient.mode` — источник правды для режима один/несколько (`'recipient' | 'recipients'`); `envelopeSelection.recipientMode` больше не используется.

---

## Предлагаемое разграничение

### Перенести в **recipient**

- **Список получателей в режиме «несколько»** — перенести `envelopeRecipients` в фичу recipient (например `recipient/infrastructure/state/recipientsListSlice.ts`). Слайс остаётся в root как `state.recipientsList` или оставить ключ `envelopeRecipients` для обратной совместиости, но владелец — фича recipient (селекторы/экшены через recipient).
- **recipientMode** — не хранить в envelope; везде опираться на `recipient.mode` и экшен `setRecipientMode` из recipient slice.
- **recipient-специфичный UI в envelopeSelection:**  
  `recipientsPendingIds`, `recipientListPanelOpen`, `recipientDraft`, `recipientViewEditMode` — либо перенести в recipient (отдельный слайс «recipientSelection» / «recipientUI»), либо оставить в минимальном envelope (см. ниже).

### Перенести в **sender**

- **sender-специфичный UI в envelopeSelection:**  
  `senderListPanelOpen`, `senderDraft`, `senderViewEditMode` — либо в sender (слайс «senderSelection» / «senderUI»), либо в минимальном envelope.

### Оставить в **минимальном слое envelope**

То, что по смыслу общее для конверта (одна форма адреса, но два «роля»):

- **showAddressFormView** и **addressFormViewRole** — какая форма показана (sender / recipient) и открыта ли она. Нужны тулбару и общему UI конверта.
- Либо один тонкий слайс `envelopeUISlice`: только `{ showAddressFormView, addressFormViewRole }`, а всё остальное — в sender/recipient.

Вариант: **envelopeSelection** со временем сузить до такого минимального набора (только общий UI), а списки/черновики/панели переносить в sender и recipient.

---

## Практические шаги

1. **recipient:** завести слой состояния для списка получателей (если переносим `envelopeRecipients`) и при необходимости для `recipientsPendingIds` / `recipientListPanelOpen` / `recipientDraft` — селекторы и фасад получателя читают только из recipient.
2. **sender:** аналогично — свой слайс для панели списка, черновика, saved edit mode; useSenderFacade и тулбар читают из sender.
3. **envelope:** оставить только общее (например `showAddressFormView`, `addressFormViewRole`) и реэкспорт/координацию для session (EnvelopeSessionRecord = sender + recipient + isComplete). Селекторы envelope — только то, что нужно для сессии и для общего UI (какой роль формы открыт).

После переноса фасады и саги не должны обращаться к `envelopeSelection` за полями, которые по смыслу принадлежат sender или recipient; обращение только к минимальному общему состоянию envelope.
