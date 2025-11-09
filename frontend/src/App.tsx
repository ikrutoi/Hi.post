import { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from '@shared/ui/ErrorBoundary'
import { Header } from './features/header/presentation/Header'
import { CardMenu } from '@cardMenu/presentation/CardMenu'
import { CardPanel } from '@cardPanel/presentation/CardPanel'
import { CardSectionEditor } from './features/cardSectionEditor/presentation/CardSectionEditor'
import { useAuthInit } from '@features/auth/application/hooks/useAuthInit'
import {
  useLayoutInit,
  useToolbarClickReset,
  useViewportInit,
} from '@layout/application/hooks'
import { useSize } from '@shared/hooks/useSize'
import { useMiniCardSize } from '@shared/hooks'
import styles from './App.module.scss'

const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)
  const sectionEditorSize = useSize(formRef)

  useAuthInit()
  useLayoutInit()
  useViewportInit()

  const sizeMiniCard = useMiniCardSize(formRef)

  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)

  return (
    <div ref={appRef} className={styles.app} onClick={handleAppClick}>
      <Header />
      <main ref={mainRef} className={styles.app__main}>
        <CardMenu />
        <div ref={formRef} className={styles.app__form}>
          <>
            <ErrorBoundary>
              {sectionEditorSize && <CardPanel sizeMiniCard={sizeMiniCard} />}
            </ErrorBoundary>
            {sectionEditorSize && <CardSectionEditor />}
          </>
        </div>
      </main>
    </div>
  )
}

export default App
