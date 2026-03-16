import React, { useLayoutEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '../application/facades/useCardtextFacade'
import {
  selectCardtextShowViewMode,
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextTitle,
  selectCardtextAssetId,
} from '../infrastructure/selectors'
import { setCardtextEditTitleOpen } from '../infrastructure/state'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './Cardtext.module.scss'

const TITLE_MAX_WIDTH_RATIO = 0.6

interface CardtextProps {
  styleLeft: number
}

export const Cardtext: React.FC<CardtextProps> = ({ styleLeft }) => {
  const dispatch = useAppDispatch()
  const { sizeCard } = useSizeFacade()
  const showViewMode = useAppSelector(selectCardtextShowViewMode)
  const value = useAppSelector(selectCardtextValue)
  const style = useAppSelector(selectCardtextStyle)
  const title = useAppSelector(selectCardtextTitle)
  const assetId = useAppSelector(selectCardtextAssetId)
  const { state } = useCardtextFacade()
  console.log('Cardtext state', state)

  const formRef = useRef<HTMLDivElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const [titleOverflows, setTitleOverflows] = useState(false)

  const handleEditTitle = () => {
    dispatch(setCardtextEditTitleOpen(true))
  }

  useLayoutEffect(() => {
    if (!showViewMode || !title.trim()) {
      setTitleOverflows(false)
      return
    }
    const form = formRef.current
    const textEl = titleTextRef.current
    if (!form || !textEl) return
    const formWidth = form.offsetWidth
    const maxTitleWidth = formWidth * TITLE_MAX_WIDTH_RATIO
    setTitleOverflows(textEl.scrollWidth > maxTitleWidth)
  }, [showViewMode, title, sizeCard.width])

  return (
    <div className={styles.cardtextContainer}>
      <div
        ref={formRef}
        className={styles.cardtext}
        style={{
          width: `${sizeCard.width}px`,
          height: `${sizeCard.height}px`,
        }}
      >
        {showViewMode ? (
          <div className={styles.cardtextViewWrap}>
            <div className={styles.cardtextToolbarRow}>
              <Toolbar section="cardtextView" />
            </div>
            <div className={styles.cardtextViewContent}>
              <CardtextView
                key={assetId ?? 'no-template'}
                value={value}
                style={style}
                title={title}
                onTitleClick={handleEditTitle}
                titleOverflows={titleOverflows}
                titleRef={titleTextRef}
              />
            </div>
          </div>
        ) : (
          <CardEditor />
        )}
      </div>
    </div>
  )
}
