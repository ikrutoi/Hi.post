import React, { useLayoutEffect, useRef, useState } from 'react'
import { useAppSelector } from '@app/hooks'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import {
  selectCardtextShowViewMode,
  selectCardtextValue,
  selectCardtextStyle,
  selectCardtextTitle,
} from '../infrastructure/selectors'
import styles from './Cardtext.module.scss'

const TITLE_MAX_WIDTH_RATIO = 0.6

interface CardtextProps {
  styleLeft: number
}

export const Cardtext: React.FC<CardtextProps> = ({ styleLeft }) => {
  const { sizeCard } = useSizeFacade()
  const showViewMode = useAppSelector(selectCardtextShowViewMode)
  const value = useAppSelector(selectCardtextValue)
  const style = useAppSelector(selectCardtextStyle)
  const title = useAppSelector(selectCardtextTitle)

  const formRef = useRef<HTMLDivElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const [titleOverflows, setTitleOverflows] = useState(false)

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
            {title.trim() ? (
              <div className={styles.cardtextViewTitle} aria-hidden>
                <span
                  ref={titleTextRef}
                  className={
                    titleOverflows
                      ? `${styles.cardtextViewTitleText} ${styles.cardtextViewTitleTextFade}`
                      : styles.cardtextViewTitleText
                  }
                >
                  {title}
                </span>
              </div>
            ) : null}
            <CardtextView value={value} style={style} />
          </div>
        ) : (
          <CardEditor />
        )}
      </div>
    </div>
  )
}
