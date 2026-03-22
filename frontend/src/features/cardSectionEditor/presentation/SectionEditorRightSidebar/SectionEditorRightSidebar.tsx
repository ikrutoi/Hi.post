import React from 'react'
import styles from './SectionEditorRightSidebar.module.scss'

/**
 * Правая колонка редактора (ширина как у левой). Превью перенесены в панели секций.
 */
export const SectionEditorRightSidebar: React.FC = () => {
  return <div className={styles.sectionEditorRightSidebar} aria-hidden />
}
