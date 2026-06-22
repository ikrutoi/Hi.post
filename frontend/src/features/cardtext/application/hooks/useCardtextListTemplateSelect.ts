import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  restoreCardtextSession,
  setCardtextId,
  setCardtextPresetData,
  setDraftData,
} from '@cardtext/infrastructure/state'
import {
  selectCardtextId,
  selectCardtextSessionData,
  selectCardtextSource,
} from '@cardtext/infrastructure/selectors'
import type { CardtextContent } from '@cardtext/domain/editor/editor.types'

export function useCardtextListTemplateSelect() {
  const dispatch = useAppDispatch()
  const source = useAppSelector(selectCardtextSource)
  const currentTemplateId = useAppSelector(selectCardtextId)
  const session = useAppSelector(selectCardtextSessionData)

  return useCallback(
    (entry: CardtextContent) => {
      if (
        source === 'draft' &&
        (currentTemplateId == null || currentTemplateId === null)
      ) {
        const draft: CardtextContent = {
          id: null,
          status: 'draft',
          value: session.value ?? [],
          style: session.style,
          title: session.title ?? '',
          plainText: session.plainText,
          cardtextLines: session.cardtextLines,
          favorite: session.favorite ?? null,
          timestamp: session.timestamp,
        }
        dispatch(setDraftData(draft))
      }

      dispatch(setCardtextId(entry.id))
      dispatch(setCardtextPresetData(entry))
      dispatch(
        restoreCardtextSession({
          id: entry.id,
          value: entry.value,
          style: entry.style,
          title: entry.title,
          plainText: entry.plainText,
          cardtextLines: entry.cardtextLines,
          favorite: entry.favorite ?? null,
          timestamp: entry.timestamp,
          status: entry.status ?? 'inLine',
        }),
      )
    },
    [dispatch, source, currentTemplateId, session],
  )
}
