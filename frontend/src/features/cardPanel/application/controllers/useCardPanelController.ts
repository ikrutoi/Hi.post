import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@app/state'
import {
  setSource,
  setPacked,
  setActiveSection,
  setActiveTemplate,
  setTemplateList,
  setScrollIndex,
  setValueScroll,
  resetToSections,
} from '../../infrastructure/state'
import {
  CardPanelSource,
  CardPanelSection,
  CardPanelTemplate,
  CardPanelTemplateItem,
} from '../../domain/types'

export const useCardPanelController = () => {
  const dispatch = useDispatch<AppDispatch>()

  const state = {
    source: useSelector((state: RootState) => state.cardPanel.source),
    isPacked: useSelector((state: RootState) => state.cardPanel.isPacked),
    activeSection: useSelector(
      (state: RootState) => state.cardPanel.activeSection
    ),
    activeTemplate: useSelector(
      (state: RootState) => state.cardPanel.activeTemplate
    ),
    templateList: useSelector(
      (state: RootState) => state.cardPanel.templateList
    ),
    scrollIndex: useSelector((state: RootState) => state.cardPanel.scrollIndex),
    valueScroll: useSelector((state: RootState) => state.cardPanel.valueScroll),
  }

  const actions = {
    setSource: (source: CardPanelSource) => dispatch(setSource(source)),
    setPacked: (value: boolean) => dispatch(setPacked(value)),
    setActiveSection: (section: CardPanelSection | null) =>
      dispatch(setActiveSection(section)),
    setActiveTemplate: (template: CardPanelTemplate | null) =>
      dispatch(setActiveTemplate(template)),
    setTemplateList: (list: CardPanelTemplateItem[]) =>
      dispatch(setTemplateList(list)),
    setScrollIndex: (index: number) => dispatch(setScrollIndex(index)),
    setValueScroll: (value: number) => dispatch(setValueScroll(value)),
    resetToSections: () => dispatch(resetToSections()),
  }

  return { state, actions }
}
