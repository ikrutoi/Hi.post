import './MiniEnvelope.scss'
import listLabelsMyAddress from '../../../../data/envelope/list-labels-my-address.json'
import listLabelsToAddress from '../../../../data/envelope/list-labels-to-address.json'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import MiniAddress from './MiniAddress/MiniAddress'

const MiniEnvelope = () => {
  const selectors = useSelector((state) => state.cardEdit)
  const valuesEnvelope =
    selectors.envelope.myaddress === null &&
    selectors.envelope.toaddress === null
      ? {
          toaddress: { street: '', index: '', city: '', country: '', name: '' },
          myaddress: { street: '', index: '', city: '', country: '', name: '' },
        }
      : selectors.envelope

  const [values, setValues] = useState(valuesEnvelope)

  const miniMyAddressRef = useRef()
  const miniToAddressRef = useRef()

  useEffect(() => {
    if (miniMyAddressRef.current && miniToAddressRef.current) {
      setValues(selectors.envelope)
      console.log('envelope:', selectors.envelope)
    }
  }, [selectors])

  return (
    <>
      <div className="mini-envelope-logo"></div>
      <div className="mini-envelope-address mini-envelope-myaddress">
        <MiniAddress
          ref={miniMyAddressRef}
          listLabelsAddress={{ list: listLabelsMyAddress, name: 'myaddress' }}
          values={values.myaddress}
        />
      </div>
      <div className="mini-envelope-address mini-envelope-toaddress">
        <MiniAddress
          ref={miniToAddressRef}
          listLabelsAddress={{ list: listLabelsToAddress, name: 'toaddress' }}
          values={values.toaddress}
        />
      </div>
      {/* <img
      className="mini-envelope"
      src="../../../data/envelope-mini-notactive.png"
      alt="Description"
      /> */}
    </>
  )
}

export default MiniEnvelope
