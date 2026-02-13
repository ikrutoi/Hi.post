import React, { useRef, useLayoutEffect, useState } from 'react'
import clsx from 'clsx'
import { capitalize } from '@shared/utils/helpers'
import { renderCardSection } from '../../application/helpers/renderCardSection'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { useSizeFacade } from '@layout/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import styles from './CardSectionRenderer.module.scss'

export const CardSectionRenderer = () => {
  const { activeSection } = useSectionMenuFacade()

  const { sizeCard } = useSizeFacade()

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
    (sizeCard.height * CARD_SCALE_CONFIG.aspectRatio).toFixed(2),
  )

  return (
    <div
      ref={sectionRef}
      className={clsx(
        styles.cardSectionRenderer,
        styles[`cardSectionRenderer${capitalize(sizeCard.orientation)}`],
      )}
      // style={{
      //   width: `${currentWidth}px`,
      //   height: `${sizeCard.height}px`,
      // }}
    >
      {renderCardSection(activeSection, {
        sectionLeft,
        sectionRef,
      })}
    </div>
  )
}
