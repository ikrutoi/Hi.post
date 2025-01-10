import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import './Envelope.scss'
import { addEnvelope } from '../../../../redux/cardEdit/actionCreators'
import FormMyAddress from './FormMyAddress/FormMyAddress'
import FormToAddress from './FormToAddress/FormToAddress'
import Mark from './Mark/Mark'

const Envelope = () => {
  const selectors = useSelector((state) => state.cardEdit)
  const valuesEnvelope = selectors.envelope
    ? selectors.envelope
    : {
        toaddress: { street: '', index: '', city: '', country: '', name: '' },
        myaddress: { street: '', index: '', city: '', country: '', name: '' },
      }

  const [values, setValues] = useState(valuesEnvelope)

  const handleValues = (field, input, value) => {
    setValues((state) => {
      return { ...state, [field]: { ...state[field], [input]: value } }
    })
  }

  const inputRefs = useRef({})
  const setRef = (id) => (element) => {
    inputRefs.current[id] = element
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(addEnvelope(values))
  }, [dispatch, values])

  const handleKeyArrow = (e) => {
    const indexInput = Number(e.target.dataset.index)
    if (e.key === 'ArrowDown' || e.keyCode === 40) {
      if (indexInput < 5) {
        inputRefs.current[`toaddress${indexInput + 1}`].focus()
      } else {
        inputRefs.current[`toaddress${indexInput}`].focus()
      }
    }
    if (e.key === 'ArrowUp' || e.keyCode === 38) {
      if (indexInput > 1) {
        inputRefs.current[`toaddress${indexInput - 1}`].focus()
      } else {
        inputRefs.current[`toaddress${indexInput}`].focus()
      }
    }
  }

  return (
    <div className="envelope">
      <div className="envelope-my-address">
        <div className="envelope-logo">Hidragonfly.com</div>
        <FormMyAddress
          values={values}
          handleValues={handleValues}
          handleKeyArrow={handleKeyArrow}
          setRef={setRef}
        />
      </div>
      <Mark />
      <div className="envelope-to-address">
        <FormToAddress
          values={values}
          handleValues={handleValues}
          handleKeyArrow={handleKeyArrow}
          setRef={setRef}
        />
      </div>
    </div>
  )
}

export default Envelope
