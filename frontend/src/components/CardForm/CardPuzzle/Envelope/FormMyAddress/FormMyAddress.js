import listLabels from '../../../../../data/envelope/list-labels-my-address.json'
import Label from '../Label/Label'
import './FormMyAddress.scss'

const FormMyAddress = ({
  valueMyAddress,
  handleValueAddress,
  handleKeyArrow,
  setRef,
}) => {
  return (
    <form className="envelope-form form-my-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">My address</legend>
        {listLabels.map((nameFirst, i) => {
          return typeof nameFirst === 'string' ? (
            <Label
              key={`${nameFirst.split('-')[1]}-${i}`}
              name={nameFirst}
              valueMyAddress={valueMyAddress}
              handleValueAddress={handleValueAddress}
              handleKeyArrow={handleKeyArrow}
              setRef={setRef}
            />
          ) : (
            <div className="input-two-elements">
              {nameFirst.map((nameSecond, i) => (
                <Label
                  key={`${nameSecond.split('-')[1]}-${
                    nameSecond.split('-')[0]
                  }`}
                  name={nameSecond}
                  valueMyAddress={valueMyAddress}
                  handleValueAddress={handleValueAddress}
                  handleKeyArrow={handleKeyArrow}
                  setRef={setRef}
                />
              ))}
            </div>
          )
        })}
      </fieldset>
    </form>
  )
}

export default FormMyAddress
