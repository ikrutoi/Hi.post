import { useLayoutFacade } from '@layout/application/facades'

import styles from './SectionEditorToolbar.module.scss'

export const SectionEditorToolbar: React.FC = () => {
  const { size } = useLayoutFacade()
  const sizeCard = size.sizeCard

  if (!sizeCard?.width) return null

  return (
    <div
      className={styles.sectionEditorToolbar}
      style={{ width: `${sizeCard.width}px` }}
    ></div>
  )
}
