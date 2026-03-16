import React, { useLayoutEffect, useRef, useState } from 'react'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '../application/facades/useCardtextFacade'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './Cardtext.module.scss'

const TITLE_MAX_WIDTH_RATIO = 0.6

interface CardtextProps {
  styleLeft: number
}

export const Cardtext: React.FC<CardtextProps> = ({ styleLeft }) => {
  const { sizeCard } = useSizeFacade()
  const { state, currentView, value, style, title, assetId, openEditTitle } =
    useCardtextFacade()

  const formRef = useRef<HTMLDivElement>(null)
  const titleTextRef = useRef<HTMLSpanElement>(null)
  const [titleOverflows, setTitleOverflows] = useState(false)

  const handleEditTitle = () => {
    openEditTitle()
  }

  console.log('Cardtext state', state)

  useLayoutEffect(() => {
    if (currentView !== 'cardtextView' || !title.trim()) {
      setTitleOverflows(false)
      return
    }
    const form = formRef.current
    const textEl = titleTextRef.current
    if (!form || !textEl) return
    const formWidth = form.offsetWidth
    const maxTitleWidth = formWidth * TITLE_MAX_WIDTH_RATIO
    setTitleOverflows(textEl.scrollWidth > maxTitleWidth)
  }, [currentView, title, sizeCard.width])

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
        <div className={styles.cardtextViewWrap}>
          <div className={styles.cardtextToolbarRow}>
            <Toolbar section={currentView} />
          </div>
          <div className={styles.cardtextViewContent}>
            {currentView === 'cardtextView' ? (
              <CardtextView
                key={assetId ?? 'no-template'}
                value={value}
                style={style}
                title={title}
                onTitleClick={handleEditTitle}
                titleOverflows={titleOverflows}
                titleRef={titleTextRef}
              />
            ) : (
              <CardEditor />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
