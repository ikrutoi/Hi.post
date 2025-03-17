import { useSelector } from 'react-redux'
import './ToolbarEnvelope.scss'

const ToolbarEnvelope = () => {
  const layoutActiveEnvelope = useSelector(
    (state) => state.layout.activeSections.envelope
  )

  return (
    <div className="toolbar-envelope">
      {!layoutActiveEnvelope && (
        <p className="toolbar-envelope-text">
          Fill in all the fields of the postcard recipient
        </p>
      )}
    </div>
  )
}

export default ToolbarEnvelope
