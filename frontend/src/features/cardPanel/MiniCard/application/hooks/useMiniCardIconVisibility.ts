import { useEffect, useState } from 'react'
import { SectionInfo } from '../../domain/types'

interface UseMiniCardIconVisibilityParams {
  infoMinimize: boolean
  showIconMinimize: boolean
  infoSection: SectionInfo
  minimize: boolean
}

export const useMiniCardIconVisibility = ({
  infoMinimize,
  showIconMinimize,
  infoSection,
  minimize,
}: UseMiniCardIconVisibilityParams) => {
  const [showIcon, setShowIcon] = useState(minimize)

  useEffect(() => {
    if (infoMinimize && !showIconMinimize) {
      const timer = setTimeout(() => setShowIcon(true), infoSection.i * 150)
      return () => clearTimeout(timer)
    }
    setShowIcon(!infoMinimize || !showIconMinimize)
  }, [showIconMinimize, infoMinimize, infoSection])

  return showIcon
}
