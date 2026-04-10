import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { Header } from './features/header/presentation/Header'
import { MiniSectionsSlot } from './features/cardPanel/presentation/MiniSectionsSlot'
import { CardSectionEditor } from '@features/cardSectionEditor/presentation/CardSectionEditor'
import { CardSectionToolbar } from '@features/cardSectionToolbar/presentation/CardSectionToolbar'
import { CardPie } from '@features/cardPie/presentation/CardPie'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { SectionEditorSidebar } from '@features/cardSectionEditor/presentation/SectionEditorSidebar/SectionEditorSidebar'
import { SectionEditorRightSidebar } from '@features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
import { useAuthInit } from '@features/auth/application/hooks/useAuthInit'
import {
  useLayoutInit,
  useToolbarClickReset,
  useViewportInit,
} from '@layout/application/hooks'
import { useSizeFacade } from '@layout/application/facades'
import { useRecordSizeCard } from '@shared/hooks'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { EnvelopeRightSlot } from '@envelope/presentation/EnvelopeRightSlot'
import { DateRightSlot } from '@date/presentation/DateRightSlot'
import { CardtextRightSlot } from '@cardtext/presentation/CardtextRightSlot'
import { CardphotoRightSlot } from '@cardphoto/presentation/CardphotoRightSlot'
import styles from './App.module.scss'

const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const cardPanelRef = useRef<HTMLDivElement>(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)

  useAuthInit()
  useLayoutInit()
  useViewportInit()
  useRecordSizeCard(formRef, cardPanelRef)
  const { sizeCard } = useSizeFacade()
  const sectionSize =
    sizeCard?.width != null && sizeCard.width > 0 ? sizeCard.width / 6 : null

  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)
  const { activeSection } = useSectionMenuFacade()

  return (
    <div ref={appRef} className={styles.app} onClick={handleAppClick}>
      <div className={styles.appSubstrate}>
        <div className={styles.appControlStrip}>
          <div className={styles.appHeader}>
            <Header />
          </div>
          <div className={styles.appSidebar}>
            <SectionEditorSidebar />
          </div>
          <main ref={mainRef} className={styles.appMain}>
            {/* <div className={styles.appMainContentLeft}> */}
            <div className={styles.appMainContentLeftPieSlot}>
              {sectionSize != null && (
                <div className={styles.appMainContentLeftPieRow}>
                  <div className={styles.appMainContentLeftPieWrap}>
                    <CardPie isProcessed fillContainer />
                  </div>
                  <div className={styles.appMainContentLeftPieToolbar}>
                    <Toolbar section="editorPie" />
                  </div>
                </div>
              )}
            </div>
            {/* </div> */}
            <div
              className={clsx(
                styles.appMainContentLeft,
                // activeSection === 'date' && styles.appMainContentRightDate,
              )}
            >
              {activeSection === 'envelope' && <EnvelopeRightSlot />}
              {activeSection === 'date' && <DateRightSlot />}
              {activeSection === 'cardtext' && <CardtextRightSlot />}
              {activeSection === 'cardphoto' && <CardphotoRightSlot />}
            </div>
            <div
              className={styles.appMainContentCenter}
              style={
                sizeCard?.width != null
                  ? ({
                      '--card-width': `${sizeCard.width}px`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <div className={clsx(styles.mainCardPanel)}>
                <MiniSectionsSlot ref={cardPanelRef} />
              </div>
              <div className={styles.mainCardSectionToolbar}>
                <CardSectionToolbar />
              </div>
              <div ref={formRef} className={clsx(styles.mainForm)}>
                <CardSectionEditor />
              </div>
            </div>
            <div className={styles.appMainContentRightPieSlot}>
              {sectionSize != null && (
                <div className={styles.appMainContentRightPieRow}>
                  <div className={styles.appMainContentRightPieWrap}>
                    <CardPie isProcessed fillContainer />
                  </div>
                  {/* <div className={styles.appMainContentRightPieToolbar}>
                    <Toolbar section="editorPie" />
                  </div> */}
                </div>
              )}
            </div>
            {/* <div
              className={clsx(
                styles.appMainContentRight,
                // activeSection === 'date' && styles.appMainContentRightDate,
              )}
            >
              {activeSection === 'envelope' && <EnvelopeRightSlot />}
              {activeSection === 'date' && <DateRightSlot />}
              {activeSection === 'cardtext' && <CardtextRightSlot />}
              {activeSection === 'cardphoto' && <CardphotoRightSlot />}
            </div> */}
          </main>
          <div className={styles.appRightSidebar}>
            <SectionEditorRightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
