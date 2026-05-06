import { createContext, useContext } from 'react'

/** True when `NotebookPeekShell` (three tabs) wraps the whole factory — inner sections must not add another shell. */
const SectionEditorNotebookTabsOuterContext = createContext(false)

export const SectionEditorNotebookTabsOuterProvider =
  SectionEditorNotebookTabsOuterContext.Provider

export const useSectionEditorNotebookTabsOuter = () =>
  useContext(SectionEditorNotebookTabsOuterContext)
