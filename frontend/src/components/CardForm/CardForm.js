// import useResizeObserver from '@react-hook/resize-observer'
// import { useRef, useState, useLayoutEffect } from 'react'
import './CardForm.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'

// const useSize = (target) => {
//   const [size, setSize] = useState()

//   useLayoutEffect(() => {
//     setSize(target.current.getBoundingClientRect())
//   }, [target])

//   useResizeObserver(target, (entry) => setSize(entry.contentRect))
//   return size
// }

const CardForm = ({ name, hover, dimensionHeight, dimensionWidth }) => {
  // const target = useRef(null)
  // const size = useSize(target)

  return (
    <div className="card-form">
      <CardPuzzle
        name={name}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
      />
    </div>
  )
}

export default CardForm
