import React from 'react'
import type { DateStripSection } from './dateStripSection.types'
import styles from './CalendarNotebookTabs.module.scss'

type Props = {
  children: React.ReactNode
  /** Сохранён для вызывающих секций; закладки над карточкой больше не рисуются. */
  section?: DateStripSection
}

/** Обёртка центральной секции без закладок Cart / History. */
export const NotebookPeekShell: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.notebookPeekShell}>
      <div className={styles.notebookPeekShellInner}>{children}</div>
    </div>
  )
}
