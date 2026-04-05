import React from 'react'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import styles from './SectionEditorRightSidebar.module.scss'

export const SectionEditorRightSidebar: React.FC = () => {
  return (
    <aside
      className={styles.sectionEditorRightSidebar}
      aria-label="Profile, Cart, and Favorites"
    >
      <div className={styles.toolbarSlot}>
        <Toolbar section="rightSidebar" />
      </div>
    </aside>
  )
}
