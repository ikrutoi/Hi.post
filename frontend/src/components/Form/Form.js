import useResizeObserver from '@react-hook/resize-observer'
import { useRef, useState, useLayoutEffect } from 'react'
import './Form.scss'
import CardPuzzle from './CardPuzzle/CardPuzzle'
import CardMiniPuzzle from './CardMiniPuzzle/CardMiniPuzzle'

const useSize = (target) => {
  const [size, setSize] = useState()

  useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

const Form = ({ name, hover }) => {
  const target = useRef(null)
  const size = useSize(target)

  return (
    <div className="form">
      {size && (
        <div className="form-list">
          <CardMiniPuzzle
            hover={hover}
            dimensionHeight={size.height}
            dimensionWidth={size.width}
          />
        </div>
      )}
      <div className="form-down" ref={target}>
        {size && (
          <CardPuzzle
            name={name}
            dimensionHeight={size.height}
            dimensionWidth={size.width}
          ></CardPuzzle>
        )}
      </div>
    </div>
  )
}

export default Form
