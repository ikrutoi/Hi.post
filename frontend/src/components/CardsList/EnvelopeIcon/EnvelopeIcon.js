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
    >
      <defs>
        <style type="text/css">
          {`
        .str0 {stroke:rgb(0,125,250,0.4);stroke-width:236.221}
        .str1 {stroke:rgb(255,89,0);stroke-width:236.221}
        .fil0 {fill:rgba(0,125,250,0.4);}
        .fil1 {fill:rgba(255,89,0,0.4);}
      `}
        </style>
      </defs>
      <g id="x0020_1">
        <g id="_1771051233184">
          <path
            class="fil0 str0"
            d="M34336 32456l-31211 -20005c-1530,-950 -3125,-3119 -3125,-5681l0 43314c0,2210 1792,4002 4002,4002l68782 0c2210,0 4002,-1792 4002,-4002l0 -43314c0,2571 -1460,4542 -3127,5679l-31210 20007c-1298,811 -2534,1352 -4056,1352 -1523,0 -2833,-621 -4057,-1352z"
          />
          <path
            class="fil1 str1"
            d="M3140 12454l31211 20006c1224,731 2534,1352 4056,1352 1522,0 2758,-541 4056,-1352l31211 -20007c1667,-1137 3126,-3108 3126,-5679l0 -2758c0,-2210 -1792,-4001 -4002,-4001l-68782 0c-2210,0 -4002,1791 -4002,4001l0 2758c0,2562 1595,4731 3126,5680z"
          />
        </g>
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
