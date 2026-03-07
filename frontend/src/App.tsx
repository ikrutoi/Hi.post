import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Header } from './features/header/presentation/Header'
import { MiniSectionsSlot } from './features/cardPanel/presentation/MiniSectionsSlot'
import { CardSectionEditor } from './features/cardSectionEditor/presentation/CardSectionEditor'
import { SectionEditorSidebar } from './features/cardSectionEditor/presentation/SectionEditorSidebar/SectionEditorSidebar'
import { SectionEditorRightSidebar } from './features/cardSectionEditor/presentation/SectionEditorRightSidebar/SectionEditorRightSidebar'
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

  useAuthInit()
  useLayoutInit()
  useViewportInit()
  useRecordSizeCard(formRef, cardPanelRef)

  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)

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
            <div className={styles.appMainContent}>
              <div className={clsx(styles.mainCardPanel)}>
                <MiniSectionsSlot ref={cardPanelRef} />
              </div>
              <div ref={formRef} className={clsx(styles.mainForm)}>
                <CardSectionEditor />
              </div>
            </div>
            <aside
              className={styles.appMainAside}
              aria-label="Templates"
            ></aside>
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
