import React from 'react'

/**
 * Apply glyph. Source viewBox 1280×1280.
 * Frame stroke 107.498, check stroke 122.498.
 */
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
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
      style={style}
    >
      <path
        data-apply-part="frame"
        d="M1081 728v380c0 62-51 113-113 113H172c-62 0-113-51-113-113V312c0-62 51-113 113-113h398m0 0h169m342 529V543"
        strokeWidth={107.498}
        style={pathStrokeStyle}
      />
      <path
        data-apply-part="check"
        d="m352 492 218 218 582-583"
        strokeWidth={122.498}
        style={pathStrokeStyle}
      />
    </svg>
  )
}
