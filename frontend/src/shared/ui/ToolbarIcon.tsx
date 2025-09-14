import React from 'react'

export const ToolbarIcon = ({
  icon,
  tooltip,
}: {
  icon: React.ReactElement
  tooltip: string
}) => (
  <div data-tooltip={tooltip} className="toolbar-icon-wrapper">
    {icon}
  </div>
)
