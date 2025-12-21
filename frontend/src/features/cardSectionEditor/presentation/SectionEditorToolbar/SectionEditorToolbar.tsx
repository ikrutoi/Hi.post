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

  const width = sizeCard.width + 6 * remSize
  const height = sizeCard.height + 4 * remSize

  return (
    <div
      className={clsx(styles.sectionEditorToolbar)}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* <div className={clsx(styles.sectionEditorMenuContainer)}> */}
      <Toolbar section="sectionEditorMenu" />
      {/* </div> */}
    </div>
  )
}
