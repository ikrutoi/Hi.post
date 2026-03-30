import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import type { CardtextContent } from '@cardtext/domain/editor/editor.types'
import { loadCardtextTemplatesRequest } from '@cardtext/infrastructure/state'

/**
 * Один запрос списка шаблонов, пока в сторе ещё `null` (неизвестно — есть ли записи).
 */
export function useLoadCardtextTemplatesWhenUnknown(
  loading: boolean,
  templatesList: CardtextContent[] | null,
): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (loading) return
    if (templatesList != null) return
    dispatch(loadCardtextTemplatesRequest())
  }, [loading, dispatch, templatesList])
}
