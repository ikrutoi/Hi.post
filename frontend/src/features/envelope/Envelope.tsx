import { useRef } from 'react'
import EnvelopeView from '@features/envelope/components/EnvelopeView'

const Envelope = () => {
  const cardPuzzleRef = useRef<HTMLDivElement>(null!)
  return (
    <div className="envelope">
      <EnvelopeView cardPuzzleRef={cardPuzzleRef} />
    </div>
  )
}

export default Envelope
