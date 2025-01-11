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
  const valuesEnvelope =
    selectors.envelope.myaddress === null &&
    selectors.envelope.toaddress === null
      ? {
          toaddress: { street: '', index: '', city: '', country: '', name: '' },
          myaddress: { street: '', index: '', city: '', country: '', name: '' },
        }
      : selectors.envelope

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

  const handleMovingBetweenInputs = (e) => {
    const indexInput = Number(e.target.dataset.index)
    const field = e.target.dataset.field
    if (
      e.key === 'ArrowDown' ||
      e.keyCode === 40 ||
      e.key === 'Enter' ||
      e.keyCode === 13
    ) {
      if (indexInput < 5) {
        inputRefs.current[`${field}${indexInput + 1}`].focus()
      } else {
        inputRefs.current[`${field}${indexInput}`].focus()
      }
    }
    if (e.key === 'ArrowUp' || e.keyCode === 38) {
      if (indexInput > 1) {
        inputRefs.current[`${field}${indexInput - 1}`].focus()
      } else {
        inputRefs.current[`${field}${indexInput}`].focus()
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
          handleMovingBetweenInputs={handleMovingBetweenInputs}
          setRef={setRef}
        />
      </div>
      <Mark />
      <div className="envelope-to-address">
        <FormToAddress
          values={values}
          handleValues={handleValues}
          handleMovingBetweenInputs={handleMovingBetweenInputs}
          setRef={setRef}
        />
      </div>
    </div>
  )
}

export default Envelope
