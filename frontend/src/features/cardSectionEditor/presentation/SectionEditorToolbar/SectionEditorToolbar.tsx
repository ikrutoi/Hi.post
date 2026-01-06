import React from 'react'
import clsx from 'clsx'
import { useLayoutFacade } from '@layout/application/facades'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import styles from './SectionEditorToolbar.module.scss'

export const SectionEditorToolbar: React.FC = () => {
  const { size } = useLayoutFacade()
  const sizeCard = size.sizeCard
  const remSize = size.remSize

  if (!sizeCard || !remSize) return null

  const height = sizeCard.height + 4 * remSize
  const width = Number(
    (sizeCard.height * sizeCard.aspectRatio + 6 * remSize).toFixed(2)
  )

  return (
    <div
      className={clsx(styles.sectionEditorToolbar)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Toolbar section="sectionEditorMenu" />
    </div>
  )
}
