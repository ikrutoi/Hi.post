import React from 'react'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './SectionEditorLeftInnerSidebar.module.scss'

/**
 * Левый внутренний сайдбар (внутри workZoneLeft): тематический тулбар только для секций Кардфото и Кардтекст.
 * Для остальных секций этот блок не рендерится (вызывающий код не показывает контейнер).
 */
export const SectionEditorLeftInnerSidebar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const show =
    activeSection === 'cardphoto' || activeSection === 'cardtext'

  if (!show) return null

  return (
    <div className={styles.innerSidebar}>
      <Toolbar section={activeSection} />
    </div>
  )
}
