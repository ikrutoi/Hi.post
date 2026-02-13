import { useRef, useState } from 'react'
import clsx from 'clsx'
import { ErrorBoundary } from '@shared/ui/ErrorBoundary'
import { Header } from './features/header/presentation/Header'
// import { CardMenu } from '@/app/basket/cardMenu/presentation/CardMenu'
// import { CardPanelWrapper } from '@cardPanel/presentation/CardPanelWrapper'
import { useSizeFacade } from '@layout/application/facades'
import { CardPanel } from './features/cardPanel/presentation/CardPanel'
import { CardSectionEditor } from './features/cardSectionEditor/presentation/CardSectionEditor'
import { useAuthInit } from '@features/auth/application/hooks/useAuthInit'
import {
  useLayoutInit,
  useToolbarClickReset,
  useViewportInit,
} from '@layout/application/hooks'
// import { useSize } from '@shared/hooks/useSize'
import { useRecordSizeCard } from '@shared/hooks'
import styles from './App.module.scss'

const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)
  // const { sizeMiniCard } = useSizeFacade()
  // const sectionEditorSize = useSize(formRef)

  useAuthInit()
  useLayoutInit()
  useViewportInit()
  useRecordSizeCard(formRef)

  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)

  return (
    <div ref={appRef} className={styles.app} onClick={handleAppClick}>
      <div className={styles.appHeader}>
        <Header />
      </div>
      <main ref={mainRef} className={styles.appMain}>
        <div
          className={clsx(styles.mainCardPanel)}
          // style={{ height: `${sizeMiniCard.height}px` }}
        >
          <CardPanel />
        </div>
        <div ref={formRef} className={styles.mainForm}>
          {/* <ErrorBoundary>
              <CardPanel />
            </ErrorBoundary> */}
          <CardSectionEditor />
        </div>
      </main>
    </div>
  )
}

export default App
