import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import {
  setSectionComplete,
  resetSection,
  setEditorId,
  setTemplateId,
  resetEditor,
} from '../../infrastructure/state'
import {
  CARD_SECTIONS,
  type CardSection,
  type CardEditorDataMap,
  type CardTemplateSection,
  type CardEditor,
} from '../../domain/types'
import type { RootState } from '@app/state'

export const useCardEditorController = () => {
  const dispatch = useDispatch()
  const editor = useSelector((state: RootState) => state.cardEditor)

  const isComplete = useCallback(
    (section: CardSection): boolean => editor[section].isComplete,
    [editor]
  )

  const getSectionData = useCallback(
    <K extends CardSection>(section: K): CardEditorDataMap[K] | undefined => {
      const entry = editor[section]
      if (entry.isComplete) {
        return entry.data as CardEditorDataMap[K]
      }
      return undefined
    },
    [editor]
  )

  const getTemplateId = useCallback(
    (section: CardTemplateSection): string | undefined =>
      editor.templates[section],
    [editor.templates]
  )

  const incompleteSections = useMemo(
    () => CARD_SECTIONS.filter((s) => !editor[s].isComplete),
    [editor]
  )

  const isAllComplete = useMemo(
    () => CARD_SECTIONS.every((s) => editor[s].isComplete),
    [editor]
  )

  const isDateFilled = useMemo(() => {
    const section = editor.date
    return (
      section.isComplete &&
      section.data !== null &&
      typeof section.data.year === 'number' &&
      typeof section.data.month === 'number' &&
      typeof section.data.day === 'number'
    )
  }, [editor])

  const isDraftReady = isAllComplete && !isDateFilled
  const isFullReady = isAllComplete && isDateFilled

  const progress = useMemo(() => {
    const total = CARD_SECTIONS.length
    const completed = CARD_SECTIONS.filter((s) => editor[s].isComplete).length
    return Math.round((completed / total) * 100)
  }, [editor])

  const actions = {
    setEditorId: (id: string) => dispatch(setEditorId(id)),

    setSectionComplete: <K extends keyof CardEditorDataMap>(
      section: K,
      data: CardEditorDataMap[K]
    ) => dispatch(setSectionComplete({ section, data })),

    resetSection: (section: CardSection) => dispatch(resetSection(section)),

    setTemplateId: (section: CardTemplateSection, templateId: string) =>
      dispatch(setTemplateId({ section, templateId })),

    resetEditor: () => dispatch(resetEditor()),
  }

  return {
    state: {
      editor,
      isComplete,
      isDraftReady,
      isFullReady,
      getSectionData,
      getTemplateId,
      incompleteSections,
      progress,
    },
    actions,
  }
}
