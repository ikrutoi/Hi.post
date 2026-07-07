import React from 'react'

export const IconApplyBold = ({
  style,
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  const resolvedStroke =
    typeof style?.color === 'string' && style.color.length > 0
      ? style.color
      : 'currentColor'

  const pathStrokeStyle: React.CSSProperties | undefined =
    resolvedStroke !== 'currentColor' ? { stroke: resolvedStroke } : undefined

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1280 1280"
      fill="none"
      stroke={resolvedStroke}
      strokeWidth={140}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
      style={style}
    >
      <path
        data-apply-part="check"
        d="M422 567l218 219 582-583"
        style={pathStrokeStyle}
      />
      <path
        data-apply-part="frame"
        d="M1222 640v437c0 80-65 145-145 145l-874 1c-80-1-146-66-146-146V203c0-80 66-146 146-146h655"
        style={pathStrokeStyle}
      />
    </svg>
  )
}
