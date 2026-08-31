import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useSizeFacade } from '@layout/application/facades'
import { useMobileScenarioToolbar } from './MobileScenarioToolbarContext'

type MobileInlineToolbarRowProps = {
  className: string
  emptyClassName?: string
  show: boolean
  children: React.ReactNode
}

/**
 * Mobile: регистрирует содержимое в нижний ряд factory shell.
 * Desktop: секция без встроенного тулбара — ряд в карточке не рисуем.
 */
export const MobileInlineToolbarRow: React.FC<MobileInlineToolbarRowProps> = ({
  className,
  emptyClassName,
  show,
  children,
}) => {
  const { isMobileLayout } = useSizeFacade()

  const mobileContent = useMemo(() => {
    if (!isMobileLayout) return null
    if (show) {
      return <div className={className}>{children}</div>
    }
    if (emptyClassName != null) {
      return (
        <div
          className={clsx(className, emptyClassName)}
          aria-hidden
        />
      )
    }
    return null
  }, [isMobileLayout, show, className, emptyClassName, children])

  useMobileScenarioToolbar(mobileContent)

  return null
}
