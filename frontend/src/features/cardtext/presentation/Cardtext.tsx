import React, { useLayoutEffect, useRef, useState } from 'react'
import { CardEditor } from './CardEditor/CardEditor'
import { CardtextView } from './CardtextView/CardtextView'
import { useSizeFacade } from '@layout/application/facades'
import { useCardtextFacade } from '../application/facades/useCardtextFacade'
import { useAppSelector } from '@app/hooks'
import { selectCardtextAssetId } from '@cardtext/infrastructure/selectors'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './Cardtext.module.scss'
import viewStyles from './CardtextView/CardtextView.module.scss'

const TITLE_MAX_WIDTH_RATIO = 0.6

interface CardtextProps {
  styleLeft: number
}

export const Cardtext: React.FC<CardtextProps> = ({ styleLeft }) => {
  const { sizeCard } = useSizeFacade()
  const { state, currentView, value, style, title, assetId, openEditTitle } =
    useCardtextFacade()
  const currentAssetId = useAppSelector(selectCardtextAssetId)

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
            <Toolbar
              section={
                currentView === 'cardtextEditor' && currentAssetId == null
                  ? 'cardtextCreate'
                  : currentView
              }
            />
          </div>
          <div className={styles.cardtextViewContent}>
            {currentView === 'cardtextView' ? (
              <>
                {title.trim() && (
                  <button
                    type="button"
                    className={viewStyles.viewTitle}
                    onClick={handleEditTitle}
                    aria-label="Change template name"
                    title="Change template name"
                  >
                    <span
                      ref={titleTextRef}
                      className={
                        titleOverflows
                          ? `${viewStyles.viewTitleText} ${viewStyles.viewTitleTextFade}`
                          : viewStyles.viewTitleText
                      }
                      aria-hidden
                    >
                      {title}
                    </span>
                  </button>
                )}
                <CardtextView
                  key={assetId ?? 'no-template'}
                  value={value}
                  style={style}
                />
              </>
            ) : (
              <CardEditor />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
