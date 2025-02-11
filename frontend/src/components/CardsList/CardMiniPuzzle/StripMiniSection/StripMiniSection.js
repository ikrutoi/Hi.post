import { useSelector } from 'react-redux'
import './StripMiniSection.scss'

const StripMiniSection = ({
  valueStrip,
  nameStrip,
  widthStrip,
  heightStrip,
  index,
}) => {
  const btnNavHover = useSelector((state) => state.layout.btnNavHover)
  return (
    <>
      {/* <defs>
        <pattern
          id={`pattern-${nameStrip}`}
          patternUnits="userSpaceOnUse"
          width={widthStrip}
          height={heightStrip}
          x="0"
          y="0"
        >
          <image
            href={img01}
            className={`strip-section strip-section-${nameStrip}`}
            x="-50"
            y="0"
            // width="50"
            // height="70"
          ></image>
        </pattern>
      </defs> */}
      <polygon
        className={`strip-mini strip-mini-${nameStrip} ${
          btnNavHover === nameStrip ? 'hover' : ''
        }`}
        points={valueStrip.path}
        // fill={`url(#pattern-${nameStrip})`}
        fill="rgba(255, 255, 255, 0)"
        data-section={nameStrip}
        zIndex={index}
      />
    </>
  )
}

export default StripMiniSection
