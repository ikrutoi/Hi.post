import { SectionEditorToolbar } from './SectionEditorToolbar/SectionEditorToolbar'
import { CardSectionRenderer } from './CardSectionRenderer/CardSectionRenderer'
import styles from './CardSectionEditor.module.scss'

export const CardSectionEditor: React.FC = () => {
  return (
    <div className={styles.cardSectionEditor}>
      <SectionEditorToolbar />
      <CardSectionRenderer />
    </div>
  )
}
