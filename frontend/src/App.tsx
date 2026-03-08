import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Header } from './features/header/presentation/Header'
import { MiniSectionsSlot } from './features/cardPanel/presentation/MiniSectionsSlot'
import { CardSectionEditor } from './features/cardSectionEditor/presentation/CardSectionEditor'
import { CardPie } from './features/cardPie/presentation/CardPie'
import { SectionEditorSidebar } from './features/cardSectionEditor/presentation/SectionEditorSidebar/SectionEditorSidebar'
import { SectionEditorRightSidebar } from './features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
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
            <div className={styles.appMainContentLeft}>
              <div className={styles.appMainContentLeftPieSlot}>
                {sectionSize != null && (
                  <div className={styles.appMainContentLeftPieWrap}>
                    <CardPie status="processed" fillContainer />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.appMainContentCenter}>
              <div className={clsx(styles.mainCardPanel)}>
                <MiniSectionsSlot ref={cardPanelRef} />
              </div>
              <div ref={formRef} className={clsx(styles.mainForm)}>
                <CardSectionEditor />
              </div>
            </div>
            <div className={styles.appMainContentRight}>
              {activeSection === 'envelope' && <EnvelopeRightSlot />}
            </div>
            {/* <aside
              className={styles.appMainAside}
              aria-label="Templates"
            ></aside> */}
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
