import { useCallback, useMemo } from 'react'
import {
  setSectionComplete,
  resetSection,
  setEditorId,
  resetEditor,
  setStatus,
} from '../../infrastructure/state'
import {
  CARD_SECTIONS,
  type CardSection,
  type Card,
  type Completion,
  type EditorData,
  type CardStatus,
} from '../../domain/types'
import { useAppDispatch, useAppSelector } from '@app/hooks'

type ExtractData<T> = T extends Completion<infer U> ? U : never

export const useCardEditorController = () => {
  const dispatch = useAppDispatch()
  const editor = useAppSelector((state) => state.cardEditor)

  const isComplete = useCallback(
    (section: CardSection): boolean => editor[section].isComplete,
    [editor]
  )

  const getSectionData = useCallback(
    <K extends CardSection>(section: K): ExtractData<Card[K]> | undefined => {
      const entry = editor[section]
      return entry.isComplete ? (entry.data as ExtractData<Card[K]>) : undefined
    },
    [editor]
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

    setSectionComplete: <K extends CardSection>(
      section: K,
      data: ExtractData<Card[K]> & EditorData
    ) => dispatch(setSectionComplete({ section, data })),

    resetSection: (section: CardSection) => dispatch(resetSection(section)),

    resetEditor: () => dispatch(resetEditor()),

    setStatus: (status: CardStatus) => dispatch(setStatus(status)),
  }

  return {
    state: {
      editor,
      isComplete,
      isDraftReady,
      isFullReady,
      getSectionData,
      incompleteSections,
      progress,
      status: editor.status,
    },
    actions,
  }
}
