import React from 'react'
import clsx from 'clsx'
import { useSizeFacade } from '@layout/application/facades'
import { useMobileScenarioToolbar } from './MobileScenarioToolbarContext'

type MobileInlineToolbarRowProps = {
  className: string
  emptyClassName?: string
  show: boolean
  children: React.ReactNode
}

/** Desktop: inline toolbar row. Mobile: регистрирует содержимое в factory shell. */
export const MobileInlineToolbarRow: React.FC<MobileInlineToolbarRowProps> = ({
  className,
  emptyClassName,
  show,
  children,
}) => {
  const { isMobileLayout } = useSizeFacade()
  const mobileContent = show ? children : null

  useMobileScenarioToolbar(isMobileLayout ? mobileContent : null)

  if (isMobileLayout) return null

  return (
    <div
      className={clsx(className, !show && emptyClassName)}
      aria-hidden={show ? undefined : true}
    >
      {mobileContent}
    </div>
  )
}
