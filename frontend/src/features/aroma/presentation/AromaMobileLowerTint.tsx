import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import styles from './Aroma.module.scss'

/** Mobile factory: empty lower band with aroma role fade (apply lives on upper). */
export const AromaMobileLowerTint: React.FC = () => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)

  const content = useMemo(() => {
    if (!isMobileLayout) return null
    return (
      <div
        className={styles.aromaToolbarBand}
        data-aroma-toolbar-band
        aria-hidden
      />
    )
  }, [isMobileLayout])

  useMobileScenarioToolbar(content)

  return null
}
