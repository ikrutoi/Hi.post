// CardSectionRenderer.ts
import React, { useRef, useLayoutEffect, useState } from 'react'
import { renderCardSection } from '../../application/helpers/renderCardSection'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import { useLayoutFacade } from '@layout/application/facades'
import styles from './CardSectionRenderer.module.scss'

interface CardSectionRendererProps {
  toolbarColor?: string
}

export const CardSectionRenderer: React.FC<CardSectionRendererProps> = ({
  toolbarColor,
}) => {
  const { state } = useLayoutNavFacade()
  const { selectedCardMenuSection } = state

  const { size } = useLayoutFacade()
  const sizeCard = size.sizeCard

  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionLeft, setSectionLeft] = useState<number>(0)

  useLayoutEffect(() => {
    if (sectionRef.current) {
      const { left } = sectionRef.current.getBoundingClientRect()
      setSectionLeft(left)
    }
  }, [sizeCard?.width, sizeCard?.height])

  if (!sizeCard?.width || !sizeCard?.height) return null

  return (
    <div
      ref={sectionRef}
      className={styles.cardSectionRenderer}
      style={{
        width: `${sizeCard.width}px`,
        height: `${sizeCard.height}px`,
      }}
    >
      {renderCardSection(selectedCardMenuSection, {
        sectionLeft,
        sectionRef,
        // toolbarColor, //
      })}
    </div>
  )
}
