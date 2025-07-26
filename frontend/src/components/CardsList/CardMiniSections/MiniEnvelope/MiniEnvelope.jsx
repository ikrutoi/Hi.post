import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import './MiniEnvelope.scss'
import listLabelsMyAddress from '../../../../data/envelope/list-labels-my-address.json'
import listLabelsToAddress from '../../../../data/envelope/list-labels-to-address.json'
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

  const [value, setValue] = useState(valuesEnvelope)

  useEffect(() => {
    setValue(selectors.envelope)
  }, [selectors.envelope])

  return (
    <>
      <div className="mini-envelope-container-logo">
        <span className="mini-envelope-logo"></span>
      </div>
      <div className="mini-envelope-address mini-envelope-myaddress">
        <MiniAddress
          // ref={miniMyAddressRef}
          listLabelsAddress={{ list: listLabelsMyAddress, name: 'myaddress' }}
          values={value.myaddress}
          // miniMyAddressRef={miniMyAddressRef.current}
        />
      </div>
      <div className="mini-envelope-address mini-envelope-toaddress">
        <MiniAddress
          // ref={miniToAddressRef}
          listLabelsAddress={{ list: listLabelsToAddress, name: 'toaddress' }}
          values={value.toaddress}
          // miniToAddressRef={miniToAddressRef.current}
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
