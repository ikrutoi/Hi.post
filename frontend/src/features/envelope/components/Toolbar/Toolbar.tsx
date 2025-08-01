import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './Toolbar.scss'
import { RootState } from '@store/index'

const Toolbar: React.FC = () => {
  const layoutActiveEnvelope = useSelector(
    (state: RootState) => state.layout.activeSections.envelope
  )

  const [showText, setShowText] = useState<boolean>(false)

  useEffect(() => {
    if (!layoutActiveEnvelope) {
      const timer = setTimeout(() => setShowText(true), 600)
      return () => clearTimeout(timer)
    } else {
      setShowText(false)
    }
  }, [layoutActiveEnvelope])

  return (
    <div className="toolbar-envelope">
      {showText && (
        <p
          className="toolbar-envelope-text"
          style={{
            color: showText ? 'rgba(71, 71, 71, 1)' : 'rgba(71, 71, 71, 0)',
            transition: 'opacity 0.3s ease',
          }}
        >
          Fill in all the fields of the postcard recipient
        </p>
      )}
    </div>
  )
}

export default Toolbar
