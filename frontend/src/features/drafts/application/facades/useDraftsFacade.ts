import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { draftsActions } from '../state/draftsSlice'
import { selectDrafts, selectDraftsCount } from '../state/draftsSelectors'
import type { DraftPostcard } from '../../domain/draftsModel'

export const useDraftsFacade = () => {
  const dispatch = useAppDispatch()
  const drafts = useAppSelector(selectDrafts)
  const countDrafts = useAppSelector(selectDraftsCount)

  return {
    drafts,
    countDrafts,
    setDrafts: (payload: DraftPostcard[]) =>
      dispatch(draftsActions.setDrafts(payload)),
    addDraft: (item: DraftPostcard) => dispatch(draftsActions.addDraft(item)),
    clearDrafts: () => dispatch(draftsActions.clearDrafts()),
  }
}
