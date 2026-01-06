import React, { useRef, useLayoutEffect, useState } from 'react'
import { renderCardSection } from '../../application/helpers/renderCardSection'
import { useLayoutFacade } from '@layout/application/facades'
import { useSectionEditorMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import styles from './CardSectionRenderer.module.scss'

export const CardSectionRenderer = () => {
  const { state: stateSectionEditorMenu } = useSectionEditorMenuFacade()
  const { activeSection } = stateSectionEditorMenu

  const { size } = useLayoutFacade()
  const sizeCard = size.sizeCard

  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionLeft, setSectionLeft] = useState<number>(0)

  useLayoutEffect(() => {
    if (sectionRef.current) {
      const { left } = sectionRef.current.getBoundingClientRect()
      setSectionLeft(left)
    }
  }, [sizeCard?.height])

  if (!sizeCard?.height) return null

  const currentWidth = Number(
    (sizeCard.height * sizeCard.aspectRatio).toFixed(2)
  )

  return (
    <div
      ref={sectionRef}
      className={styles.cardSectionRenderer}
      style={{
        width: `${currentWidth}px`,
        height: `${sizeCard.height}px`,
      }}
    >
      {renderCardSection(activeSection, {
        sectionLeft,
        sectionRef,
      })}
    </div>
  )
}
