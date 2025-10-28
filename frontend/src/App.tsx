import { useRef, useState } from 'react'

import { ErrorBoundary } from './shared/ui/ErrorBoundary'
import { Header } from './features/header/presentation/Header'
import { CardMenu } from '@cardMenu/presentation/CardMenu'
import { CardPanel } from './features/cardPanel/presentation/CardPanel'
import { CardSectionEditor } from './features/cardSectionEditor/presentation/CardSectionEditor'

import { useAuthInit } from '@features/auth/application/hooks/useAuthInit'
import { useLayoutInit } from '@features/layout/application/hooks/useLayoutInit'
import { useLayoutResize } from '@features/layout/application/hooks/useLayoutResize'
import { useToolbarClickReset } from '@features/layout/application/hooks/useToolbarClickReset'
import { useSize } from '@shared/hooks/useSize'

import styles from './App.module.scss'

const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [colorToolbar, setColorToolbar] = useState<boolean | null>(null)

  const sectionEditorSize = useSize(formRef)

  useAuthInit()
  useLayoutInit()
  useLayoutResize(formRef, sectionEditorSize)

  const handleAppClick = useToolbarClickReset(colorToolbar, setColorToolbar)

  return (
    <div ref={appRef} className={styles.app} onClick={handleAppClick}>
      <Header />
      <main className={styles.app__main}>
        <CardMenu />
        <div ref={formRef} className={styles.app__form}>
          <ErrorBoundary>{sectionEditorSize && <CardPanel />}</ErrorBoundary>
          {sectionEditorSize && <CardSectionEditor />}
        </div>
      </main>
    </div>
  )
}

export default App
