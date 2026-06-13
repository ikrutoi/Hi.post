import React, { useRef, useLayoutEffect, useState } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'
import { renderCardSection } from '../../application/helpers/renderCardSection'
import { useSizeFacade } from '@layout/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import styles from './CardSectionRenderer.module.scss'

export const CardSectionRenderer = () => {
  const { activeSection } = useSectionMenuFacade()
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const { sizeCard } = useSizeFacade()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionLeft, setSectionLeft] = useState<number>(0)

  useLayoutEffect(() => {
    if (sectionRef.current) {
      const { left } = sectionRef.current.getBoundingClientRect()
      setSectionLeft(left)
    }
  }, [sizeCard?.height, sizeCard?.width])

  if (!sizeCard?.height && !isMobileLayout) return null

  return (
    <div
      ref={sectionRef}
      className={clsx(styles.cardSectionRenderer)}
    >
      {renderCardSection(activeSection, {
        sectionLeft,
        sectionRef,
        notebookStripTab,
      })}
    </div>
  )
}
