import { useCallback, useEffect, useRef, useState } from 'react'
import './CardMiniPuzzle.scss'
// import SpanCircle from './SpanCircle/SpanCircle'
// import cardMiniList from '../../../data/cardMiniList.json'
import { useSelector } from 'react-redux'
// import StripMiniSection from './StripMiniSection/StripMiniSection'
// import listNav from '../../../data/nav/navList.json'

const CardMiniPuzzle = ({
  hover,
  sizeCardMini,
  listSelectedSections,
  calcHeightMinicard,
}) => {
  const selectors = useSelector((state) => state.layout)
  const heightCardMini = sizeCardMini.height
  const widthCardMini = Number((heightCardMini * 1.42).toFixed(2))

  const [remSize, setRemSize] = useState(null)

  useEffect(() => {
    if (selectors.remSize) {
      setRemSize(selectors.remSize)
    }
  }, [selectors])

  const cardPuzzleRef = useRef(null)

  const updateHeight = useCallback(() => {
    if (remSize && cardPuzzleRef.current) {
      const newHeight = cardPuzzleRef.current.clientHeight - remSize
      calcHeightMinicard(newHeight)
    }
  }, [remSize, calcHeightMinicard])

  useEffect(() => {
    updateHeight()
  }, [updateHeight])

  // const widthStrip = Number((widthCardMini / 4.5).toFixed(2))
  // const addStripMiniSections = () => {
  //   const valueStrips = {
  //     cardphoto: {
  //       path: `0 0, ${widthStrip - 2} 0, ${widthStrip - widthStrip / 2 + 2} ${
  //         +heightCardMini + 2
  //       }, 0 ${heightCardMini + 2}`,
  //       color: 'white',
  //       // color: 'red',
  //       index: 0,
  //     },
  //     cardtext: {
  //       path: `${widthStrip - 2} 0, ${widthStrip * 2 - 2} 0, ${(
  //         widthStrip * 2 -
  //         widthStrip / 2 +
  //         2
  //       ).toFixed(2)} ${heightCardMini + 2}, ${
  //         widthStrip - widthStrip / 2 + 2
  //       } ${heightCardMini + 2}`,
  //       color: 'white',
  //       // color: 'orange',
  //       index: 1,
  //     },
  //     envelope: {
  //       path: `${widthStrip * 2 - 2} 0, ${widthStrip * 3 - 2} 0, ${(
  //         widthStrip * 3 -
  //         widthStrip / 2 +
  //         2
  //       ).toFixed(2)} ${heightCardMini + 2}, ${
  //         widthStrip * 2 - widthStrip / 2 + 2
  //       } ${heightCardMini + 2}`,
  //       color: 'white',
  //       // color: 'yellow',
  //       index: 2,
  //     },
  //     date: {
  //       path: `${widthStrip * 3 - 2} 0, ${widthStrip * 4 - 2} 0, ${
  //         widthStrip * 4 - +widthStrip / 2 + 2
  //       } ${heightCardMini + 2}, ${(
  //         widthStrip * 3 -
  //         widthStrip / 2 +
  //         2
  //       ).toFixed(2)} ${heightCardMini + 2}`,
  //       color: 'white',
  //       // color: 'green',
  //       index: 3,
  //     },
  //     aroma: {
  //       path: `${widthStrip * 4 - 2} 0, ${widthStrip * 5} 0, ${(
  //         widthStrip * 5 -
  //         widthStrip / 2 +
  //         2
  //       ).toFixed(2)} ${heightCardMini + 2}, ${
  //         widthStrip * 4 - widthStrip / 2 + 2
  //       } ${heightCardMini + 2}`,
  //       color: 'white',
  //       // color: 'blue',
  //       index: 4,
  //     },
  //   }

  //   return listNav
  //     .filter((el) => el !== 'History')
  //     .map((el, i) => {
  //       if (valueStrips[el.toLocaleLowerCase()]) {
  //         return (
  //           <StripMiniSection
  //             key={`${el}-${i}`}
  //             valueStrip={valueStrips[el.toLowerCase()]}
  //             nameStrip={el.toLowerCase()}
  //             widthStrip={widthStrip}
  //             heightStrip={heightCardMini}
  //           />
  //         )
  //       }
  //     })
  // }

  return (
    <div
      ref={cardPuzzleRef}
      className="card-mini-puzzle"
      style={{ width: `${widthCardMini}px`, height: `${heightCardMini}px` }}
    >
      {/* <svg
        className="strip-sections-container"
        width={`${widthCardMini}px`}
        height={`${heightCardMini}px`}
        viewBox={`0 0 ${widthCardMini} ${heightCardMini}`}
      >
        {addStripMiniSections()}
      </svg> */}
      {/* <img className="img-card-mini" alt="postcard mini" src={imgEmpty} /> */}
      {/* <div className="card-mini-circles">
        {cardMiniList.map((name, i) => (
          <SpanCircle
            listSelectedSections={listSelectedSections}
            name={name}
            key={`${name}-${i}`}
            hover={hover}
          />
        ))}
      </div> */}
    </div>
  )
}

export default CardMiniPuzzle
