import { SectionEditorToolbar } from './SectionEditorToolbar/SectionEditorToolbar'
import { SectionRenderer } from './SectionRenderer/SectionRenderer'

import styles from './SectionEditor.module.scss'

export const SectionEditor: React.FC = () => {
  return (
    <div className={styles.sectionEditor}>
      <SectionEditorToolbar />
      <SectionRenderer />
    </div>
  )
}
