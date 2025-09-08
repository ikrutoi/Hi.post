import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { sectionActions } from '../state/layoutActions'
import {
  selectSelectedSection,
  selectChoiceSection,
  selectDeleteSection,
} from '../state/layoutSelectors'

export const useLayoutSectionFacade = () => {
  const dispatch = useAppDispatch()

  return {
    selected: useAppSelector(selectSelectedSection),
    choice: useAppSelector(selectChoiceSection),
    deleted: useAppSelector(selectDeleteSection),
    setSelected: (section: string | null) =>
      dispatch(sectionActions.setSelectedSection(section)),
    setChoice: (section: Partial<{ source: string; nameSection: string }>) =>
      dispatch(sectionActions.setChoiceSection(section)),
    setDeleted: (section: string | null) =>
      dispatch(sectionActions.setDeleteSection(section)),
  }
}
