import React from 'react'
import { CalendarNotebookTabs } from './CalendarNotebookTabs'
import { useDateStripSectionForNotebookTabs } from './useDateStripSectionForNotebookTabs'
import type { DateStripSection } from './dateStripSection.types'
import styles from './CalendarNotebookTabs.module.scss'

type Props = {
  children: React.ReactNode
  /** Явный режим закладок (секция «Дата»); иначе из Redux для остальных секций в peek. */
  section?: DateStripSection
}

/** Обёртка упрощённого центра: закладки Date / Cart / History + контент под ними. */
export const NotebookPeekShell: React.FC<Props> = ({ children, section }) => {
  const sectionFromStore = useDateStripSectionForNotebookTabs()
  const resolved = section ?? sectionFromStore

  return (
    <div className={styles.notebookPeekShell}>
      <CalendarNotebookTabs section={resolved} />
      <div className={styles.notebookPeekShellInner}>{children}</div>
    </div>
  )
}
