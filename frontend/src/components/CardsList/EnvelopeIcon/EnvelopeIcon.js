import './EnvelopeIcon.scss'

const EnvelopeIcon = ({ sizeMiniCard }) => {
  return (
    <svg
      className="envelope-clear-img"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width={`${sizeMiniCard.width}px`}
      height={`${sizeMiniCard.height}px`}
      version="1.1"
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        imageRendering: 'optimizeQuality',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }}
      viewBox="0 0 76800 54100"
      xmlnsXlink="http://www.w3.org/1999/xlink"
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

    // <svg
    //   className="envelope-icon"
    //   xmlns="http://www.w3.org/2000/svg"
    //   xmlSpace="preserve"
    //   // width={`${sizeMiniCard.width}px`}
    //   // height={`${sizeMiniCard.height}px`}
    //   version="1.1"
    //   style={{
    //     width: `${sizeMiniCard.width}px`,
    //     height: `${sizeMiniCard.height}px`,
    //     shapeRendering: 'geometricPrecision',
    //     textRendering: 'geometricPrecision',
    //     imageRendering: 'optimizeQuality',
    //     fillRule: 'evenodd',
    //     clipRule: 'evenodd',
    //   }}
    //   viewBox="0 0 25600 18000"
    // >
    //   <defs>
    //     <style type="text/css">
    //       {`
    //         .str0 {stroke:rgb(0,125,250);stroke-width:220;}
    //         .fil0 {fill:rgba(200,200,200,0.6);}
    //       `}
    //     </style>
    //   </defs>
    //   <g id="x0020_1">
    //     <path
    //       className="fil0 str0"
    //       d="M1424 56l22752 0c731,0 1324,593 1324,1324l0 15240c0,731 -593,1324 -1324,1324l-22752 0c-731,0 -1324,-593 -1324,-1324l0 -15240c0,-731 593,-1324 1324,-1324zm-1324 2236c0,847 528,1565 1034,1879l10324 6618c405,242 838,447 1342,447 504,0 912,-179 1342,-447l10324 -6619c551,-375 1034,-1027 1034,-1878"
    //     />
    //   </g>
    // </svg>
  )
}

export default EnvelopeIcon
