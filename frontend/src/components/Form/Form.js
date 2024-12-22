import { useRef, useEffect, useState } from 'react'
import './Form.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'
import CardMiniPuzzle from './CardMiniPuzzle/CardMiniPuzzle'

const Form = ({ name, hover }) => {
  const componentRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  useEffect(() => {
    // const handleResize = () => {
    //   if (componentRef.current) {
    //     setDimensions({
    //       width: componentRef.current.offsetWidth,
    //       height: componentRef.current.offsetHeight,
    //     })
    //   }
    // }

    const handleResize = () => {
      if (componentRef.current) {
        const { offsetWidth, offsetHeight } = componentRef.current
        setDimensions((prevDimensions) => {
          if (
            prevDimensions.width !== offsetWidth ||
            prevDimensions.height !== offsetHeight
          ) {
            return { width: offsetWidth, height: offsetHeight }
          }
          return prevDimensions
        })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    if (componentRef.current) {
      resizeObserver.observe(componentRef.current)
    }

    handleResize()

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  console.log(componentRef.current)

  return (
    <div className="form">
      <div className="form-list">
        <CardMiniPuzzle hover={hover} dimensionHeight={dimensions.height} />
      </div>
      <div className="form-down" ref={componentRef}>
        <CardPuzzle
          name={name}
          dimensionHeight={dimensions.height}
        ></CardPuzzle>
      </div>
    </div>
  )
}

export default Form
