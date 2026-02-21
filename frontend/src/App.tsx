import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Header } from './features/header/presentation/Header'
import { useSizeFacade, useLayoutFacade } from '@layout/application/facades'
import { useCardPanelFacade } from './features/cardPanel/application/facades'
import { CardPanel } from './features/cardPanel/presentation/CardPanel'
import { CardPanelTemplatesView } from './features/cardPanel/presentation/CardPanelTemplatesView'
import { CardSectionEditor } from './features/cardSectionEditor/presentation/CardSectionEditor'
import { useAuthInit } from '@features/auth/application/hooks/useAuthInit'
import {
  useLayoutInit,
  useToolbarClickReset,
  useViewportInit,
} from '@layout/application/hooks'
import { useRecordSizeCard } from '@shared/hooks'
import styles from './App.module.scss'

const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const cardPanelRef = useRef<HTMLDivElement>(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)

  const { viewFlags, state: stateCardPanel } = useCardPanelFacade()
  const isTemplateMode = viewFlags.isTemplateMode
  const { sizeMiniCard, sizeToolbarContour } = useSizeFacade()
  const { meta } = useLayoutFacade()

  const standardWidth =
    sizeToolbarContour?.width != null && sizeMiniCard?.height != null
      ? sizeToolbarContour.width + sizeMiniCard.height
      : undefined
  const panelContentWidth =
    sizeToolbarContour?.width != null ? sizeToolbarContour.width : undefined
  const previewSlotWidth = sizeMiniCard?.height ?? 0

  useAuthInit()
  useLayoutInit()
  useViewportInit()
  useRecordSizeCard(formRef, cardPanelRef, {
    skipPanelMeasure: isTemplateMode,
  })

  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)

  return (
    <div ref={appRef} className={styles.app} onClick={handleAppClick}>
      <div className={styles.appHeader}>
        <Header />
      </div>
      <main ref={mainRef} className={styles.appMain}>
        <div
          ref={cardPanelRef}
          className={clsx(styles.mainCardPanel)}
          style={{
            width:
              standardWidth != null
                ? isTemplateMode
                  ? '100%'
                  : `${standardWidth}px`
                : undefined,
          }}
        >
          {isTemplateMode ? (
            <CardPanelTemplatesView
              activeTemplate={stateCardPanel.activeTemplate}
              sizeMiniCard={sizeMiniCard ?? {}}
              panelContentWidth={panelContentWidth}
              previewSlotWidth={previewSlotWidth}
              deltaEnd={meta.deltaEnd}
              maxMiniCardsCount={meta.maxMiniCardsCount}
            />
          ) : (
            <CardPanel />
          )}
        </div>
        <div
          ref={formRef}
          className={clsx(styles.mainForm)}
          style={{
            width: standardWidth != null ? `${standardWidth}px` : undefined,
          }}
        >
          <CardSectionEditor />
        </div>
      </main>
    </div>
  )
}

export default App
