import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useSizeFacade } from '@layout/application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './SectionEditorToolbar.module.scss'
import { CropQualityIndicator } from '@cardSectionToolbar/presentation/CropQualityIndicator'

export const SectionEditorToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const { sizeCard, remSize, sectionMenuHeight } = useSizeFacade()

  const { state: toolbarCardphoto } = useToolbarFacade('cardphoto')
  const { state: toolbarMenu } = useToolbarFacade('sectionEditorMenu')

  if (!sizeCard || !remSize) return null

  const showQualityIndicator =
    sectionMenuHeight &&
    toolbarCardphoto.state.crop.state === 'active' &&
    toolbarMenu.state.cardphoto === 'active'

  return (
    <div className={styles.sectionEditorToolbar}>
      <Toolbar section="sectionEditorMenu" />

      {(activeSection === 'cardphoto' || activeSection === 'cardtext') && (
        <Toolbar section={activeSection} />
      )}

      {showQualityIndicator && (
        <CropQualityIndicator height={sectionMenuHeight} />
      )}
    </div>
  )
}
