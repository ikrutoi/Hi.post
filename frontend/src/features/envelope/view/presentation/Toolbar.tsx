import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './Toolbar.scss'
import type { RootState } from '@app/store'

export const Toolbar: React.FC = () => {
  const isEnvelopeActive = useSelector(
    (state: RootState) => state.layout.activeSections.envelope
  )

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isEnvelopeActive) {
      const timer = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [isEnvelopeActive])

  return (
    <div className="toolbar">
      {visible && (
        <p className="toolbar__text">
          Fill in all the fields of the postcard recipient
        </p>
      )}
    </div>
  )
}
