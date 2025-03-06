import Label from '../Label/Label'
import './FormAddress.scss'
import { addIconToolbarEnvelope } from '../../../../../utils/envelope/addIconToolbarEnvelope'

const FormAddress = ({
  values,
  listLabelsAddress,
  handleValue,
  handleMovingBetweenInputs,
  setInputRef,
  myAddressRefs,
  toAddressRefs,
  // lengthAddress,
  handleClickBtn,
  setBtnIconRef,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  // dbPromise.then((db) => {
  //   const observeChanges = (storeName) => {
  //     const transaction = db.transaction(storeName, 'readwrite')
  //     const objectStore = transaction.objectStore(storeName)

  //     const onChange = (event) => {
  //       objectStore.count().then((count) => {
  //         console.log(`Number of entries in ${storeName}:`, count)
  //       })
  //     }

  //     transaction.oncomplete = onChange
  //     transaction.onabort = onChange
  //     transaction.onerror = onChange
  //   }

  //   observeChanges('myAddress')
  //   observeChanges('toAddress')
  // })

  const getAddressLegendRef = (section) => {
    switch (section) {
      case 'myaddress':
        return myAddressRefs[1]
      case 'toaddress':
        return toAddressRefs[1]
      default:
        return null
    }
  }

  const getAddressFieldsetRef = (section) => {
    switch (section) {
      case 'myaddress':
        return myAddressRefs[0]
      case 'toaddress':
        return toAddressRefs[0]
      default:
        return null
    }
  }

  const listBtns = ['save', 'delete', 'clip']

  const searchParentBtnNav = (el) => {
    if (el.classList.contains('toolbar-btn')) {
      return el
    } else if (el.parentElement) {
      return searchParentBtnNav(el.parentElement)
    }
    return null
  }

  const handleMouseEnterBtn = (evt) => {
    const parentBtnNav = searchParentBtnNav(evt.target)
    handleMouseEnter(parentBtnNav)
  }

  return (
    <form className={`envelope-form form-${listLabelsAddress.name}`}>
      <div
        className={`toolbar-envelope-container envelope-container-${listLabelsAddress.name}`}
      >
        {listBtns.map((btn, i) => {
          return (
            <button
              key={i}
              data-tooltip={btn}
              data-section={listLabelsAddress.name}
              ref={setBtnIconRef(`${listLabelsAddress.name}-${btn}`)}
              className={`toolbar-btn toolbar-btn-envelope btn-envelope-${btn}`}
              onClick={(evt) => handleClickBtn(evt, listLabelsAddress.name)}
              onMouseEnter={handleMouseEnterBtn}
              onMouseLeave={handleMouseLeave}
            >
              {addIconToolbarEnvelope(btn)}
            </button>
          )
        })}
      </div>
      <fieldset
        className="envelope-fieldset"
        ref={getAddressFieldsetRef(listLabelsAddress.name)}
      >
        <legend
          className="envelope-legend"
          ref={getAddressLegendRef(listLabelsAddress.name)}
        >
          {listLabelsAddress.name === 'myaddress' ? 'My address' : 'To address'}
        </legend>{' '}
        {listLabelsAddress.list.map((nameFirst, i) => {
          return typeof nameFirst === 'string' ? (
            <Label
              key={`${nameFirst}-${i}`}
              name={nameFirst}
              field={listLabelsAddress.name}
              values={values}
              handleValue={handleValue}
              handleMovingBetweenInputs={handleMovingBetweenInputs}
              setInputRef={setInputRef}
            />
          ) : (
            <div
              className="input-two-elements"
              key={`${listLabelsAddress.name}-${i}`}
            >
              {nameFirst.map((nameSecond, j) => (
                <Label
                  key={`${nameSecond}-${i}-${j}`}
                  name={nameSecond}
                  field={listLabelsAddress.name}
                  values={values}
                  handleValue={handleValue}
                  handleMovingBetweenInputs={handleMovingBetweenInputs}
                  setInputRef={setInputRef}
                />
              ))}
            </div>
          )
        })}
      </fieldset>
    </form>
  )
}

export default FormAddress
