import React from 'react'
import styles from './EnvelopeOverlay.module.scss'

interface EnvelopeOverlayProps {
  sizeMiniCard: { width: number; height: number } | null
}

export const EnvelopeOverlay: React.FC<EnvelopeOverlayProps> = ({
  sizeMiniCard,
}) => {
  if (!sizeMiniCard?.width || !sizeMiniCard?.height) return null

  return (
    <svg
      className={styles.envelopeOverlay}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width={`${sizeMiniCard.width}px`}
      height={`${sizeMiniCard.height}px`}
      version="1.1"
      viewBox="0 0 76800 54100"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        imageRendering: 'optimizeQuality',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }}
    >
      <defs>
        <style type="text/css">
          {`
            .str0 {stroke:rgb(255,255,255);stroke-width:600;}
            .fil0 {fill:rgba(155,155,155,0.5);}
          `}
        </style>
      </defs>
      <g id="x0020_1">
        <path
          className="fil0 str0"
          d="M3126 12450l31217 20009c1224,732 2534,1352 4057,1352 1522,0 2758,-541 4057,-1352l31216 -20011c1667,-1137 3127,-3108 3127,-5680l0 -2758c0,-2210 -1792,-4002 -4002,-4002l-68796 0c-2210,0 -4002,1792 -4002,4002l0 2758c0,2563 1595,4733 3126,5682zm70547 -2l-31216 20011c-1299,811 -2535,1352 -4057,1352 -1523,0 -2833,-620 -4057,-1352l-31217 -20009c-1531,-949 -3126,-3119 -3126,-5682l0 43323c0,2210 1792,4002 4002,4002l68796 0c2210,0 4002,-1792 4002,-4002l0 -43323c0,2572 -1460,4543 -3127,5680z"
        />
      </g>
    </svg>
  )
}
